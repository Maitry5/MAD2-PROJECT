export default {
    template: `
<div class="d-flex flex-column flex-grow-1 bg-light " >
    <div class="row  align-items-center justify-content-center">
            <div class="col-md-6 text-center">
                <div class="navbar-brand mt-4 fs-3 fw-bold">
                    <img src="../static/logo.png" alt="logo" width="80" height="80" style="border-radius: 50%;">
                    <p class="mt-1">The A to Z Home Service App</p>
                </div>
            </div>
    </div>
      <!-- Registration Form Section -->
    
    <div class="row align-items-center justify-content-center ">
        <div class="col-md-4">
          <h3 v-if="message" class="text-danger text-center mb-3">{{ message }}</h3>
          <div class="card shadow-lg p-4">
          <h2 class="text-center mb-3">Customer Registeration</h2>
          <form @submit.prevent="registerCustomer">
              <!-- Username Field -->
              <div class="mb-3">
                  <label for="username" class="form-label">Username:</label>
                  <input type="text" id="username" v-model="formData.username" class="form-control" required />
              </div>
  
              <!-- Email Field -->
              <div class="mb-3">
                  <label for="email" class="form-label">Email:</label>
                  <input type="email" id="email" v-model="formData.email" class="form-control" required />
              </div>
  
              <!-- Password Field -->
              <div class="mb-3">
                  <label for="password" class="form-label">Password:</label>
                  <input type="password" id="password" v-model="formData.password" class="form-control" required />
              </div>
  
              <!-- City Field -->
              <div class="mb-3">
                  <label for="city" class="form-label">City:</label>
                  <input type="text" id="city" v-model="formData.city" class="form-control" required />
              </div>
  
              <!-- Submit Button -->
              <div class="d-grid">
                    <button class="btn btn-primary w-30 mx-auto" >Register</button>
              </div>
          </form>
      </div>
</div>
  </div>
  </div>`,
    data: function () {
      return {
        formData: {
          username: "",
          email: "",
          password: "",
          city: "",
        },
        message: "",
      };
    },
    methods: {
      registerCustomer: function () {
        fetch("/api/customer/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.formData),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Registration failed. Please try again.");
            }
            return response.json();
        })
        .then((data) => {
            console.log("Customer Registered:", data);
            this.$router.push("/"); // Navigate to the login page after successful registration
          })
        .catch((error) => {
            this.message = error.message || "An error occurred. Please try again.";
        });
      },
    },
  };
  


