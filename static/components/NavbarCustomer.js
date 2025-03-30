export default {
    template: `

    <nav class="navbar sticky-top bg-light shadow-sm ps-3">
        <div class="d-flex align-items-center">
            <router-link class="navbar-brand d-flex align-items-center" to="/admin">
                <img src="/static/logo.png" alt="logo" width="60" height="55" style="border-radius: 50%;">
                <span class="ms-2 fw-bold">Home Services</span>
            </router-link>
        </div>

        <!-- Centered Links -->
        <div class="d-flex gap-5 fs-4 flex-grow-1 justify-content-center pe-5 me-5">
            <router-link class="nav-link" :to="'/customer'" :class="{ 'fw-bold': $route.path === '/customer' }">Home</router-link>
            <router-link class="nav-link" :to="'/customer/SR'" :class="{ 'fw-bold': $route.path === '/customer/SR' }">Requests</router-link>
            <router-link class="nav-link" :to="'/customer/search'" :class="{ 'fw-bold': $route.path === '/customer/search' }">Search</router-link>
        </div>

        <!-- Logout button on the right -->
        <div class=" pe-5">
            <button class="btn btn-primary" @click="logout">Logout</button>
        </div>
    </nav>
    `,
    methods: {
        logout() {
            fetch("/api/logout", { method: "POST" })
                .then(() => {
                    this.$router.push("/");
                })
                .catch(err => console.error("Logout failed", err));
        }
    }
};