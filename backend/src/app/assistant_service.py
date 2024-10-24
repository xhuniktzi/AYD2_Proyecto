from flask import Blueprint, jsonify, request

from sqlalchemy import and_
from app.models import DriverState, User, Driver, Gender, UserState, Trip, TripState, RemovedUsers, RemovedDrivers
from app.utils import read_config
from app.models import db
from typing import Optional, TypedDict, cast

assistant = Blueprint('assistant', __name__)

@assistant.route('/applicants', methods=['GET'])
def get_applicants():
    '''
    Endpoint to get current applicants
    '''
    applicants: list[Driver] = Driver.query.filter(
        Driver.state_id == int(read_config('user-not-checkin'))
    ).all()
    return jsonify(list(map(lambda applicant: {
        'driver_id': applicant.id,
        'fullname': applicant.fullname,
        'car_brand': applicant.car_brand,
        'car_model_year': applicant.car_model_year,
    }, applicants)))

@assistant.route('/applicants/<id>/hire', methods=['PATCH'])
def hire_applicant(id: str):
    '''
    Endpoint to hire a driver
    '''
    driver: Optional[Driver] = Driver.query.get(id)
    if not driver:
        return jsonify({'msg': "Driver doesn't exist"}), 404
    driver.state_id = int(read_config('user-active'))
    db.session.commit()

    return jsonify({'msg': 'Updated applicant status'})

@assistant.route('/drivers', methods=['GET'])
def get_drivers():
    '''
    Endpoint to get the list of drivers
    '''
    state_non_verified = read_config('user-not-checkin')
    drivers: list[Driver] = Driver.query.filter(Driver.state_id != state_non_verified).all()
    return jsonify(list(map(lambda driver: {
        'driver_id': driver.id,
        'fullname': driver.fullname,
        'email': driver.email,
        'state': getattr(DriverState.query.get(driver.state_id), 'name', None)
    }, drivers)))

@assistant.route('/drivers/<id>', methods=['GET'])
def get_driver(id: str):
    '''
    Endpoint to get a driver by account id
    '''
    driver: Optional[Driver] = Driver.query.get(id)
    if not driver:
        return jsonify({'msg': "Driver doesn't exist"}), 404
    trips = cast(list[Trip], driver.trips)
    removed_driver = cast(Optional[RemovedDrivers], RemovedDrivers.query.filter_by(driver_id=driver.id).first())
    return jsonify({
        'driver_id': driver.id,
        'fullname': driver.fullname,
        'email': driver.email,
        'phone_number': driver.phone_number,
        'age': driver.age,
        'dpi_number': driver.dpi_number,
        'car_brand': driver.car_brand,
        'car_model_year': driver.car_model_year,
        'plate_number': driver.plate_number,
        'genero': getattr(Gender.query.get(driver.genero_id), 'name', None),
        'comment': getattr(removed_driver, 'comment', None),
        'state': getattr(DriverState.query.get(driver.state_id), 'name', None),
        'trips': list(map(lambda trip: {
            'id': trip.id,
            'passenger': getattr(User.query.get(trip.user_id), 'fullname', None),
            'origin': trip.origin,
            'destination': trip.destination,
            'start_time': trip.start_time,
            'status': getattr(TripState.query.get(trip.status), 'name', None)
        }, trips))
    })

@assistant.route('/users', methods=['GET'])
def get_users():
    '''
    Endpoint to get the list of users
    '''
    users: list[User] = User.query.all()
    return jsonify(list(map(lambda user: {
        'id': user.id,
        'fullname': user.fullname,
        'email': user.email,
        'state': getattr(UserState.query.get(user.state_id), 'name', None)
    }, users)))

@assistant.route('/users/<id>', methods=['GET'])
def get_user(id: str):
    '''
    Endpoint to get a user's info
    '''
    user: Optional[User] = User.query.get(id)
    if not user:
        return jsonify({'msg': "User doesn't exist"}), 404

    removed_user = cast(Optional[RemovedUsers], RemovedUsers.query.filter_by(user_id=user.id).first())
    return jsonify({
        'id': user.id,
        'fullname': user.fullname,
        'username': user.username,
        'fecha_nac': user.fecha_nac,
        'genero': getattr(Gender.query.get(user.genero_id), 'name', None),
        'email': user.email,
        'phone_number': user.phone_number,
        'state': getattr(UserState.query.get(user.state_id), 'name', None),
        'comment': getattr(removed_user, 'comment', None)
    })

@assistant.route('/users/<id>/trips', methods=['GET'])
def get_user_trips(id: str):
    '''
    Endpoint to get a user's trips
    '''
    trips: list[Trip] = Trip.query.filter(
        and_(Trip.status != read_config("trip-pending"), Trip.user_id == id)
    ).all()
    return jsonify(list(map(lambda trip: {
        'id': trip.id,
        'driver': getattr(Driver.query.get(trip.driver_id), 'fullname', None),
        'origin': trip.origin,
        'destination': trip.destination,
        'start_time': trip.start_time,
        'status': getattr(TripState.query.get(trip.status), 'name', None)
    }, trips)))

class DeleteRequest(TypedDict):
    id: int
    comment: str

@assistant.route('/users/', methods=['POST'])
def delete_user():
    '''
    Endpoint to delete a user
    '''
    user_data: DeleteRequest = request.get_json()
    user: Optional[User] = User.query.get(user_data.get('id'))
    if not user:
        return jsonify({'msg': "User doesn't exists"}), 404
    user.state_id = int(read_config('user-removed'))

    removed_user = RemovedUsers()
    removed_user.user_id = user_data.get('id')
    removed_user.comment = user_data.get('comment')
    db.session.add(removed_user)
    db.session.commit()

    return jsonify({'msg': "Deleted user"})

@assistant.route('/drivers/', methods=['POST'])
def delete_driver():
    '''
    Endpoint to delete a driver
    '''
    driver_data: DeleteRequest = request.get_json()
    driver: Optional[Driver] = Driver.query.get(driver_data.get('id'))
    if not driver:
        return jsonify({'msg': "driver doesn't exists"}), 404
    driver.state_id = int(read_config('user-removed'))

    removed_driver = RemovedDrivers()
    removed_driver.driver_id = driver_data.get('id')
    removed_driver.comment = driver_data.get('comment')
    db.session.add(removed_driver)
    db.session.commit()

    return jsonify({'msg': "Deleted driver"})
