# Main app code
# Importing required libraries
from flask import Flask
from backend.database import db
from backend.models import User, Role

from backend.config import LocalDevelopmentConfig
from flask_security import Security, SQLAlchemyUserDatastore # these are the API with many useful methods to configure user and role model
from flask_security import hash_password
from werkzeug.security import generate_password_hash
from datetime import datetime, date
from backend.celery_init import celery_init_app
from celery.schedules import crontab
from backend.tasks import monthly_report, daily_reminder
from flask_caching import Cache

def create_app():
    app = Flask(__name__)
    app.config.from_object(LocalDevelopmentConfig) #Sqlite connection
    db.init_app(app) # Flask app is connected to db
    cache = Cache(app) # cache init
    
    datastore = SQLAlchemyUserDatastore(db, User, Role)
    app.cache = cache
    app.security = Security(app, datastore)
    app.app_context().push() # Direct access to other module - creating a single context

    from backend.resources import api
    api.init_app(app)

    return app

# Call the setup function
app = create_app()
celery = celery_init_app(app)
celery.autodiscover_tasks()

# whenever we want to do DB operations in app.py, we need to create the app context

with app.app_context():
    db.create_all()

    app.security.datastore.find_or_create_role(name = "admin", description = "Superuser of app")
    app.security.datastore.find_or_create_role(name = "user", description = "General user of app")

    db.session.commit()

    date_obj = date(1996, 1, 1)
    # Convert to datetime (set time to midnight)
    datetime_obj = datetime.combine(date_obj, datetime.min.time())

    if not app.security.datastore.find_user(email = "admin@gmail.com"):
        app.security.datastore.create_user(email = "admin@gmail.com",
                                           name = "admin",
                                           password = generate_password_hash("1234"),
                                           dob = date_obj,
                                           roles = ['admin']) # we can also give 'user' also, can give multiple roles


    db.session.commit()

from backend.routes import *

@celery.on_after_finalize.connect
def setup_periodic_tasks(sender, **kwargs):
    # Monthly scores reports task
    sender.add_periodic_task(
        crontab(minute = '*/2'),
        monthly_report.s(),
    )

    # Daily quiz reminder task
    sender.add_periodic_task(
        crontab(minute = '*/2'),
        daily_reminder.s(),
    )

# Activating .venv in WSL: source .venv/bin/activate
# celery doc - https://docs.celeryq.dev/en/latest/userguide/periodic-tasks.html
# Celery worker: celery -A app.celery worker --loglevel INFO
# Celery beat: celery -A app.celery beat --loglevel INFO
# Mailhig in cmd: ~/go/bin/MailHog (http://localhost:8025/)

# redis(for stopping redis on 5000 initially): sudo systemctl stop redis
# redis(for running) -  redis-server


if __name__ == '__main__':
    app.run()