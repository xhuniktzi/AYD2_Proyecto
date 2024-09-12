from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from app.utils import get_current_user
from app.models import Trip, db

trip = Blueprint('trip', __name__)

@trip.route('/create', methods=['POST'])
@jwt_required()
def create_trip():
    user = get_current_user()
    data = request.get_json()
    trip = Trip(
        user_id=user.id,
        origin=data['origin'],
        destination=data['destination'],
        status='pending'
    )
    db.session.add(trip)
    db.session.commit()
    return jsonify({"msg": "Trip created successfully"}), 201
