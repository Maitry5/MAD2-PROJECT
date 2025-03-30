export default {
    template: `
    <div class="d-flex flex-column justify-content-center mx-5 mt-3">
    <!-- Live Requests Table -->
    <h3 class="text-center text-decoration-underline fw-bold my-4">Live Requests</h3>
    <table  v-if="liveRequests.length > 0" class="table table-bordered table-hover mb-5">
        <thead class="table-primary">
            <tr>
                <th>Request ID</th>
                <th>Service</th>
                <th>Professional</th>
                <th>Customer ID</th>
                <th>Offered Price</th>
                <th>Request Date</th>
                <th>Status</th>
                <th>Base Price</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="sr in liveRequests" :key="sr.id">
                <td>{{ sr.id }}</td>
                <td>{{ sr.service_name }}</td>
                <td>{{ sr.professional_name}}</td>
                <td>{{sr.customer_id}}</td>
                <td>₹{{ sr.offered_price }}</td>
                <td>₹{{ sr.base_price }}</td>
                <td>{{ formatDate(sr.date_requested) }}</td>
                <td>
                    <span :class="statusBadgeClass(sr.status)">{{ sr.status }}</span>
                </td>
        
                <td>
                    <button v-if="sr.status === 'requested' " @click="DeleteRequest(sr.id)" class="btn btn-danger btn-sm"><i class="bi bi-x-circle"></i> Delete</button>
                </td>
                
            </tr>
        </tbody>
    </table>
    <p v-else class="text-center fs-3 fw-bold text-muted mt-5">No live requests currently</p>
    </div>

   
  `,
    data() {
      return {
        liveRequests: [],

    
      };
    },
    mounted() {
      this.fetchRequests();
    },
    methods: {
      formatDate(dateString) {
            if (!dateString) return 'N/A';
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            return new Date(dateString).toLocaleDateString(undefined, options);
        },
      statusBadgeClass(status) {
            return {
                'badge bg-primary': status === 'requested',
                'badge bg-warning': status === 'assigned',
            };
        },
      fetchRequests() {
        fetch("/api/service_request", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": localStorage.getItem("auth_token")
          }
        })
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            if (data.requests) {
              this.liveRequests = data.requests.filter(req => req.status === "requested" );
            } else {
              console.error("Unexpected API response:", data);
            }
          })
          .catch(error => {
            console.error("Error fetching requests:", error);
          });
      },
     DeleteRequest(requestId) {
        fetch(`/api/service_request/delete/${requestId}`, {
            method: "Delete",
            headers: {
                "Content-Type": "application/json",
                "Authentication-Token": localStorage.getItem("auth_token")
            }
          
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                console.log("Request deleted successfully");
                this.liveRequests = this.liveRequests.filter(req => req.id !== requestId);
              
            }
        })
        .catch(error => {
            console.error("Error deleting request:", error);
        });
    }
    }
  };
  