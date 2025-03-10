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


#For Service Request
parser.add_argument('service_id')
parser.add_argument('customer_id')
parser.add_argument('professional_id')
parser.add_argument('date_requested')
parser.add_argument('date_completed')
parser.add_argument('Address')
parser.add_argument('offered_price')
parser.add_argument('status')
parser.add_argument('rating')
parser.add_argument('remarks')




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


class ServiceReqApi(Resource):
    @auth_required('token')
    @roles_required('admin')
    def get(self):
        ser_req=[]
        ser_req_jsons=[]
    
        ser_req=ServiceRequest.query.all()
        
        for req in ser_req:
            this_req={}
            this_req["service_id"]=req.service_id
            this_req["customer_id"]=req.customer_id
            this_req["professional_id"]=req.professional_id
            this_req["Address"]=req.Address
            this_req["offered_price"]=req.offered_price
            this_req["date_completed"]=req.date_completed
            this_req["date_requested"]=req.date_requested.date().isoformat()
            this_req["status"]=req.status
            this_req["rating"]=req.rating
            this_req["remarks"]=req.remarks
            ser_req_jsons.append(this_req)
            
        
        if ser_req_jsons:
            return ser_req_jsons
    
        return {
            "message":"No service request found"
        },404
        
        
    @auth_required('token')
    @roles_required('customer')
    def post(self):
        args=parser.parse_args()
        try:
            req=ServiceRequest(service_id=args["service_id"],
                        customer_id=args["customer_id"],
                        professional_id=args["professional_id"],
                        Address=args["Address"],
                        offered_price=args["offered_price"],
                        date_completed=args["date_completed"],
                        status=args["status"],
                        rating=args["rating"],
                        remarks=args["remarks"])
            
            db.session.add(req)
            db.session.commit()
            return {
                "message":"Service Request created successfully"
            },200
        except:
            return {
                "message":"One or more required fields are missing"
            },400
        
api.add_resource(ServiceReqApi,'/api/service_request/get','/api/service_request/create')