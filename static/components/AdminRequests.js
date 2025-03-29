export default {
    template: `
    <div class="container mt-5">
        <h1 class="text-center text-decoration-underline">Requests from Professionals</h1>

        <div v-if="professionals.length > 0">
            <div class="table-responsive border mt-4">
                <table class="table table-striped table-hover">
                    <thead class="table-dark">
                        <tr>
                            <th class="ps-5">ID</th>
                            <th>Name</th>
                            <th>Experience</th>
                            <th>Service Type</th>
                            <th>Document</th>
                            <th class="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="professional in professionals" :key="professional.id">
                            <td class="ps-5">{{ professional.id }}</td>
                            <td>{{ professional.name }}</td>
                            <td>{{ professional.experience }} years</td>
                            <td>{{ professional.service_type }}</td>
                            <td>
                                <a :href="professional.verification_document" target="_blank" class="btn btn-info btn-sm">
                                    View
                                </a>
                            </td>
                            <td class="text-center d-flex justify-content-evenly">
                                <button @click="verifyProfessional(professional.id, true)" class="btn btn-success btn-sm me-2">
                                    Approve
                                </button>
                                <button @click="verifyProfessional(professional.id, false)" class="btn btn-danger btn-sm">
                                    Reject
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <h1 v-else class="text-center mt-5">No requests for approval.</h1>
    </div>
    `,

    data() {
        return {
            professionals: []
        };
    },

    created() {
        this.fetchProfessionals();
    },

    methods: {
        fetchProfessionals() {
            fetch('/api/admin/requests', {  
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                this.professionals = data;
            })
            .catch(error => {
                console.error("Error fetching professionals:", error);
            });
        },

        verifyProfessional(professionalId, isApproved) {
            if (!confirm(`Are you sure you want to ${isApproved ? "approve" : "reject"} this professional?`)) return;

            fetch(`/api/admin/verify/${professionalId}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                },
                body: JSON.stringify({ verified: isApproved })
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                this.fetchProfessionals(); // Refresh list
            })
            .catch(error => {
                console.error(`Error updating professional verification:`, error);
            });
        }
    }
};



            