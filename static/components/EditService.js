export default {
    template: `
      <div class="row align-items-center justify-content-center mt-5">
        <div class="col-md-4">
          <div class="card shadow-lg p-4">
            <h2 class="text-center mb-3">Edit Service</h2>
            <form @submit.prevent="edit">
              
              <!-- Service Name Field (Disabled) -->
              <div class="mb-3">
                <label for="name" class="form-label">Service Name</label>
                <input type="text" id="name" v-model="formData.name" class="form-control" disabled />
              </div>
              
              <!-- Description Field -->
              <div class="mb-3">
                <label for="description" class="form-label">Description</label>
                <textarea id="description" v-model="formData.description" class="form-control" rows="3"></textarea>
              </div>
              
              <!-- Base Price Field -->
              <div class="mb-3">
                <label for="base_price" class="form-label">Base Price</label>
                <input type="number" id="base_price" v-model="formData.base_price" class="form-control" step="0.01" required />
              </div>
              
              <!-- Time Required Field -->
              <div class="mb-3">
                <label for="time_required" class="form-label">Time Required</label>
                <input type="text" id="time_required" v-model="formData.time_required" class="form-control" />
              </div>
              
              <!-- Submit Button -->
              <div class="text-center">
                <button type="submit" class="btn btn-primary">Edit Service</button>
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
    created() {
      this.fetchService(); // Fetch data when component is created
    },
    methods: {
      fetchService() {
        fetch(`/api/service/${this.$route.params.id}`, {
          headers: {
            "Authentication-Token": localStorage.getItem("auth_token")
          }
        })
        .then(response => response.json())
        .then(data => {
          this.formData = {
            name: data.name,
            description: data.description,
            base_price: data.base_price,
            time_required: data.time_required
          };
        })
        .catch(error => {
          console.error("Error fetching service:", error);
          alert("Failed to fetch service details.");
        });
      },
      edit() {
        fetch(`/api/service/update/${this.$route.params.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": localStorage.getItem("auth_token")
          },
          body: JSON.stringify(this.formData)
        })
        .then(response => response.json())
        .then(data => {
          console.log("Service Edited:", data);
          alert("Service edited successfully!");
        })
        .catch(error => {
          alert("An error occurred. Please try again.");
        });
      }
    }
  };
  