from flask import Flask
from application.database import db
from application.models import User,Role
from application.config import LocalDevelopmentConfig

from flask_security import Security,SQLAlchemyUserDatastore

def create_app():
    app=Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI']
    app.config.from_object(LocalDevelopmentConfig)
    db.init_app(app) #to connect the application with the database
    
    datastore=SQLAlchemyUserDatastore(db,User,Role)  #we import Security and create the datastore object
                                                     #Datastore is provided by flask security, datastore has methods that 
                                                     # can be applied to user and the role table
                                                     
    app.security=Security(app,datastore)  
    
    app.app_context().push()
    return app

app=create_app()

if __name__=="__main__":
    app.run()