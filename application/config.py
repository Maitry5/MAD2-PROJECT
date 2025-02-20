class Config():
    DEBUG=False
    SQLALCHEMY_TRACK_MODIFICATIONS=True

class LocalDevelopmentConfig(Config):
    SQLALCHEMY_DATABASE_URI="sqlite:///hsa2.sqlite3"
    DEBUG=True
    
    # config for security(to encrypt the user credentials)
    SECRET_KEY="this-is-a-secretkey" #helps to encrypt the user credentials in the session
    SECURITY_PASSWORD_HASH="bcrypt"  #mechanism for hashing password - bcrypt
    SECURITY_PASSWORD_SALT="this-is-password-salt" #helps in hashing the password
    WTF_CSRF_ENABLED=False  #related to the forms
    SECURITY_TOKEN_AUTHENTICATION_HEADER="Authentication-Token"