export default {
    template: `
      <div class="row align-items-center justify-content-center mt-5">
        <div class="col-md-4">
          <div class="card shadow-lg p-4">
            <h2 class="text-center mb-3">Add Service</h2>
            <form @submit.prevent="addService">
              
              <!-- Service Name Field -->
              <div class="mb-3">
                <label for="name" class="form-label">Service Name</label>
                <input type="text" id="name" v-model="formData.name" class="form-control" required />
              </div>
              
              <!-- Description Field -->
              <div class="mb-3">
                <label for="description" class="form-label">Description</label>
                <textarea id="description" v-model="formData.description" class="form-control" rows="3"></textarea>
              </div>
              
              <!-- Base Price Field -->
              <div class="mb-3">
                <label for="base_price" class="form-label">Base Price</label>
                <input type="number" id="base_price" v-model="formData.base_price" class="form-control" required step="0.01" />
              </div>
              
              <!-- Time Required Field -->
              <div class="mb-3">
                <label for="time_required" class="form-label">Time Required</label>
                <input type="text" id="time_required" v-model="formData.time_required" class="form-control" />
              </div>
              
              <!-- Submit Button -->
              <div class="text-center">
                <button class="btn btn-primary">Add Service</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `,
    data() {
      return {
        formData: {
          name: "",
          description: "",
          base_price: "",
          time_required: ""
        }
      };
    },
    methods: {
      addService() {
        fetch("/api/service/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token":localStorage.getItem("auth_token")
          },
          body: JSON.stringify(this.formData)
        })
        .then(response => {
          if (!response.ok) {
            throw new Error("Failed to add service. Please try again.");
          }
          return response.json();
        })
        .then(data => {
          console.log("Service Added:", data);
          alert("Service added successfully!");
          this.formData = { name: "", description: "", base_price: "", time_required: "" };
        })
        .catch(error => {
          alert(error.message || "An error occurred. Please try again.");
        });
      }
    }
  };
  