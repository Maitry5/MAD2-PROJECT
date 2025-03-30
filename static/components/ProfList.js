export default {
    template: `
    <div class="container mt-5">
        <h1 class="text-center text-decoration-underline mb-5">All Professionals for {{ service.name }} </h1>

        <div v-if="professionals.length > 0">
            <div class="table-responsive border mt-4 mx-5">
                <table class="table table-striped table-hover">
                    <thead class="table-dark">
                        <tr>
                            <th class="ps-5">ID</th>
                            <th>Name</th>
                            <th>Experience</th>
                            <th>Service Type</th>
                            <th>Bio</th>
                            <th class="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="professional in professionals" :key="professional.id">
                            <td class="ps-5">{{ professional.id }}</td>
                            <td>{{ professional.name }}</td>
                            <td>{{ professional.experience }} years</td>
                            <td>{{ professional.service_type }}</td>
                            <td>{{ professional.bio }}</td>
                            <td class="text-center d-flex justify-content-evenly">
                                <router-link v-if="professional.service_type && professional.id"  :to="{name:'customer/createSR',params:{prof_id:professional.id,service_id:service.id}}" class="btn btn-success btn-sm me-2">Select</router-link>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <h1 v-else class="text-center mt-5">No professionals available.</h1>
    </div>
    `,
    
    data() {
        return {
          service: '',  // Store service here
          professionals: []
        };
    },

    created() {
        this.fetchService(); // Fetch service name when component is created
    },
      
    methods: {
        fetchService() {
            fetch(`/api/service/${this.$route.params.id}`, {
                headers: {
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            .then(response => {
                if (!response.ok) throw new Error("Failed to fetch service details.");
                return response.json();
            })
            .then(data => {
                console.log(data)
                this.service = data;  // Store service name
                this.professionals=data.professionals
            })
            .catch(error => {
                console.error("Error fetching service:", error);
                alert("Failed to fetch service details.");
            });
        }

        
    
    }
};