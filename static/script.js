import Home from "./components/Home.js"
import CustomerRegister from "./components/CustomerRegister.js"
import ProfessionalRegister from "./components/ProfessionalRegister.js"
import Login from "./components/Login.js"
import Navbar from "./components/Navbar.js"
import Footer from "./components/Footer.js"
import Admin from "./components/DashAdmin.js"
import Customer from "./components/DashCustomer.js"
import Professional from "./components/DashProfessional.js"

const routes=[
    {path:'/',component:Login},
    {path:'/register/customer',component:CustomerRegister},
    {path:'/register/professional',component:ProfessionalRegister},
    {path:'/admin',component:Admin},
    {path:'/customer',component:Customer},
    {path:'/professional',component:Professional},

]

const router=new VueRouter({
    routes:routes  //left is predefined, right is the value
})

const app=new Vue({
    el:"#app",
    router:router, //defined attribute router has value router
    template:`
    <div class="d-flex flex-column vh-100 bg-light">
         <!-- Conditional Navbar -->
         <component v-if="currentNavbar" :is="currentNavbar"></component>
    
        <!-- Main Content -->
        <div class="flex-grow-1">
            <router-view></router-view>
        </div>
    
        <!-- Footer -->
        <foot></foot>
    </div>

    `,
    computed: {
        currentNavbar() {
            const path = this.$route.path;

            // No navbar on login or registration pages
            if (["/", "/register/customer", "/register/professional"].includes(path)) {
                return null;
            }

            // Show different navbars based on user type
            if (path.startsWith("/admin")) return "nav-bar-admin";
            if (path.startsWith("/customer")) return "nav-bar-customer";


        }
    },
    components:{
        "nav-bar-admin": NavbarAdmin,
        "nav-bar-customer": NavbarCustomer,
        foot:Footer
    }
})