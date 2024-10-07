<<<<<<< Updated upstream
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

=======
from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
from flask_jwt_extended import create_access_token
from app.models import Driver, Trip, ProblemReport,User, db
from datetime import datetime

driver = Blueprint("driver", __name__)
#Obtener lista de viajes
@driver.route("/trips", methods=["GET"])
def get_trips():
    trips = Trip.query.all()

    if not trips:
        return jsonify({"msg": "No hay viajes registrados"}), 404

    trip_list = []
    for trip in trips:
        user = User.query.filter_by(id=trip.user_id).first()
        driver = Driver.query.filter_by(id=trip.driver_id).first()

        trip_info = {
            "trip_id": trip.id,
            "origin": trip.origin,
            "destination": trip.destination,
            "start_time": trip.start_time.strftime('%Y-%m-%d %H:%M:%S'),
            "end_time": trip.end_time.strftime('%Y-%m-%d %H:%M:%S') if trip.end_time else None,
            "tarifa": trip.tarifa,
            "status": trip.status,
            "user_info": {
                "user_id": user.id,
            },
        }
        trip_list.append(trip_info)

    return jsonify(trip_list), 200

# Aceptar viaje
@driver.route("/accept_trip", methods=["POST"])
def accept_trip():
    data = request.get_json()
    trip_id = data.get("trip_id")
    driver_id = data.get("driver_id")

    trip = Trip.query.filter_by(id=trip_id, status=2).first()  # 3 = Aceptado o en progreso
    if not trip:
        return jsonify({"msg": "Viaje no disponible o ya aceptado"}), 400

    trip.driver_id = driver_id
    trip.status = 3  # 3 = Aceptado o en progreso
    db.session.commit()

    return jsonify({"msg": "Viaje aceptado"}), 200


# Cancelar viaje
@driver.route("/cancel_trip", methods=["POST"])
def cancel_trip():
    data = request.get_json()
    trip_id = data.get("trip_id")
    driver_id = data.get("driver_id")
    reason = data.get("reason")

    trip = Trip.query.filter_by(id=trip_id, driver_id=driver_id, status=1).first()  #1 = pendiente
    #No se encontro el viaje o no se puede cancelar
    if not trip:
        return jsonify({"msg": "No se puede cancelar este viaje"}), 400

    trip.status = 1  # 1 = cancelado
    trip.cancellation_reason = reason
    db.session.commit()

    return jsonify({"msg": "Viaje cancelado"}), 200



# Reportar un problema
@driver.route("/report_issue", methods=["POST"])
def report_problem():
    data = request.get_json()
    user_id = data["user_id"]
    trip_id = data.get("trip_id", None)  # El trip_id puede ser opcional
    description = data["description"]

    # Crear nuevo reporte de problema
    new_report = ProblemReport(
        user_id=user_id,
        trip_id=trip_id,
        description=description,
        status=1  # Status inicial "Pendiente"
    )

    db.session.add(new_report)
    db.session.commit()

    return jsonify({
        "msg": "Problema reportado",
        "report_id": new_report.id,
        "created_at": new_report.created_at
    }), 201


# Ver información del usuario
@driver.route("/user_trip/<int:trip_id>", methods=["GET"])
def get_user_info_by_trip(trip_id):
    trip = Trip.query.filter_by(id=trip_id).first()

    if not trip:
        return jsonify({"msg": "Viaje no encontrado"}), 404

    user = User.query.filter_by(id=trip.user_id).first()

    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    user_info = {
        "fullname": user.fullname,
        "username": user.username,
        "fecha_nac": user.fecha_nac.strftime('%Y-%m-%d'),
        "email": user.email,
        "phone_number": user.phone_number,
        "genero_id": user.genero_id
    }

    return jsonify(user_info), 200



# Finalizar viaje y recibir pago
@driver.route("/complete_trip", methods=["POST"])
def end_trip():
    data = request.get_json()
    trip_id = data.get("trip_id")
    driver_id = data.get("driver_id")
    payment_received = data.get("payment_received")

    trip = Trip.query.filter_by(id=trip_id, driver_id=driver_id, status=3).first()  # 3 = en progreso
    if not trip:
        return jsonify({"msg": "No se puede finalizar este viaje"}), 400

    trip.end_time = datetime.now()
    trip.status = 4  # 4 = finalizado
    trip.payment_received = payment_received
    db.session.commit()

    return jsonify({"msg": "Viaje finalizado"}), 200
>>>>>>> Stashed changes
