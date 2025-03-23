from flask import current_app as app,jsonify,request
from flask_sqlalchemy import SQLAlchemy
from flask_security import auth_required,roles_required,current_user,hash_password
from .database import db
from models import  User, Service


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
            "message":"Customer created successfully"
        }), 201
    return jsonify({
            "message":"Customer already exists"
        }), 400
    
    
    
    
@app.route('/api/professional/register',methods=['POST'])
def create_professional():
    credentials=request.get_json()
    
    if not app.security.datastore.find_user(email=credentials["email"]):
        app.security.datastore.create_user(email=credentials["email"],
                                           username=credentials["username"],
                                           password=hash_password(credentials["password"]),
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