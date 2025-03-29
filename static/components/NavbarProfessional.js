export default {
    template: `
    <nav class="navbar sticky-top bg-light shadow-sm px-4">
        <div class="d-flex align-items-center">
            <router-link class="navbar-brand d-flex align-items-center" to="/admin">
                <img src="/static/logo.png" alt="logo" width="60" height="55" style="border-radius: 50%;">
                <span class="ms-2 fw-bold">The A to Z Home Service App</span>
            </router-link>
        </div>


        <!-- Logout button on the right -->
        <div class="ms-auto pe-4">
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