from flask_restful import Api,Resource,reqparse
from .models import *
from flask_security import auth_required,roles_required,current_user,roles_accepted
from .utils import roles_list
from flask import jsonify
from flask import request
from datetime import datetime
api=Api()





### SERVICE PARSER
service_parser = reqparse.RequestParser()
service_parser.add_argument('name', required=True, help="Name is required")
service_parser.add_argument('description')
service_parser.add_argument('base_price', type=float)
service_parser.add_argument('time_required', type=int)



### ADMIN VERIFICATION PARSER
verification_parser = reqparse.RequestParser()
verification_parser.add_argument('verified', type=bool, required=True, help="Verification status is required")


admin_search_professional_parser = reqparse.RequestParser()
admin_search_professional_parser.add_argument('username', type=str, help="Search by professional's name")
admin_search_professional_parser.add_argument('service_type', type=str, help="Search by service type")
admin_search_professional_parser.add_argument('city', type=str, help="Search by city")
admin_search_professional_parser.add_argument('experience', type=int, help="experience should be greater than")

### SERVICE REQUEST PARSER
service_req_parser = reqparse.RequestParser()
service_req_parser.add_argument("customer_id", type=int, required=True, help="Customer ID is required")
service_req_parser.add_argument("service_id", type=int, required=True, help="Service ID is required")
service_req_parser.add_argument("professional_id", type=int, required=True, help="Professional ID is required")
service_req_parser.add_argument("address", type=str, required=True, help="Address is required")
service_req_parser.add_argument("offered_price", type=float, required=True, help="Offered Price is required")
service_req_parser.add_argument("date_requested", type=str, required=True, help="Date Requested is required")

service_req_parser.add_argument('status')
service_req_parser.add_argument('rating')
service_req_parser.add_argument('remarks')




#####SERVICES
class ServiceApi(Resource):
    @auth_required('token')
    @roles_accepted('admin', 'customer')
    def get(self,service_id=None):
        try:
            if service_id:  # Fetch a specific service
                service = Service.query.get(service_id)
                if not service:
                    return {"message": "Service not found"}, 404

                return {
                    "id": service.id,
                    "name": service.name,
                    "description": service.description,
                    "base_price": service.base_price,
                    "time_required": service.time_required,
                    "professionals": [
                        {
                            "id": prof.id,
                            "name": prof.username,
                            "experience": prof.experience,
                            "service_type": prof.service.name,
                            "bio":prof.bio
                        }
                        for prof in service.professionals
                    ]
                }, 200
                
                
                
            services = Service.query.all()

            service_jsons = [
                {
                    "id": service.id,
                    "name": service.name,
                    "description": service.description,
                    "base_price": service.base_price,
                    "time_required": service.time_required
                }
                for service in services
            ]

            if service_jsons:
                return {"services": service_jsons}, 200  # ✅ Return a dictionary, Flask-RESTful converts it to JSON

            return {"message": "No service found"}, 404  # ✅ No `jsonify()`

        except Exception as e:
            return {"error": str(e)}, 500  # Handle unexpected errors properly

    
        
    
    @auth_required('token')
    @roles_required('admin')
    def post(self):
        args=service_parser.parse_args()
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
            
    @auth_required('token')
    @roles_required('admin')
    def put(self,service_id):
        args=service_parser.parse_args()
        serv=Service.query.get(service_id)
        serv.description=args['description']
        serv.base_price=args['base_price']
        serv.time_required=args['time_required']
        db.session.commit()
        return {
            "message":"Service updated successfully"
        }

    @auth_required('token')
    @roles_required('admin')
    def delete(self,service_id):
        serv=Service.query.get(service_id)
        if serv:
            db.session.delete(serv)
            db.session.commit()
            return{
                "message":"Service deleted successfully"
            }
        else:
            return{
                "message":"Service not found"
            },404
            
    
        
        
        
api.add_resource(ServiceApi,'/api/service/get',
                            '/api/service/<int:service_id>',
                            '/api/service/create',
                            '/api/service/update/<int:service_id>',
                            '/api/service/delete/<int:service_id>')



###### SERVICE REQUEST





### SERVICE REQUEST STATUS PARSER
status_parser = reqparse.RequestParser()
status_parser.add_argument('status', required=True, help="Status is required")



class ServiceReqApi(Resource):
    @auth_required('token')
    @roles_accepted('admin', 'professional', 'customer')
    def get(self, request_id=None):
        try:
            if request_id:
                req = ServiceRequest.query.get(request_id)
                if not req:
                    return {"message": "Service request not found"}, 404
                
                return {
                    "id": req.id,
                    "service_id": req.service_id,
                    "service_name": req.service.name if req.service else None,
                    "base_price": req.service.base_price if req.service else None,
                    "customer_id": req.customer_id,
                    "professional_name": req.professional.username if req.professional else  "Not Assigned",
                    "address": req.address,
                    "offered_price": req.offered_price,
                    "date_requested": req.date_requested.isoformat() if req.date_requested else None,
                    "date_completed": req.date_completed.isoformat() if req.date_completed else None,
                    "status": req.status,
                    "rating": req.rating
                }, 200

            user_roles = [role.name for role in current_user.roles]
            
            if 'admin' in user_roles:
                requests = ServiceRequest.query.all()
            elif 'customer' in user_roles:
                requests = ServiceRequest.query.filter_by(customer_id=current_user.id).all()
            elif 'professional' in user_roles:
                requests = ServiceRequest.query.filter_by(professional_id=current_user.id).all()
            else:
                return {"message": "Unauthorized access"}, 403

            request_jsons = []
            for req in requests:
                request_data = {
                    "id": req.id,
                    "service_id": req.service_id,
                    "service_name": req.service.name if req.service else "N/A",
                    "base_price": req.service.base_price if req.service else None,
                    "customer_id": req.customer_id,
                    "professional_name": req.professional.username if req.professional else "Not Assigned",
                    "address": req.address,
                    "offered_price": req.offered_price,
                    "date_requested": req.date_requested.isoformat() if req.date_requested else None,
                    "date_completed": req.date_completed.isoformat() if req.date_completed else None,
                    "status": req.status,
                    "rating": req.rating
                }
                request_jsons.append(request_data)

            return {"requests": request_jsons}, 200

    
        except Exception as e:
            return {"error": str(e)}, 500


        
        
    @auth_required('token')
    @roles_required('customer')
    def post(self):
        args = service_req_parser.parse_args()
        print("Parsed Arguments:", args)
        if isinstance(args["date_requested"], str):  
             args["date_requested"] = datetime.strptime(args["date_requested"], "%Y-%m-%d").date()

      
        # Validate required fields
        try:
            if not all([args.get("customer_id"), args.get("service_id"), args.get("professional_id")]):
             return {"message": "Missing required fields"}, 400  # Early validation check
        
            req = ServiceRequest(
                customer_id=args["customer_id"],
                service_id=args["service_id"],
                professional_id=args["professional_id"],
                address=args["address"],
                offered_price=args["offered_price"],
                date_requested=args["date_requested"]
        )
        
            db.session.add(req)
            db.session.commit()
            return {"message": "Service Request created successfully"}, 200
        
        except Exception as e:
            return {"message": f"Unexpected error: {str(e)}"}, 500
    
    


    @auth_required('token')
    @roles_required('customer')
    def put(self, request_id):
            args = service_req_parser.parse_args()
            print("Parsed Arguments:", args)  # Debugging

            try:
                service_request = ServiceRequest.query.get(request_id)
                if not service_request:
                    return {"message": "Service Request not found"}, 404
                
                # Update fields only if provided
                if args.get("address"):
                    service_request.address = args["address"]
                if args.get("offered_price"):
                    service_request.offered_price = args["offered_price"]
                if args.get("date_requested"):
                    service_request.date_requested = datetime.strptime(args["date_requested"], "%Y-%m-%d").date()

                db.session.commit()
                return {"message": "Service Request updated successfully"}, 200
            
            except Exception as e:
                print("Error:", e)  # Debugging
                return {"message": f"Unexpected error: {str(e)}"}, 500


    
    
    @auth_required('token')
    @roles_required('admin')
    def delete(self,request_id):
        req=ServiceRequest.query.get(request_id)
        if req:
            db.session.delete(req)
            db.session.commit()
            return{
                "message":"Service Request deleted successfully"
            }
        else:
            return{
                "message":"Service Request not found"
            },404
             

api.add_resource(ServiceReqApi,'/api/service_request',
                                '/api/service_request/<int:request_id>',
                                '/api/service_request/create',
                                '/api/service_request/update/<int:request_id>',
                                '/api/service_request/delete/<int:request_id>')



from datetime import datetime

status_parser = reqparse.RequestParser()
status_parser.add_argument('status', required=True, help="Status is required")
class ServiceReqStatusUpdateApi(Resource):
    @auth_required('token')
    @roles_accepted('professional', 'customer')
    def put(self, request_id):
        args = status_parser.parse_args()
        req = ServiceRequest.query.get(request_id)
        
        if not req:
            return {"message": "Service Request not found"}, 404
        
        # Check permissions
        if 'professional' in roles_list(current_user.roles) or 'customer' in roles_list(current_user.roles):
            new_status = args['status']
            req.status = new_status
            
            # Automatically set completion date when closing
            if new_status == 'closed':
                req.date_completed = datetime.utcnow().date()
            
            db.session.commit()
            return {
                "message": "Service status updated successfully",
                "new_status": new_status,
                "date_completed": req.date_completed.isoformat() if req.date_completed else None
            }, 200
        
        return {"message": "Unauthorized action"}, 403

api.add_resource(ServiceReqStatusUpdateApi, '/api/service_request/update_status/<int:request_id>')


####ADMIN DASHBOARD

class AdminUserApi(Resource):
    @auth_required('token')
    @roles_required('admin')
    def get(self,user_type):
        users_json=[]
        
        if user_type=="customers":
            customers = User.query.filter(User.roles.any(name="customer")).all()
            for user in customers:
                this_user={}
                this_user["id"]=user.id
                this_user["name"]=user.username
                this_user["city"]=user.city
                this_user["total_requests"]=len(user.service_requests_as_customer)
                this_user["active"]=user.active
                users_json.append(this_user)
        elif user_type == "professionals":
            professionals = User.query.filter(User.roles.any(name="professional"), User.verified == True).all()
            for user in professionals:
                this_user={}
                this_user["id"]=user.id
                this_user["name"]=user.username
                this_user["city"]=user.city
                this_user["experience"]=user.experience
                this_user["service_type"]=user.service.name
                this_user["total_requests"]=len(user.service_requests_as_professional)
                this_user["active"]=user.active
                users_json.append(this_user)
        else:
            return {"message": "Invalid user type"}, 400

          
        if users_json:
            return users_json
    
        return {
            "message":"No user found"
        },404


class AdminBlockUserApi(Resource):
    @auth_required('token')
    @roles_required('admin')
    def put(self, user_id):
        user = User.query.get(user_id)
        if not user:
            return {"message": "User not found"}, 404
        
        user.active = not user.active  # Toggle block status
        db.session.commit()
        
        return {
            "message": f"User {'blocked' if not user.active else 'unblocked'} successfully",
            "active": user.active  # Return updated status
        }, 200


api.add_resource(AdminUserApi, '/api/admin/all_<string:user_type>')
api.add_resource(AdminBlockUserApi, '/api/admin/block_user/<int:user_id>')








class AdminVerificationRequest(Resource):
    @auth_required('token')
    @roles_required('admin')
    def get(self):
        professionals=[]
        professional_jsons=[]
        professionals = User.query.filter(User.roles.any(name="professional"), User.verified.is_(None)).all()

      
        for prof in professionals:
            this_prof={}
            this_prof["id"]=prof.id
            this_prof["name"]=prof.username
            this_prof["experience"]=prof.experience
            this_prof["service_type"]=prof.service.name
            this_prof["verification_document"]=prof.verification_document
          
            professional_jsons.append(this_prof)
        
        if professional_jsons:
            return professional_jsons
        else:  return {
            "message":"No new request found"
        },404
        
        
        
        
    @auth_required('token')
    @roles_required('admin')
    def put(self,professional_id):
        args = verification_parser.parse_args()
        professional = User.query.filter(User.id == professional_id, User.verified == None).first()
        professional.verified= args['verified']
        db.session.commit()
        status = "accepted" if args["verified"] else "rejected"
        return {"message": f"Professional verification status updated to {status}."}, 200
        
api.add_resource(AdminVerificationRequest,
                "/api/admin/requests",
                "/api/admin/verify/<int:professional_id>",) 



class AdminSearchProfessionalApi(Resource):
    @auth_required('token')
    @roles_accepted('admin','customer')
    def post(self):
        data = request.json
        print("Received Data:", data)  # Debugging

        # Base query for verified and active professionals
        query = User.query.filter(User.roles.any(name="professional"), User.verified == True)

        # Apply search filters if provided
        if data.get("username"):
            query = query.filter(User.username.ilike(f"%{data['username']}%"))
        if data.get("service_type"):
            query = query.filter(User.service_type.ilike(f"%{data['service_type']}%"))
        if data.get("city"):
            query = query.filter(User.city.ilike(f"%{data['city']}%"))
      
        
        # Fetch professionals
        professionals = query.all()

        if not professionals:
            return {"message": "No professionals found"}, 404

        # Construct response JSON
        professional_jsons = [{
            "id": prof.id,
            "name": prof.username,
            "city": prof.city,
            "experience": prof.experience,
            "service_type": prof.service.name,
            "total_requests": len(prof.service_requests_as_professional),
            "active": prof.active
        } for prof in professionals]

        return {"professionals": professional_jsons}, 200
api.add_resource(AdminSearchProfessionalApi, '/api/admin/search_professionals')         
            
            
###CUSTOMER - SEARCH 

class SearchServiceApi(Resource):
    @auth_required('token')
    @roles_required('customer')
    def post(self):
        data = request.json
        print("Received Data:", data)  # Debugging

        # Base query
        query = Service.query

        # Apply filters based on input
        if data.get("name"):
            query = query.filter(Service.name.ilike(f"%{data['name']}%"))
        if "min_time_required" in data:
            try:
                min_time = int(data["min_time_required"])
                query = query.filter(Service.time_required > min_time)
            except ValueError:
                return {"message": "Invalid min_time_required value"}, 400

        if "max_base_price" in data:
            try:
                max_price = int(data["max_base_price"])
                query = query.filter(Service.base_price < max_price)
            except ValueError:
                return {"message": "Invalid max_base_price value"}, 400

        # Fetch results
        services = query.all()

        if not services:
            return {"message": "No services found matching criteria"}, 404

        # Format response JSON
        service_jsons = [{
            "id": service.id,
            "name": service.name,
            "time_required": service.time_required,
            "base_price": service.base_price,
            "description": service.description
        } for service in services]

        return {"services": service_jsons}, 200

api.add_resource(SearchServiceApi, '/api/search_services')
