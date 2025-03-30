export default {
    template: `
      <div class="container">
        <h1 class="text-center text-decoration-underline mt-5 mb-5">Search for Service</h1>
      
        <!-- Search Form -->
        <form class="d-flex mt-5 me-5 ms-5  gap-5" @submit.prevent="searchServices">
          <select v-model="searchParam" class="form-select">
            <option value="name">Service Name</option>
            <option value="min_time_required">Time required is greater than</option>
            <option value="max_base_price">Base Price is less than</option>
          </select>
          <input v-model="searchQuery" class="form-control" type="search" placeholder="Enter query">
          <button class="btn btn-outline-success" type="submit">Search</button>
        </form>
      
       
      
        <!-- Services Grid -->
        <div v-if="services.length" class="d-flex flex-column flex-grow-1 mt-5">
        <div class="container mt-5">
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
    `,
  
    data() {
      return {
        searchParam: "name",
        searchQuery: "",
        services: []
      };
    },
  
    methods: {
      searchServices() {
        if (!this.searchQuery.trim()) {
          alert("Please enter a search query.");
          return;
        }

        
        
        fetch("/api/search_services", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": localStorage.getItem("auth_token")
          },
          body: JSON.stringify({ [this.searchParam]: this.searchQuery })
        })
        .then(response => response.json())
        .then(data => {
            if (data.services) {
                this.services = data.services;
              } else {
                this.services = []; // Ensure it is always an array
                alert("No matching services found.");
              }
            
        })
        .catch(error => {
          console.error("Search error:", error);
          this.services = [];
          alert("No matching services found.");
        });
      },
  
    }
  };
  