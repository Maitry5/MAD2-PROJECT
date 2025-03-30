export default {
    template: `
    <div class="d-flex flex-column justify-content-center mx-5 mt-3">
    <!-- Live Requests Table -->
    <h3 class="text-center text-decoration-underline fw-bold my-4">Live Requests</h3>
    <table class="table table-bordered table-hover mb-5">
        <thead class="table-primary">
            <tr>
                <th>Request ID</th>
                <th>Service</th>
                <th>Professional</th>
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
                <td>₹{{ sr.offered_price }}</td>
                <td>{{ formatDate(sr.date_requested) }}</td>
                <td>
                    <span :class="statusBadgeClass(sr.status)">{{ sr.status }}</span>
                </td>
                <td>₹{{ sr.base_price }}</td>
                <td>
                    <router-link v-if="sr.status === 'requested'" 
                    :to="{name:'customer/edit',params:{srid:sr.id}}" 
                    class="btn btn-warning btn-sm me-2"> 
                    <i class="bi bi-pencil-square"></i> Edit</router-link>
                    <button v-if="sr.status === 'assigned'" @click="closeRequest(sr.id)" class="btn btn-success btn-sm"><i class="bi bi-x-circle"></i> Close</button>
                </td>
                
            </tr>
        </tbody>
    </table>

    <!-- Closed Requests Table -->
    <h3 class="text-center text-decoration-underline fw-bold my-4">Closed Requests</h3>
    <table class="table table-bordered table-hover mb-5">
        <thead class="table-success">
            <tr>
                <th>Request ID</th>
                <th>Service</th>
                <th>Professional</th>
                <th>Offered Price</th>
                <th>Completion Date</th>
                <th>Rating</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="sr in closedRequests" :key="sr.id">
                <td>{{ sr.id }}</td>
                <td>{{ sr.service_name }}</td>
                <td>{{ sr.professional_name }}</td>
                <td>₹{{ sr.offered_price }}</td>
                <td>{{ formatDate(sr.date_completed) }}</td>
                <td>
                    <div class="rating-stars">
                        <i v-for="n in 5" :key="n" 
                           :class="['bi', sr.rating >= n ? 'bi-star-fill text-warning' : 'bi-star']"></i>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>

    <!-- Rejected Requests Table -->
    <h3 class="text-center text-decoration-underline fw-bold my-4">Rejected Requests</h3>
    <table class="table table-bordered table-hover mb-5">
        <thead class="table-danger">
            <tr>
                <th>Request ID</th>
                <th>Service</th>
                <th>Professional</th>
                <th>Offered Price</th>
                <th>Base Price</th>
                <th>Request Date</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="sr in rejectedRequests" :key="sr.id">
                <td>{{ sr.id }}</td>
                <td>{{ sr.service_name }}</td>
                <td>{{ sr.professional_name }}</td>
                <td>₹{{ sr.offered_price }}</td>
                <td>₹{{ sr.base_price || 'N/A' }}</td>
                <td>{{ formatDate(sr.date_requested) }}</td>
            </tr>
        </tbody>
    </table>
</div>

  `,
    data() {
      return {
        liveRequests: [],
        closedRequests: [],
        rejectedRequests: [],
    
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
                'badge bg-success': status === 'closed',
                'badge bg-danger': status === 'rejected'
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
              this.liveRequests = data.requests.filter(req => req.status === "requested" || req.status === "assigned");
              this.closedRequests = data.requests.filter(req => req.status === "closed");
              this.rejectedRequests = data.requests.filter(req => req.status === "rejected");
            } else {
              console.error("Unexpected API response:", data);
            }
          })
          .catch(error => {
            console.error("Error fetching requests:", error);
          });
      },
      editRequest(id) {
        // Implement edit functionality here
        console.log(`Edit request ID: ${id}`);
      },
     closeRequest(requestId) {
        fetch(`/api/service_request/update_status/${requestId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authentication-Token": localStorage.getItem("auth_token")
            },
            body: JSON.stringify({ status: "closed" })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                console.log("Request closed successfully");
                this.fetchRequests();
            }
        })
        .catch(error => {
            console.error("Error closing request:", error);
        });
    }
    }
  };
  