from flask import jsonify,request,render_template
from flask_sqlalchemy import SQLAlchemy
from flask_security import auth_required,roles_required,current_user,hash_password,login_user, verify_password
from .database import db
from .models import  User, Service,Role
from .utils import roles_list
import logging
from werkzeug.security import generate_password_hash

logging.basicConfig(level=logging.INFO)

from app import app


@app.route('/',methods=["GET"])
def home():
    return render_template("index.html")


@app.route('/api/admin')
@auth_required('token') #Authentication
@roles_required('admin')  #RBAC/Authorization
def admin_home():
    return {
        "message":"admin logged in successfully"
    }
    

@app.route('/api/home')
@auth_required('token')
@roles_required('customer')
def user_home():
    user=current_user
    return jsonify({
        "username":user.username,
        "email":user.email,
        "password": user.password    
    })
    


@app.route('/api/login', methods=['POST'])
def user_login():
    """
    User login endpoint using Flask-Security token authentication.
    """
    credentials = request.get_json()
    email = credentials.get("email")
    password = credentials.get("password")

    with app.app_context():  # Ensure app context
        # Check if user exists
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({"message": "User not found"}), 404

        # Check password
        if not verify_password(password, user.password):
            return jsonify({"message": "Invalid credentials"}), 401

        # Check if professional is approved
        if "professional" in [role.name for role in user.roles]:
            if user.verified is None:
                return jsonify({"message": "Your account is pending approval"}), 403
            if user.verified is False:
                return jsonify({"message": "Your account has been rejected"}), 403

        # Authenticate user and generate authentication token
        login_user(user)  # Logs in the user for session-based authentication #creates session
        auth_token = user.get_auth_token() 


        return jsonify({
            "message": "Login successful",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "roles": roles_list(user.roles)  # Convert roles to a list of names
            },
            "auth_token": auth_token
        }), 200

    
@app.route('/api/customer/register', methods=['POST'])
def create_customer():
    credentials = request.get_json()

    # Validate incoming data
    required_fields = ["email", "username", "password", "city"]
    for field in required_fields:
        if field not in credentials or not credentials[field]:
            logging.warning(f"Missing field: {field}")
            return jsonify({"message": f"{field} is required"}), 400

    with app.app_context():
        # Check if user already exists
        if not app.security.datastore.find_user(email=credentials["email"]):
            try:
                # Hash password securely
                hashed_password = generate_password_hash(credentials["password"], method='pbkdf2:sha256', salt_length=8)

                # Create new customer
                app.security.datastore.create_user(
                    email=credentials["email"],
                    username=credentials["username"],
                    password=hashed_password,
                    roles=["customer"],
                    city=credentials["city"]
                )
                db.session.commit()
                logging.info(f"Customer created: {credentials['email']}")
                return jsonify({"message": "Customer created successfully"}), 201
            except Exception as e:
                db.session.rollback()
                logging.error(f"Error creating customer: {str(e)}")
                return jsonify({"message": f"Error creating customer: {str(e)}"}), 500

        logging.warning(f"Customer already exists: {credentials['email']}")
        return jsonify({"message": "Customer already exists"}), 409

    
    
    
    
@app.route('/api/professional/register',methods=['POST'])
def create_professional():
    credentials=request.get_json()
    
    with app.app_context():
        if not app.security.datastore.find_user(email=credentials["email"]):
            app.security.datastore.create_user(email=credentials["email"],
                                           username=credentials["username"],
                                           password=generate_password_hash(credentials["password"], method='pbkdf2:sha256', salt_length=8),
                                           roles=["professional"],
                                           city=credentials["city"],
                                           service_type=credentials["service_type"],
                                           bio=credentials["bio"],
                                           experience=credentials["experience"],
                                           verification_document=credentials["verification_document"]
                                           ) 

        db.session.commit()
        return jsonify({
            "message":"Professional account created successfully"
        }), 201
    return jsonify({
            "message":"Professional already exists"
        }), 400


@app.route('/admin/search-professionals', methods=['GET'])
def search_professionals():
    name = request.args.get('name', '')
    city = request.args.get('city', '')
    experience = request.args.get('experience', 0, type=int)
    service_type = request.args.get('service_type', '', type=int)
    
    query = User.query.filter(User.service_type.isnot(None))  # Filtering only professionals
    
    if name:
        query = query.filter(User.username.ilike(f'%{name}%'))
    if city:
        query = query.filter(User.city.ilike(f'%{city}%'))
    if experience:
        query = query.filter(User.experience >= experience)
    if service_type:
        query = query.filter(User.service_type == service_type)
    
    professionals = query.all()
    
    results = [
        {
            'id': prof.id,
            'name': prof.username,
            'city': prof.city,
            'experience': prof.experience,
            'service_type': Service.query.get(prof.service_type).name if prof.service_type else None
        } for prof in professionals
    ]
    
    return jsonify(results)
    


