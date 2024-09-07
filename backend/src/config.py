
class Config:
    SQLALCHEMY_DATABASE_URI = 'postgresql://sa:database123!@localhost:5432/uberfake'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = 'your_secret_key'  # Clave secreta para JWT
