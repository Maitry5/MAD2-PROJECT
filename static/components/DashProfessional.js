export default {
  template: `
  <div class="d-flex flex-column vh-100">
      <div class="d-flex flex-column mt-5 mb-4 pt-4" style="height: 20vh;">
          <div class="text-center fst-italic fw-bold fs-3"> 
              Welcome, {{ userData.username }}
              <div class="fs-5">{{ userData.bio }}</div>
          </div>
          <div class="d-flex justify-content-between px-5">
              <div>
                  <p>Service:{{userData.service_type}}</p>
                  <p>Base Price:{{userData.base_price}}
              </div>
              <div>
                  <p>City:{{userData.city}}</p>
                  <p>Experience:{{userData.experience}}
              </div>
              
          </div>
      </div>
      
      <hr class="mx-5">
      
      <!-- Table for displaying service requests -->
      <div class="container mt-4">
          <h2 class="text-center">Your Service Requests</h2>
          <div v-if="userData.service_requests && userData.service_requests.length > 0">
              <div class="table-responsive">
                  <table class="table table-striped table-hover">
                      <thead class="table-dark">
                          <tr>
                              <th>ID</th>
                              <th>Service Name</th>
                              <th>Customer Name</th>
                              <th>Date of Request</th>
                              <th>Status</th>
                              <th>Remarks</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr v-for="req in userData.service_requests" :key="req.id">
                              <td>{{ req.id }}</td>
                              <td>{{ req.service_name }}</td>
                              <td>{{ req.customer_name }}</td>
                              <td>{{ req.date_of_request }}</td>
                              <td>{{ req.status }}</td>
                              <td>{{ req.remarks }}</td>
                          </tr>
                      </tbody>
                  </table>
              </div>
          </div>
          <div v-else class="text-center text-muted">No service requests found.</div>
      </div>
  </div>
  `,

  data: function () {
    return {
      userData: {}  // Stores the user data including service requests
    };
  },

  mounted() {
    fetch('/api/professional', {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authentication-Token": localStorage.getItem("auth_token")
        }
    })
    .then(response => {
      if (!response.ok) {
          throw new Error("Failed to fetch user data");
      }
      return response.json();
    })
    .then(data => this.userData = data)
    console.log(userData.username)
    .catch(error => console.error("Error fetching professional data:", error));
  }
};
