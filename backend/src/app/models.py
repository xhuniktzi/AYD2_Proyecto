from app.extensions import db

# Modelo de Administrador
class Administrador(db.Model):
    ID_Administrador = db.Column(db.Integer, primary_key=True)
    Nombre_Completo = db.Column(db.String(200), nullable=False)
    Correo = db.Column(db.String(100), unique=True, nullable=False)
    Contraseña = db.Column(db.String(100), nullable=False)
    Archivo_TextoPlano = db.Column(db.String(200), nullable=True)

# Modelos de Estado
class UserState(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)


class DriverState(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)


class TripState(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)


class ReportState(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)


class MaritalStatus(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)


# Modelo de Género
class Gender(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    abreviature = db.Column(db.String(80), unique=True, nullable=False)


# Modelos principales
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fullname = db.Column(db.String(200), nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    fecha_nac = db.Column(db.Date, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    genero_id = db.Column(db.Integer, db.ForeignKey('gender.id'), nullable=False)
    email = db.Column(db.String(80), unique=True, nullable=False)
    phone_number = db.Column(db.String(80), unique=True, nullable=False)
    state_id = db.Column(db.Integer, db.ForeignKey('user_state.id'), nullable=False)


class Driver(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fullname = db.Column(db.String(200), nullable=False)
    phone_number = db.Column(db.String(80), unique=True, nullable=False)
    age = db.Column(db.Integer, nullable=False)
    dpi_number = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(80), unique=True, nullable=False)
    cv_pdf = db.Column(db.String(200), nullable=False)
    photo = db.Column(db.String(200), nullable=False)
    car_photo = db.Column(db.String(200), nullable=False)
    car_brand = db.Column(db.String(80), nullable=False)
    car_model_year = db.Column(db.Integer, nullable=False)
    plate_number = db.Column(db.String(20), unique=True, nullable=False)
    genero_id = db.Column(db.Integer, db.ForeignKey('gender.id'), nullable=False)
    estado_civil_id = db.Column(db.Integer, db.ForeignKey('marital_status.id'), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    state_id = db.Column(db.Integer, db.ForeignKey('driver_state.id'), nullable=False)
    account_number = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(200), nullable=False)
    trips = db.relationship('Trip', backref='driver', lazy=True)

class Assistant(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fullname = db.Column(db.String(200), nullable=False)
    phone_number = db.Column(db.String(80), unique=True, nullable=False)
    age = db.Column(db.Integer, nullable=False)
    dpi_number = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(80), unique=True, nullable=False)
    cv_pdf = db.Column(db.String(200), nullable=False)
    photo = db.Column(db.String(200), nullable=False)
    genero_id = db.Column(db.Integer, db.ForeignKey('gender.id'), nullable=False)
    estado_civil_id = db.Column(db.Integer, db.ForeignKey('marital_status.id'), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    account_number = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(200), nullable=False)


class Trip(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    driver_id = db.Column(db.Integer, db.ForeignKey('driver.id'), nullable=True)
    origin = db.Column(db.String(120), nullable=False)
    destination = db.Column(db.String(120), nullable=False)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=True)
    tarifa = db.Column(db.Float, nullable=False)
    status = db.Column(db.Integer, db.ForeignKey('trip_state.id'), nullable=False)


class ProblemReport(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    trip_id = db.Column(db.Integer, db.ForeignKey('trip.id'), nullable=True)
    description = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.now())
    status = db.Column(db.Integer, db.ForeignKey('report_state.id'), nullable=False)

class TokenCheckin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    token = db.Column(db.String(40), nullable=False, unique=True)
    expires_at =  db.Column(db.DateTime, nullable=False)
    created_at =  db.Column(db.DateTime, nullable=False)

class Tarifa(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    origin = db.Column(db.String(120), nullable=False)
    destination = db.Column(db.String(120), nullable=False)
    price =  db.Column(db.Float, nullable=False)


# Config
class ConfigControl(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True, nullable=False)
    value = db.Column(db.String(120), nullable=False)

class RemovedUsers(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    comment = db.Column(db.String(120), nullable=False)

class RemovedDrivers(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    driver_id = db.Column(db.Integer, db.ForeignKey('driver.id'), nullable=False)
    comment = db.Column(db.String(120), nullable=False)
