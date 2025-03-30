export default {
    template: `
    <nav class="navbar sticky-top bg-light shadow-sm px-3">
        <div class="d-flex align-items-center">
            <router-link class="navbar-brand d-flex align-items-center" to="/admin">
                <img src="/static/logo.png" alt="logo" width="60" height="55" style="border-radius: 50%;">
                <span class="ms-2 fw-bold">Admin</span>
            </router-link>
        </div>

        <!-- Centered Links -->
        <div class="d-flex gap-4 fs-4 flex-grow-1 justify-content-center">
            <router-link class="nav-link" :to="'/admin'" :class="{ 'fw-bold': $route.path === '/admin' }">Home</router-link>
            <router-link class="nav-link" :to="'/adminrequest'" :class="{ 'fw-bold': $route.path === '/adminrequest' }">Requests</router-link>
            <router-link class="nav-link" :to="'/adminsearch'" :class="{ 'fw-bold': $route.path === '/adminsearch' }">Search</router-link>
        </div>

        <!-- Logout button on the right -->
        <div class="ms-auto">
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
