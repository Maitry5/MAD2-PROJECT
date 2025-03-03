from flask import current_app as app,jsonify,request
from flask_sqlalchemy import SQLAlchemy
from flask_security import auth_required,roles_required,current_user,hash_password
from .database import db


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
    
    
@app.route('/api/customer/register',methods=['POST'])
def create_customer():
    credentials=request.get_json()
    
    if not app.security.datastore.find_user(email=credentials["email"]):
        app.security.datastore.create_user(email=credentials["email"],
                                           username=credentials["username"],
                                           password=hash_password(credentials["password"]),
                                           roles=["customer"],
                                           city=credentials["city"])  
    
        db.session.commit()
        return jsonify({
            "message":"User created successfully"
        }), 201
    return jsonify({
            "message":"User already exists"
        }), 400
    
