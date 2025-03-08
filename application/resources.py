from flask_restful import Api,Resource,reqparse
from .models import *
from flask_security import auth_required,roles_required,current_user,roles_accepted

api=Api()

def roles_list(roles):
    role_list=[]
    for role in roles:
        role_list.append(role.name)
    return role_list



parser=reqparse.RequestParser()

parser.add_argument('name')
parser.add_argument('description')
parser.add_argument('base_price')
parser.add_argument('time_required')



class ServiceApi(Resource):
    @auth_required('token')
    @roles_accepted('admin','customer')
    def get(self):
        services=[]
        service_jsons=[]
    
        services=Service.query.all()
      
        for service in services:
            this_service={}
            this_service["id"]=service.id
            this_service["name"]=service.name
            this_service["description"]=service.description
            this_service["base_price"]=service.base_price
            this_service["time_required"]=service.time_required
            service_jsons.append(this_service)
        
        if service_jsons:
            return service_jsons
    
        return {
            "message":"No service found"
        },404
        
    
    @auth_required('token')
    @roles_required('admin')
    def post(self):
        args=parser.parse_args()
        try:
            service=Service(name=args["name"],
                        description=args["description"],
                        base_price=args["base_price"],
                        time_required=args["time_required"])
            db.session.add(service)
            db.session.commit()
            return {
                "message":"Service created successfully"
            },200
        except:
            return {
                "message":"One or more required fields are missing"
            },400

api.add_resource(ServiceApi,'/api/service/get','/api/service/create')