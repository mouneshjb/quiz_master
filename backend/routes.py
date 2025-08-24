from .database import db
from .models import User, Role
from flask import current_app as app, jsonify, request, render_template, send_from_directory
from flask_security import hash_password, auth_required, roles_required, current_user, roles_accepted, login_user
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime, date, time
from .util_funcs import roles_list
from celery.result import AsyncResult
from .tasks import csv_report, monthly_report

cache = app.cache

# Entry point for the application FE
@app.route('/', methods = ['GET'])
def home():
    return render_template('index.html')

@app.get('/cache')
@cache.cached(timeout = 5)
def cache():
        return { 'time': str(datetime.now()) }

@app.route('/api/admin')
@auth_required('token') # Authentication - token is required to access this
@roles_required('admin')  # Authorization - RBAC
def admin_home():
    user = current_user
    return jsonify({
        "name": user.name,
        "email": user.email,
        "roles": roles_list(user.roles)
    })

@app.route('/api/home')
@auth_required('token')
# @roles_required('user')
# @roles_required('user', 'admin') - AND - user needs to have both roles
@roles_required('user')
def user_home():
    user = current_user
    return jsonify({
        "name": user.name,
        "email": user.email,
        "roles": roles_list(user.roles)
    })

@app.route('/api/login', methods = ['POST'])
# or we can write - @app.post('/api/login')
def login():
    body = request.get_json()
    email = body['email']
    password = body['password']

    if not email:
        return jsonify({
            "message": "Email is required!"
        }), 400
    # If we have implemented the flask security, it is better to do all the things related to roles and users related operations using datastore
    user = app.security.datastore.find_user(email = email) #Authentication

    if user:
        # we cannot write - if user.password == hash_password(password) - this will genenrate new has everytime 
        if check_password_hash(user.password, password):
            login_user(user)
            return jsonify({
                "id": user.id,
                "name": user.name,
                "auth-token": user.get_auth_token(),
                "roles": roles_list(user.roles),
                "role": user.roles[0].name            
                })
        else:
            return jsonify({
                "message": "Incorrect Password"
            }), 400
    else:
        return jsonify({
            "message": "User Not Found!"
        }), 404


@app.route('/api/register', methods = ['POST'])
# or we can write - @app.post('/api/register')
def register():
    credentials = request.get_json()
    if not app.security.datastore.find_user(email = credentials["email"]):
        # dob_str = credentials.get("dob", "").strip()
        # if not dob_str:
        #     return jsonify({"error": "Date of Birth is required"}), 400  # Handle missing input
        dob_date = datetime.strptime(credentials["dob"], "%Y-%m-%d").date()
        app.security.datastore.create_user(email = credentials["email"],
                                           name = credentials["name"],
                                           password = generate_password_hash(credentials["password"]),
                                           roles = ['user'],
                                           dob = dob_date,
                                           qualification = credentials["qualification"])
        db.session.commit()
        return jsonify({
            "message": "User created successfully"
        }), 201
    
    return jsonify({
        "message": "User already exits!"
    }), 400


##### Back-end jobs #######
@app.route('/api/csv_report') # this manually triggers the job - assigns to a worker
def export_csv():
    res = csv_report.delay() # async object
    return jsonify({
        "id": res.id,
        "result": res.result,

    })

@app.route('/api/csv_report_result/<id>') # this is created to test the status of result
def export_csv_result(id):
    res = AsyncResult(id)
    return send_from_directory('static', res.result)
    # return send_from_directory('static', res.result)



# @app.route('/api/mail')
# def send_reports():
#     res = monthly_report.delay()
#     return {
#         "result": res.result
#     }