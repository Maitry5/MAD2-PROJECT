from flask import jsonify,request,render_template
from flask_sqlalchemy import SQLAlchemy
from flask_security import auth_required,roles_required,current_user,hash_password,login_user, verify_password,logout_user
from .database import db
from .models import  User, Service,Role,ServiceRequest
from .utils import roles_list
import logging


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
    

@app.route('/api/customer',methods=["GET"])
@roles_required('customer')
@auth_required('token')
def user_home():
    user=current_user
    return jsonify({
        "username":user.username,
        "email":user.email,
        "password": user.password    
    })
    
    

@app.route('/api/professional')
@auth_required('token')
@roles_required('professional')
def get_professional():
    professional = User.query.get(current_user.id)
    service_requests = ServiceRequest.query.filter_by(professional_id=current_user.id).all()

    return jsonify({
        "username": professional.username,
        "bio": professional.bio,
        "service_type": professional.service.name if professional.service else None,
        "base_price": professional.service.base_price if professional.service else 0,
        "city": professional.city,
        "experience": professional.experience,
        "service_requests": [
            {
                "id": req.id,
                "customer_name": req.customer.username if req.customer else "N/A",
                "date_requested": req.date_requested.isoformat() if req.date_requested else None,
                "offered_price": req.offered_price,
                "address": req.address,
                "status": req.status,
                "date_completed": req.date_completed.isoformat() if req.date_completed else None,
                "rating": req.rating
            }
            for req in service_requests
        ]
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
        
        if not user.active:
            return jsonify({"message": "Your account has been blocked by the admin"}), 403

        # Check password
        if not verify_password(password, user.password):
            return jsonify({"message": "Password is incorrect"}), 401
        
   
        # Check if professional is approved
        if user.has_role("professional"):
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
                "roles": roles_list(user.roles),# Convert roles to a list of names
               
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
           

                # Create new customer
                password=hash_password(credentials["password"])
                app.security.datastore.create_user(
                    email=credentials["email"],
                    username=credentials["username"],
                    password=password,
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
            try:
                password=hash_password(credentials["password"])
                app.security.datastore.create_user(email=credentials["email"],
                                           username=credentials["username"],
                                           password=password,
                                           roles=["professional"],
                                           city=credentials["city"],
                                           service_type=credentials["service_type"],
                                           bio=credentials["bio"],
                                           experience=credentials["experience"],
                                           verification_document=credentials["verification_document"]
                                           ) 

                db.session.commit()
                return jsonify({
                    "message":"Professional account created successfully"}), 201
            except Exception as e:
                db.session.rollback()
                logging.error(f"Error creating customer: {str(e)}")
                return jsonify({"message": f"Error creating customer: {str(e)}"}), 500
    return jsonify({
            "message":"Professional already exists"
        }), 400



    

@app.route('/api/logout', methods=['POST'])
@auth_required('token')  # Ensures only authenticated users can log out
def logout():
    try:
        logout_user()  # Clears the user session
        return jsonify({"message": "Logout successful"}), 200
    except Exception as e:
        logging.error(f"Logout error: {str(e)}")
        return jsonify({"message": "Error logging out"}), 500