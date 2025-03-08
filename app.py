from flask import Flask
from application.database import db
from application.models import User,Role
from application.config import LocalDevelopmentConfig
from application.resources import api
from flask_security import Security,SQLAlchemyUserDatastore
from flask_security import hash_password

def create_app():
    app=Flask(__name__)
    app.config.from_object(LocalDevelopmentConfig)
    db.init_app(app) #to connect the application with the database
    api.init_app(app)
    datastore=SQLAlchemyUserDatastore(db,User,Role)  #we import Security and create the datastore object
                                                     #Datastore is provided by flask security, datastore has methods that 
                                                     # can be applied to user and the role table
                                                     
    app.security=Security(app,datastore)  
    
    app.app_context().push()
    return app

app=create_app()

#when we do database operation within app.py, we do it under app.cpntext
#For any operation that happens to the database, we create context
with app.app_context():
    db.create_all()
    
    app.security.datastore.find_or_create_role(name="admin",description="superuser")
    app.security.datastore.find_or_create_role(name="customer",description="Those who book the services")
    app.security.datastore.find_or_create_role(name="professional",description="Those who provide the services")
    db.session.commit()
    
    
    if not app.security.datastore.find_user(email="admin@gmail.com"):
        app.security.datastore.create_user(email="admin@gmail.com",
                                           username="admin",
                                           password=hash_password("admin"),
                                           roles=['admin'])
    
    
    if not app.security.datastore.find_user(email="customer1@gmail.com"):
        app.security.datastore.create_user(email="customer1@gmail.com",
                                           username="customer1",
                                           password=hash_password("customer1"),
                                           roles=['customer'])  
    
    db.session.commit()

from application.routes import *    





if __name__=="__main__":
    app.run()