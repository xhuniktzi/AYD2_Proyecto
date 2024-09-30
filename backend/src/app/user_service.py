from flask import Blueprint, jsonify, request
from flask_jwt_extended import  jwt_required
from app.models import Driver, ProblemReport, Trip, Tarifa, db
from app.utils import get_current_user, read_config
from datetime import datetime

user = Blueprint("user", __name__)


# Endpoint for requesting a trip
@user.route("/request", methods=["POST"])
@jwt_required()
def user_request():
    data = request.get_json()
    user_id = get_current_user().id
    origin = data.get("origin")
    destination = data.get("destination")

    # Check if there is an active trip
    active_trip = Trip.query.filter_by(
        user_id=user_id, status=int(read_config("trip-accept"))
    ).first()
    if active_trip:
        return jsonify({"msg": "User already has an active trip"}), 400

    # Create a new trip
    new_trip = Trip(
        user_id=user_id,
        origin=origin,
        destination=destination,
        start_time=datetime.now(),
        tarifa=data.get("tarifa"),
        status=int(read_config("trip-pending")),
    )
    db.session.add(new_trip)
    db.session.commit()

    return jsonify({"msg": "Trip requested successfully", "trip_id": new_trip.id}), 200


# Endpoint for canceling a trip
@user.route("/cancel/<trip_id>", methods=["POST"])
@jwt_required()
def user_cancel(trip_id):
    user_id = get_current_user().id
    trip = Trip.query.filter_by(id=trip_id, user_id=user_id).first()

    if not trip:
        return jsonify({"msg": "Trip not found"}), 404

    if trip.status == int(read_config("trip-complete")):
        return jsonify({"msg": "Trip already completed"}), 400

    trip.status = int(read_config("trip-canceled"))
    db.session.commit()

    return jsonify({"msg": "Trip canceled successfully"}), 200


# Endpoint for reporting a problem
@user.route("/report/<trip_id>", methods=["POST"])
@jwt_required()
def user_report(trip_id):
    data = request.get_json()
    user_id = get_current_user().id

    # Ensure trip exists
    trip = Trip.query.filter_by(id=trip_id, user_id=user_id).first()
    if not trip:
        return jsonify({"msg": "Trip not found"}), 404

    # Create the problem report
    report = ProblemReport(
        user_id=user_id,
        trip_id=trip.id,
        description=data.get("description"),
        created_at=datetime.now(),
        status=int(read_config("report-open")),
    )
    db.session.add(report)
    db.session.commit()

    return jsonify({"msg": "Problem reported successfully"}), 200


# Modified Endpoint to return trip info even if the driver is not assigned
@user.route("/info/<trip_id>", methods=["GET"])
@jwt_required()
def user_info(trip_id):
    user_id = get_current_user().id
    trip = Trip.query.filter_by(id=trip_id, user_id=user_id).first()

    if not trip:
        return jsonify({"msg": "Trip not found"}), 404

    if not trip.driver_id:
        # Return trip details without driver info if the driver is not assigned
        return jsonify({
            "origin": trip.origin,
            "destination": trip.destination,
            "tarifa": trip.tarifa,
            "status": "Driver not assigned yet"
        }), 200

    # If driver is assigned, return both trip and driver info
    driver = Driver.query.get(trip.driver_id)
    
    return jsonify({
        "driver_name": driver.fullname,
        "car_brand": driver.car_brand,
        "car_model_year": driver.car_model_year,
        "plate_number": driver.plate_number,
        "car_photo": driver.car_photo,
        "origin": trip.origin,
        "destination": trip.destination,
        "tarifa": trip.tarifa,
        "status": "Driver assigned"
    }), 200



# Endpoint to retrieve available origins and destinations from the Tarifa table
@user.route("/tarifas", methods=["GET"])
@jwt_required()
def get_tarifas():
    tarifas = Tarifa.query.all()

    result = []
    for tarifa in tarifas:
        result.append(
            {
                "origin": tarifa.origin,
                "destination": tarifa.destination,
                "price": tarifa.price,
            }
        )

    return jsonify(result), 200
