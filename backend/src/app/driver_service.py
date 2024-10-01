from flask import Blueprint, jsonify, request
from flask_jwt_extended import  jwt_required
from app.models import Driver, ProblemReport, Trip, Tarifa, db
from app.utils import get_current_user, read_config
from datetime import datetime

driver = Blueprint("driver", __name__)


# Endpoint for requesting a trip
@driver.route("/request", methods=["POST"])
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

    # Accept the trip request
    new_trip = Trip(
        user_id=user_id,
        origin=origin,
        destination=destination,
        start_time=datetime.now(),
        tarifa=data.get("tarifa"),
        status=int(read_config("trip-accepted")),
    )
    db.session.add(accepted_trip)
    db.session.commit()

    return jsonify({"msg": "Trip requested successfully", "trip_id": accepted_trip.id})

