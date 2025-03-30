export default {
    template: `
    <div class="container mb-5">
        <div class="container0 mt-5">
            <h1 class="text-center text-underline">{{ professional.username }}</h1>
            <p class="text-center">{{ professional.bio }}</p>
        </div>
        <div class="c1">
            <p>Service: {{ professional.service_type }}</p>
            <p>Base Price: ₹{{ professional.base_price }}</p>
        </div>
        <div class="c1">
            <p>City: {{ professional.city }}</p>
            <p>Experience: {{ professional.experience }} years</p>
        </div>
        <hr>
        <div class="container1 mt-4" v-if="requests.length">
            <h1 class="text-center mt-5 text-decoration-underline">Requests for Service</h1>
            <table class="table align-middle table-striped-column table-hover table-light mt-5">
                <thead class="table-dark">
                    <tr>
                        <th>Request ID</th>
                        <th>Customer</th>
                        <th>Request Date</th>
                        <th>Price</th>
                        <th>Address</th>
                        <th>Status</th>
                        <th class="action-column">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="request in requests" :key="request.id">
                        <td>{{ request.id }}</td>
                        <td>{{ request.customer_name }}</td>
                        <td>{{ formatDate(request.date_requested) }}</td>
                        <td>₹{{ request.offered_price }}</td>
                        <td>{{ request.address }}</td>
                        <td>{{request.status}}</td>
                        <td class="action-buttons">
                            <button v-if="request.status === 'requested'" @click="acceptRequest(request.id)" class="btn btn-success">Accept</button>
                            <button v-if="request.status === 'requested'" @click="rejectRequest(request.id)" class="btn btn-danger">Reject</button>
                            <button v-if="request.status === 'assigned'" @click="closeRequest(request.id)" class="btn btn-info">Close</button>
                        </td>
                    </tr>
                </tbody>
            </table>
           
        </div>
        <p v-if="!requests.length" class="text-center text-danger mt-4">No live request currently!</p>
        <div class="container2 mt-5" v-if="closedRequests.length">
            <h1 class="text-center mt-5 text-decoration-underline">Closed Requests</h1>
            <table class="table align-middle table-striped-column table-hover table-light mt-5">
                <thead class="table-dark">
                    <tr>
                        <th>Request ID</th>
                        <th>Customer</th>
                        <th>Request Date</th>
                        <th>Price</th>
                        <th>Completion Date</th>
                        <th>Rating</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="request in closedRequests" :key="request.id">
                        <td>{{ request.id }}</td>
                        <td>{{ request.customer_name }}</td>
                        <td>{{ formatDate(request.date_requested) }}</td>
                        <td>₹{{ request.offered_price }}</td>
                        <td>{{ formatDate(request.date_completed) }}</td>
                        <td>{{ request.rating || 'N/A' }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p v-if="!closedRequests.length" class="text-center text-danger mt-4">No close requests!</p>
    </div>
    `,
    data() {
        return {
            professional: {
                username: '',
                bio: '',
                service_type: '',
                base_price: 0,
                city: '',
                experience: 0
            },
            requests: [],
            closedRequests: []
        };
    }
    ,

    created() {
        this.fetchProfessionalData();
    },

    methods: {
        fetchProfessionalData() {
            fetch('/api/professional', {
                headers: { "Authentication-Token": localStorage.getItem("auth_token") }
            })
            .then(response => response.json())
            .then(data => {
                const processedRequests = data.service_requests.map(req => ({
                    ...req,
                    date_requested: req.date_requested || null,
                    date_completed: req.date_completed || null,
                    rating: req.rating || null,
                    offered_price: req.offered_price || 0,
                    address: req.address || ''
                }));
        
                this.professional = data;
                this.requests = processedRequests.filter(req => req.status !== 'closed' && req.status !== 'rejected');
                this.closedRequests = processedRequests.filter(req => req.status === 'closed');
            })
            .catch(error => console.error("Error fetching data:", error));
        }
        ,
        
        formatDate(date) {
            return date ? new Date(date).toLocaleDateString() : 'N/A';
        },
        
        acceptRequest(id) {
            this.updateRequestStatus(id, 'assigned');
        },
        
        rejectRequest(id) {
            this.updateRequestStatus(id, 'rejected');
        },
        
        closeRequest(id) {
            this.updateRequestStatus(id, 'closed');
        },

        updateRequestStatus(requestId, newStatus) {
            fetch(`/api/service_request/update_status/${requestId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                },
                body: JSON.stringify({ status: newStatus })
            })
            .then(response => {
                if (!response.ok) throw new Error('Failed to update status');
                return response.json();
            })
            .then(data => {
                // Fetch fresh data to ensure UI reflects database state
                this.fetchProfessionalData();
            })
            .catch(error => {
                console.error("Error updating status:", error);
            });
        }
    }
}