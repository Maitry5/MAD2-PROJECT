export default {
    template: `
<div class="  d-flex flex-column flex-grow-1 bg-light " >
    <div class="row  align-items-center justify-content-center">
        <div class="col-md-6 text-center">
            <div class="navbar-brand mt-4 fs-3 fw-bold">
                <img src="../static/logo.png" alt="logo" width="80" height="80" style="border-radius: 50%;">
                <p class="mt-1">The A to Z Home Service App</p>
            </div>
        </div>
    </div>

    <!-- Second Row  -->
    <div class="row align-items-center justify-content-center ">
        <div class="col-md-3">
            <h3 class="text-danger text-center mb-4">{{message}}</h3>
            <div class="card shadow-lg p-4">
                <h2 class="text-center mb-3">Login Form</h2>
    
                <form @submit.prevent="loginUser">
                    <div class="mb-3">
                        <label for="email" class="form-label">Enter your email:</label>
                        <input type="email" id="email" v-model="formData.email" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label for="password" class="form-label">Enter your password:</label>
                        <input type="password" id="password" v-model="formData.password" class="form-control" required>
                    </div>
                    <div class="d-grid">
                        <button type="submit" class="btn btn-primary w-30 mx-auto">Login</button>
                    </div>
                </form>
                <hr>
                <div class="text-center">
                    New User?
                    <div class="btn-group dropend">
                        <button type="button" class="btn btn-outline-primary">
                            Register here 
                        </button>
                        <button type="button" class="btn btn-primary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
                            <span class="visually-hidden">Toggle Dropend</span>
                        </button>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" @click="goToCustomerRegister">Register as Customer</a></li>
                            <li><a class="dropdown-item" @click="goToProfessionalRegister">Register as Professional</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`,
   
    data() {
        return {
            formData: {
                email: "",
                password: ""
            },
            message: "",
        };
    },
    methods: {
        loginUser() {
            fetch('/api/login', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(this.formData) //the content goes to backend as JSON string
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                if(Object.keys(data).includes("auth_token")){
                    localStorage.setItem("auth_token", data["auth_token"]);
                    localStorage.setItem("id", data.user.id);
                    localStorage.setItem("username", data.user.username);
                    localStorage.setItem("authRole", JSON.stringify(data.user.roles));
    
                    console.log("User Roles:", data.user.roles);
                    if(data.user.roles.includes('admin')){
                        this.$router.push('/admin');}
                    else if((data.user.roles.includes('customer'))){
                        this.$router.push('/customer');
                    }
                    else if((data.user.roles.includes('professional'))){
                        this.$router.push('/professional'); }
                    }
                else{
                    this.message = data.message }
                })     
        },
        goToCustomerRegister() {
            this.$router.push('/register/customer');
        },
        goToProfessionalRegister() {
            this.$router.push('/register/professional');
        }
    }
}

//response.json itself sends you a promise, now we need to resolve another promise
//summary : The fetch request returns a promise, to resolve that promise I do a .then, and store it in the variable
//response, whatever response is stored, i try to convert it into json using .json, but this in turn returns 
//another promise, which I try to resolve in data.


//whatever i want to render when the login component is loaded, i have to provide as value 
//to the template