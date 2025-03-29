import Home from "./components/Home.js"
import CustomerRegister from "./components/CustomerRegister.js"
import ProfessionalRegister from "./components/ProfessionalRegister.js"
import Login from "./components/Login.js"
import NavbarAdmin from "./components/NavbarAdmin.js"
import NavbarCustomer from "./components/NavbarCustomer.js"
import NavbarProfessional from "./components/NavbarProfessional.js"
import Footer from "./components/Footer.js"
import Admin from "./components/DashAdmin.js"
import Customer from "./components/DashCustomer.js"
import Professional from "./components/DashProfessional.js"
import CreateService from "./components/CreateService.js"
import EditService from "./components/EditService.js"
import viewService from "./components/viewService.js"

const routes=[
    {path:'/',component:Login},
    {path:'/register/customer',component:CustomerRegister},
    {path:'/register/professional',component:ProfessionalRegister},
    {path:'/admin',component:Admin,meta: { requiresAuth: true, role: "admin" }},
    {path:'/customer',component:Customer,meta: { requiresAuth: true, role: "customer" }},
    {path:'/professional',component:Professional,meta: { requiresAuth: true, role: "professional" }},
    {path:'/admin/create_service',component:CreateService,meta: { requiresAuth: true, role: "admin" }},
    {path:'/adminedit/:id',name:'adminedit',component:EditService, props: true,meta:{requiresAuth: true, role: "admin" }},
    {path:'/adminview/:id',name:'adminview',component:viewService, props: true,meta:{requiresAuth: true, role: "admin" }}
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
            if (path.startsWith("/professional")) return "nav-bar-professional";


        }
    },
    components:{
        "nav-bar-admin": NavbarAdmin,
        "nav-bar-customer": NavbarCustomer,
        "nav-bar-professional":NavbarProfessional,
        foot:Footer
    }
})