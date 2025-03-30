export default {
    template: `
    <div class="container">
      <h1 class="text-center text-decoration-underline mt-5 mb-5">Search for Service Professional</h1>
    
      <!-- Search Form -->
      <form class="d-flex mt-5 me-5 ms-5 gap-5" @submit.prevent="searchProfessionals">
        <select v-model="searchParam" class="form-select">
          <option value="username">Name</option>
          <option value="city">City</option>
          <option value="service_type">Service Type</option>
        </select>
        <input v-model="searchQuery" class="form-control" type="search" placeholder="Enter query">
        <button class="btn btn-outline-success" type="submit">Search</button>
      </form>
    
      <hr>
    
      <!-- Results Table -->
      <div v-if="professionals.length" class="table-responsive">
        <table class="table table-striped table-hover table-light mt-5">
          <thead class="table-dark">
            <tr>
              <th class="ps-5">ID</th>
              <th>Name</th>
              <th>Experience</th>
              <th>Service Type</th>
              <th>City</th>
              <th>Total Requests</th>
              <th class="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="professional in professionals" :key="professional.id">
              <td class="ps-5">{{ professional.id }}</td>
              <td>{{ professional.name }}</td>
              <td>{{ professional.experience }} years</td>
              <td>{{ professional.service_type }}</td>
              <td>{{ professional.city }}</td>
              <td>{{ professional.total_requests }}</td>
              <td class="text-center">
                <button 
                  v-if="professional.active" 
                  class="btn btn-danger" 
                  @click="blockProfessional(professional.id)">
                  Block
                </button>
                <button 
                  v-else 
                  class="btn btn-success" 
                  @click="unblockProfessional(professional.id)">
                  Unblock
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <h3 v-else class="text-center mt-5 text-muted">No matching professionals found.</h3>
    </div>
    `,
    
    data() {
      return {
        searchParam: "",
        searchQuery: "",
        professionals: []
      };
    },
    
    methods: {
      searchProfessionals() {
        if (!this.searchQuery.trim()) {
          alert("Please enter a search query.");
          return;
        }
    
        fetch("/api/admin/search_professionals", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": localStorage.getItem("auth_token")
          },
          body: JSON.stringify({ [this.searchParam]: this.searchQuery })
        })
        .then(response => {
          if (!response.ok) throw new Error("No professionals found");
          return response.json();
        })
        .then(data => {
          this.professionals = data.professionals;
        })
        .catch(error => {
          console.error("Search error:", error);
          this.professionals = [];
          alert(error.message);
        });
      },
    
      toggleBlock(professionalId, shouldBlock) {
        if (!confirm(`Are you sure you want to ${shouldBlock ? "block" : "unblock"} this professional?`)) return;
    
        fetch(`/api/admin/block_user/${professionalId}`, {
          method: 'PUT',
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": localStorage.getItem("auth_token")
          }
        })
        .then(response => response.json())
        .then(data => {
          this.professionals = this.professionals.map(professional => 
            professional.id === professionalId ? { ...professional, active: data.active } : professional
          );
        })
        .catch(error => {
          console.error("Error updating professional status:", error);
        });
      },
    
      blockProfessional(professionalId) {
        this.toggleBlock(professionalId, true);
      },
    
      unblockProfessional(professionalId) {
        this.toggleBlock(professionalId, false);
      }
    }
  };
  


