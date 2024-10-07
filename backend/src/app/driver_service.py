from flask import Blueprint, request, jsonify
from app.models import Driver, Trip, ProblemReport,User, db
from datetime import datetime

from app.utils import read_config

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

    trip = Trip.query.filter_by(id=trip_id, status=int(read_config('trip-pending'))).first()  # 3 = Aceptado o en progreso
    if not trip:
        return jsonify({"msg": "Viaje no disponible o ya aceptado"}), 400

    trip.driver_id = driver_id
    trip.status = int(read_config('trip-accept'))  # 3 = Aceptado o en progreso
    db.session.commit()

    return jsonify({"msg": "Viaje aceptado"}), 200


# Cancelar viaje
@driver.route("/cancel_trip", methods=["POST"])
def cancel_trip():
    data = request.get_json()
    trip_id = data.get("trip_id")
    driver_id = data.get("driver_id")
    reason = data.get("reason")

    trip = Trip.query.filter_by(id=trip_id, driver_id=driver_id, status=int(read_config('trip-accept'))).first()  #1 = pendiente
    #No se encontro el viaje o no se puede cancelar
    if not trip:
        return jsonify({"msg": "No se puede cancelar este viaje"}), 400

    trip.status = read_config('trip-canceled')  # 1 = cancelado
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
        status=int(read_config('report-open'))  # Status inicial "Pendiente"
    )

    db.session.add(new_report)
    db.session.commit()

    return jsonify({
        "msg": "Problema reportado",
        "report_id": new_report.id,
        "created_at": new_report.created_at
    }), 201


# Ver información del usuario
@driver.route("/user_trip/<trip_id>", methods=["GET"])
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

    trip = Trip.query.filter_by(id=trip_id, driver_id=driver_id, status=int(read_config('trip-accept'))).first()  # 3 = en progreso
    if not trip:
        return jsonify({"msg": "No se puede finalizar este viaje"}), 400

    trip.end_time = datetime.now()
    trip.status = 4  # 4 = finalizado
    trip.payment_received = payment_received
    db.session.delete(trip)
    db.session.commit()

    return jsonify({"msg": "Viaje finalizado"}), 200
