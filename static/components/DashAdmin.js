export default {
    template:`
    <div class="d-flex flex-column vh-100">
        <div class="d-flex flex-column mt-5 mb-4 pt-4" style="height: 20vh;">
            <div class="d-flex justify-content-between mx-5 px-5"> 
                <router-link to="/admin/create_service" class="fs-4 text-primary fw-bold">Add a Service</router-link>
                <router-link to="/dashboard" class="fs-4 text-primary fw-bold">All Professionals</router-link>
            </div>
               
            <div class="d-flex mt-5 mx-5 justify-content-between px-5">
                <router-link to="/dashboard" class="fs-4 text-primary fw-bold">Recent Service Requests</router-link>
                <router-link to="/dashboard" class="fs-4 text-primary fw-bold">All Customers</router-link>
                
            </div>
        </div>
    
        <hr class="mx-5">
         <!-- Table for displaying services -->
         <div class="container mt-4">
            <h2 class="text-center mb-5">All Services</h2>
         <div class="table-responsive border">
             <table class="table table-striped table-hover">
                 <thead class="table-dark">
                     <tr>
                         <th class="ps-5">ID</th>
                         <th>Service Name</th>
                         <th>Time Required</th>
                         <th >Base Price</th>
                         <th class="text-center">Action</th>
                     </tr>
                 </thead>
                 <tbody>
                     <tr v-for="service in services">
                         <td class="ps-5">{{ service.id }}</td>
                         <td>{{ service.name }}</td>
                         <td>{{ service.time_required }}</td>
                         <td>{{ service.base_price }}</td>
                         <td class="text-center d-flex justify-content-evenly">
                            <router-link v-if="service && service.id"  :to="{name:'adminedit',params:{id:service.id}}" class="btn btn-success btn-sm me-2">Edit</router-link>
                            <router-link v-if="service && service.id"  :to="{name:'adminview',params:{id:service.id}}" class="btn btn-primary btn-sm me-2">View</router-link>
                         </td>
                     </tr>
                 </tbody>
             </table>
         </div>
    </div>
        
          
       
    </div>`,
    data: function(){
        return {
            userData: "",
            services: null
        }
    },
    mounted(){
        fetch('/api/admin',{
            method:'GET',
            headers:{
                "Content-Type":"application/json",
                "Authentication-Token":localStorage.getItem("auth_token")
            }
        })
        .then(response=> response.json())
        .then(data=>{
            console.log(data)
            this.UserData=data})

        fetch('api/service/get',{
            method:'GET',
            headers:{
                "Content-Type":"application/json",
                "Authentication-Token":localStorage.getItem("auth_token")
            }
        })
        .then(response=>response.json())
        .then(data=>{
            console.log("Fetched services:", data.services);
            this.services=data.services})
    }

}