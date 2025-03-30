export default {
    template: `
    <div class="row d-flex justify-content-center align-items-center mt-5">
        <h1 class="text-center text-decoration-underline">Edit Service Request #{{ service.id }}</h1>
        <div id="form-container" class="p-4 col-md-4 mt-5 rounded shadow bg-warning">
            <form @submit.prevent="submitRequest">
                
                <div class="mb-3">
                    <label class="form-label">Service Professional </label>
                    <input type="text" class="form-control" :value="professional" disabled>
                </div>

                <div class="mb-3">
                    <label class="form-label">Address</label>
                    <textarea v-model.trim="service.address"  class="form-control"  rows="3"></textarea>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">Offered Price</label>
                    <input type="number" v-model.number="service.offered_price" class="form-control" :min="service.base_price">
                    <small class="form-text text-muted">Minimum: ₹{{ service.base_price }}</small>
                </div>

                <div class="mb-3">
                    <label class="form-label">Date of Request</label>
                    <input type="date" v-model="service.date_requested" class="form-control">
                </div>

                <div class="text-center">
                    <button type="submit" class="btn btn-primary">Edit Request</button>
                </div>

            </form>
        </div>
    </div>
    `,

    data() {
        return {
            customer: '',
            professional: '',
            service: {
                address: '',
                offered_price: 0,
                date_requested: '',
                base_price: 0
            }
        };
    },

    created() {
        this.customer =localStorage.getItem("id"),
        this.fetchServiceR(); // Fetch service request when component is created
    },

    methods: {
        fetchServiceR() {
            fetch(`/api/service_request/${this.$route.params.srid}`, {
                headers: {
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            .then(response => {
                if (!response.ok) throw new Error("Failed to fetch service request details.");
                return response.json();
            })
            .then(data => {
                if (!data.id) throw new Error("Invalid request data received.");
                console.log(data);
                this.service = data;
                this.professional = data.professional_id;
            })
            .catch(error => {
                console.error("Error fetching service request:", error);
                alert("Failed to fetch service details.");
            });
        },

        submitRequest() {
            if (!this.validateRequest()) return;
        
            const formattedDate = new Date(this.service.date_requested).toISOString().split("T")[0];
        
            const payload = {
                customer_id: parseInt(this.customer),  
                professional_id:parseInt(this.professional),
                service_id:parseInt(this.service),
                address: this.service.address.trim(),
                offered_price: parseFloat(this.service.offered_price),
                date_requested: formattedDate
            };
        
            console.log("📌 Final Payload:", payload); // Debugging
        
            fetch(`/api/service_request/update/${this.$route.params.srid}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                },
                body: JSON.stringify(payload)
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                alert("Service request updated successfully!");
                this.$router.push("/customer/SR");
            })
            .catch(error => {
                console.error("Error updating request:", error);
                alert("Failed to update service request.");
            });
        },
        

        validateRequest() {
            if (!this.service.base_price || 
                parseFloat(this.service.offered_price) < this.service.base_price) {
                alert(`Must be ≥ ₹${this.service.base_price || 'N/A'}`);
                return false;
            }
            return true;
        }
    }
};




