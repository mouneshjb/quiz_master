# these will be useful when we connect the app with BE DB
class Config():
    DEBUG = False
    SQLALCHEMY_TRACK_MODIFICATIONS = True

class LocalDevelopmentConfig(Config):
    # configuration
    SQLALCHEMY_DATABASE_URI = "sqlite:///qmdb.sqlite3"
    DEBUG = True

    # config for security
    SECRET_KEY = "this-is-a-secretkey" # used to hash the user credentials stored in the session - encrypt those credentials
    SECURITY_PASSWORD_HASH = "bcrypt" # mechanism for hashing password - even in the database, we don't want even developers to look at the passwords
    SECURITY_PASSWORD_SALT = "this-is-a-password-salt" # helps in hashing the password
    WTF_CSRF_ENABLED = False # related to the form, how BE will know data coming from the form is correct, data from the same application or not etc.
    SECUTIRY_TOKEN_AUTHENTICATION_HEADER = "Authentication-Token" 

    # cache specific
    CACHE_TYPE = "RedisCache"
    CACHE_DEFAULT_TIMEOUT = 30
    CACHE_REDIS_PORT = 6379