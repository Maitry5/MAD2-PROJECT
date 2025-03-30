export default {
    props: {
        usertype: {
            type: String,
            required: true
        }
    }, 
    template: `
    <div class="container mt-5">
        <h1 class="text-center text-decoration-underline">{{ title }}</h1>

        <div v-if="users.length > 0">
            <div class="table-responsive border mt-4">
                <table class="table table-striped table-hover">
                    <thead class="table-dark">
                        <tr>
                            <th class="ps-5">ID</th>
                            <th>Name</th>
                            <th>City</th>
                            <th v-if="usertype === 'professionals'">Experience</th>
                            <th v-if="usertype === 'professionals'">Service Type</th>
                            <th>Total Requests</th>
                            <th class="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="user in users" :key="user.id">
                            <td class="ps-5">{{ user.id }}</td>
                            <td>{{ user.name }}</td>
                            <td>{{ user.city }}</td>
                            <td v-if="usertype === 'professionals'">{{ user.experience }} years</td>
                            <td v-if="usertype === 'professionals'">{{ user.service_type }}</td>
                            <td>{{ user.total_requests }}</td>
                            <td class="text-center d-flex justify-content-evenly">
                                <button @click="toggleBlock(user.id, !user.active)" :class="['btn', user.active ? 'btn-danger' : 'btn-success', 'btn-sm']">
                                    {{ user.active ? 'Block' : 'Unblock' }}
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <h1 v-else class="text-center mt-5">No users found.</h1>
    </div>
    `,

    data() {
        return {
            users: []
        };
    },

    computed: {
        title() {
            return this.usertype === 'customers' ? 'All Customers' : 'All Verified Professionals';
        }
    },

    created() {
        this.fetchUsers();
    },

    methods: {
        fetchUsers() {
            console.log("Fetching users for:", this.usertype); // Debugging log

            fetch(`/api/admin/all_${this.usertype}`, {  
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            .then(response => response.json())
            .then(data => {
                console.log("Fetched users:", data);
                this.users = data;
            })
            .catch(error => {
                console.error("Error fetching users:", error);
            });
        },

        toggleBlock(userId, shouldBlock) {
            if (!confirm(`Are you sure you want to ${shouldBlock ? "block" : "unblock"} this user?`)) return;

            fetch(`/api/admin/block_user/${userId}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            .then(response => response.json())
            .then(data => {
                this.users = this.users.map(user => 
                    user.id === userId ? { ...user, active: data.active } : user
                ); 
            })
            .catch(error => {
                console.error(`Error updating user status:`, error);
            });
        }
    }
};

