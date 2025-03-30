export default {
    template: `
    <div class="container mt-5">
        <h1 class="text-center text-decoration-underline">Service Request for {{ service.name }}</h1>
        <div id="form-container" class="p-4 rounded shadow bg-warning">
            <form @submit.prevent="submitRequest">
                <div class="mb-3">
                    <label class="form-label">Customer ID</label>
                    <input type="text" class="form-control" :value="customer" disabled>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Service Professional ID</label>
                    <input type="text" class="form-control" :value="professional" disabled>
                </div>

                <div class="mb-3">
                    <label class="form-label">Address</label>
                    <textarea v-model.trim="request.address" class="form-control" rows="3" required></textarea>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Offered Price</label>
                    <input type="number" v-model.number="request.offered_price" class="form-control" :min="service.base_price" required>
                    <small class="form-text text-muted">Minimum: ₹{{ service.base_price }}</small>
                </div>

                <div class="mb-3">
                    <label class="form-label">Date of Request</label>
                    <input type="date" v-model="request.date_requested" class="form-control" required>
                </div>

                <div class="text-center">
                    <button type="submit" class="btn btn-primary">Create Request</button>
                </div>
            </form>
        </div>
    </div>
    `,

    data() {
        return {
            service: {},
            customer:  "",
            professional: this.$route.params.prof_id,
            request: {
                address: '',
                offered_price: '',
                date_requested: ''
            }
        };
    },


    created() {
        this.customer = localStorage.getItem("id");
        this.fetchService();
 },
    

    methods: {
        
        fetchService() {
            fetch(`/api/service/${this.$route.params.service_id}`, {
                headers: {
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            .then(response => {
                if (!response.ok) throw new Error("Failed to fetch service details.");
                return response.json();
            })
            .then(data => {
                if (!data.id) throw new Error("Invalid service data received.");
                console.log(data)
                this.service = data;
            })
            .catch(error => {
                console.error("Error fetching service:", error);
                alert("Failed to fetch service details.");
            });
        },
       

        submitRequest() {
           
            if (!this.validateRequest()) return;
            console.log("Customer ID:", this.customer);
            console.log("Professional ID:", this.professional);
            console.log("Service ID:", this.service.id);

            if (!this.customer || !this.professional || !this.service.id) {
                 alert("One or more required fields are missing.");
                return;
            }
          
            const formattedDate = new Date(this.request.date_requested).toISOString().split("T")[0];

            const requestData = {
                customer_id: parseInt(this.customer),
                professional_id: parseInt(this.professional),
                service_id: parseInt(this.service.id),  // Ensure it's an integer
                address: this.request.address.trim(),
                offered_price: parseFloat(this.request.offered_price),
                date_requested: formattedDate
            };
        
            console.log("Final Payload:", JSON.stringify(requestData, null, 2));
        

            fetch('/api/service_request/create', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                },
                body: JSON.stringify(requestData)
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                alert("Service request created successfully!");
                this.$router.push("/customer/SR");
            })
            .catch(error => {
                console.error("Error creating request:", error);
                alert("Failed to create service request.");
            });
        },

        validateRequest() {
            if (!this.request.address.trim()) {
                alert("Address is required.");
                return false;
            }
            if (parseFloat(this.request.offered_price) < this.service.base_price) {
                alert(`Offered price must be at least ₹${this.service.base_price}`);
                return false;
            }
            const today = new Date().toISOString().split("T")[0];
            if (this.request.date_requested < today) {
                alert("Date of request cannot be in the past.");
                return false;
            }
            return true;
        }
    }
};


