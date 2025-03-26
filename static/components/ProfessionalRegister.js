export default {
    template: `
    <div class="d-flex flex-column flex-grow-1 bg-light">
        <div class="row align-items-center justify-content-center">
            <div class="col-md-6 text-center">
                <div class="navbar-brand mt-4 fs-3 fw-bold">
                    <img src="../static/logo.png" alt="logo" width="80" height="80" style="border-radius: 50%;">
                    <p class="mt-1">The A to Z Home Service App</p>
                </div>
            </div>
        </div>
        
        <div class="row align-items-center justify-content-center">
            <div class="col-md-4">
                <h3 v-if="message" class="text-danger text-center mb-3">{{ message }}</h3>
                <div class="card shadow-lg p-4">
                    <h2 class="text-center mb-3">Professional Registration</h2>
                    <form @submit.prevent="registerProfessional">
                        <div class="mb-3">
                            <label for="username" class="form-label">Username:</label>
                            <input type="text" id="username" v-model="formData.username" class="form-control" required />
                        </div>

                        <div class="mb-3">
                            <label for="email" class="form-label">Email:</label>
                            <input type="email" id="email" v-model="formData.email" class="form-control" required />
                        </div>

                        <div class="mb-3">
                            <label for="password" class="form-label">Password:</label>
                            <input type="password" id="password" v-model="formData.password" class="form-control" required />
                        </div>

                        <div class="mb-3">
                            <label for="city" class="form-label">City:</label>
                            <input type="text" id="city" v-model="formData.city" class="form-control" required />
                        </div>

                        <div class="mb-3">
                            <label for="service_type" class="form-label">Service Type:</label>
                            <select id="service_type" v-model="formData.service_type" class="form-control" required>
                                <option v-for="service in services" :key="service.id" :value="service.name">{{ service.name }}</option>
                            </select>
                        </div>

                        <div class="mb-3">
                            <label for="bio" class="form-label">Bio:</label>
                            <textarea id="bio" v-model="formData.bio" class="form-control" required></textarea>
                        </div>

                        <div class="mb-3">
                            <label for="experience" class="form-label">Experience (in years):</label>
                            <input type="number" id="experience" v-model="formData.experience" class="form-control" required />
                        </div>

                        <div class="mb-3">
                            <label for="verification_document" class="form-label">Verification Document (URL):</label>
                            <input type="text" id="verification_document" v-model="formData.verification_document" class="form-control" required />
                        </div>

                        <div class="d-grid">
                            <button class="btn btn-primary w-30 mx-auto">Register</button>
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
                service_type: "",
                bio: "",
                experience: "",
                verification_document: ""
            },
            services: [],
            message: ""
        };
    },
    mounted() {
        this.fetchServices();
    },
    methods: {
        fetchServices() {
            fetch("/api/service/get")
                .then(response => response.json())
                .then(data => {
                    this.services = data;
                })
                .catch(error => {
                    console.error("Error fetching services:", error);
                });
        },
        registerProfessional() {
            fetch("/api/professional/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(this.formData),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Registration failed. Please try again.");
                }
                return response.json();
            })
            .then(data => {
                console.log("Professional Registered:", data);
                this.$router.push("/");
            })
            .catch(error => {
                this.message = error.message || "An error occurred. Please try again.";
            });
        },
    },
};

