export default {
    template:`
    <div class="d-flex flex-column vh-100">
      <div class="d-flex flex-column mt-4 mb-4 pt-4" style="height: 20vh;">
        <div class="text-center fst-italic fw-bold fs-3">
          Welcome, {{userData.username}}
        </div>
      </div>
      <hr class="mx-5">
      <div class="d-flex flex-column flex-grow-1 mt-3">
        <h2 class="text-2xl font-bold mb-4 text-center mb-5 ">Looking for?</h2>
        <div class="container">
          <div class="row g-4">
            <div v-for="service in services" :key="service.id" class="col-12 col-sm-6 col-md-4 col-lg-3">
              <div class="card h-100 shadow">
                <div class="card-body d-flex flex-column">
                  <h3 class="card-title text-center my-3">{{ service.name }}</h3>
                  <p class="card-text text-muted ms-1 text-center">{{ service.description }}</p>
                  <div class="mt-auto"> 
                      <p class="card-text f ms-1">Time Required: {{ service.time_required }} hour</p>
                      <p class="card-text fw-bold ms-1 mb-5 ">Base Price: ₹{{ service.base_price }}</p>
              
                    <div class=" d-flex justify-content-evenly my-3">
                      <router-link v-if="service && service.id"  :to="{name:'customer/selectprof',params:{id:service.id}}" class="btn btn-success me-3">Book</router-link>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
  </div>
    
    `,



    data: function(){
      return {
        userData:{},
        services: null
      }
    },
    mounted(){
      fetch('/api/customer',{
          method:'GET',
          headers:{
              "Content-Type":"application/json",
              "Authentication-Token":localStorage.getItem("auth_token")
          }
      })
      .then(response => {
        if (!response.ok) {
            throw new Error("Failed to fetch user data");
        }
        return response.json();})
      .then(data=>this.userData=data)

      fetch('/api/service/get',{
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

