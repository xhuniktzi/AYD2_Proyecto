from app.extensions import db

class UserState(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)

class Gender(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    abreviature = db.Column(db.String(80), unique=True, nullable=False)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fullname = db.Column(db.String(200), nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    fecha_nac = db.Column(db.Date, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    genero_id = db.Column(db.Integer, db.ForeignKey('gender.id'), nullable=False)
    email = db.Column(db.String(80), unique=True, nullable=False)
    # dpi_photo = db.Column()
    phone_number = db.Column(db.String(80), unique=True, nullable=False)
    state_id = db.Column(db.Integer, db.ForeignKey('user_state.id'), nullable=False)


class Trip(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    origin = db.Column(db.String(120), nullable=False)
    destination = db.Column(db.String(120), nullable=False)
    status = db.Column(db.String(50), nullable=False)


# Config
class ConfigControl(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True, nullable=False)
    value = db.Column(db.String(120), nullable=False)