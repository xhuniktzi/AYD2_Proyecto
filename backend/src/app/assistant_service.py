from flask import Blueprint, jsonify
from sqlalchemy import and_
from app.models import User, Driver, Gender, UserState, Trip, TripState
from app.utils import read_config
from app.models import db

assistant = Blueprint('assistant', __name__)

@assistant.route('/applicants', methods=['GET'])
def getApplicants():
    '''
    Endpoint to get current applicants
    '''
    applicants: list[Driver] = Driver.query.filter(
        Driver.state_id == read_config('user-not-checkin')
    ).all()
    return jsonify(list(map(lambda applicant: {
        'driver_id': applicant.id,
        'fullname': applicant.fullname,
        'car_brand': applicant.car_brand,
        'car_model_year': applicant.car_model_year,
    }, applicants)))

@assistant.route('/applicants/<id>/hire', methods=['PATCH'])
def hireApplicant(id: str):
    '''
    Endpoint to hire a driver
    '''
    driver: Driver = Driver.query.get(id)
    driver.state_id = int(read_config('user-active'))
    db.session.commit()
    
    return jsonify({'msg': 'Updated applicant status'})

@assistant.route('/drivers', methods=['GET'])
def getDrivers():
    '''
    Endpoint to get the list of users
    '''
    state_non_verified = read_config('user-not-checkin')
    drivers: list[Driver] = Driver.query.filter(Driver.state_id != state_non_verified).all()
    return jsonify(list(map(lambda driver: {
        'driver_id': driver.id,
        'fullname': driver.fullname,
        'email': driver.email
    }, drivers)))

@assistant.route('/drivers/<id>', methods=['GET'])
def getDriver(id: str):
    '''
    Endpoint to get a driver by account id
    '''
    driver: Driver = Driver.query.filter_by(id=id).first()
    if not driver:
        return jsonify({'msg': "Driver doesn't exist"}), 404
    trips: list[Trip] = driver.trips
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
        'genero': Gender.query.get(driver.genero_id).name,
        'trips': list(map(lambda trip: {
            'id': trip.id,
            'passenger': User.query.get(trip.user_id).fullname,
            'origin': trip.origin,
            'destination': trip.destination,
            'start_time': trip.start_time,
            'status': TripState.query.get(trip.status).name
        }, trips))
    })

@assistant.route('/users', methods=['GET'])
def getUsers():
    '''
    Endpoint to get the list of users
    '''
    users: list[User] = User.query.all()
    return jsonify(list(map(lambda user: {
        'id': user.id,
        'fullname': user.fullname,
        'email': user.email
    }, users)))

@assistant.route('/users/<id>', methods=['GET'])
def getUser(id: str):
    '''
    Endpoint to get a user's info
    '''
    user: User = User.query.get(id)
    return jsonify({
        'id': user.id,
        'fullname': user.fullname,
        'username': user.username,
        'fecha_nac': user.fecha_nac,
        'genero': Gender.query.get(user.genero_id).name,
        'email': user.email,
        'phone_number': user.phone_number,
        'state': UserState.query.get(user.state_id).name
    })

@assistant.route('/users/<id>/trips', methods=['GET'])
def getUserTrips(id: str):
    '''
    Endpoint to get a user's trips
    '''
    trips: list[Trip] = Trip.query.filter(
        and_(Trip.status != read_config("trip-pending"), Trip.user_id == id)
    ).all()
    return jsonify(list(map(lambda trip: {
        'id': trip.id,
        'driver': Driver.query.get(trip.driver_id).fullname,
        'origin': trip.origin,
        'destination': trip.destination,
        'start_time': trip.start_time,
        'status': TripState.query.get(trip.status).name
    }, trips)))
