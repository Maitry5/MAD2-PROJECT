export default {
    template: `
    <div class="container mt-5">
      <h1 class="text-center text-decoration-underline">{{ service.name }}</h1>
  
      <div v-if="service.id" class="card mx-auto mt-3 p-4 shadow" style="max-width: 650px;">
        <div class="card-body">
          <p class="d-flex justify-content-between"><strong>Service ID</strong> <span>{{ service.id }}</span></p>
          <p class="d-flex justify-content-between"><strong>Description</strong> <span>{{ service.description }}</span></p>
          <p class="d-flex justify-content-between"><strong>Base Price</strong> <span>INR {{ service.base_price }}</span></p>
          <p class="d-flex justify-content-between"><strong>Time Required</strong> <span>{{ service.time_required }} hours</span></p>
          <p class="d-flex justify-content-between"><strong>Verified Professionals</strong> <span>{{ verifiedProfessionals }}</span></p>
          <p class="d-flex justify-content-between"><strong>Total Service Requests</strong> <span>{{ service.service_requests ? service.service_requests.length : 0 }}</span></p>
         
        </div>
      </div>
  
      <form @submit.prevent="deleteService" class="text-center mt-4">
        <button type="submit" class="btn btn-danger" onclick="return confirm('Are you sure you want to delete this service?')">
          Delete
        </button>
      </form>
    </div>
    `,
    
    data() {
      return {
        service: {},
      };
    },

    computed: {
      verifiedProfessionals() {
        return this.service.professionals
          ? this.service.professionals.filter(pro => pro.verified).length
          : 0;
      }
    },

    created() {
        this.fetchService(); // Fetch data when component is created
    },

    methods: {
        fetchService() {
            fetch(`/api/service/${this.$route.params.id}`, {
                headers: {
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            .then(response => response.json())
            .then(data => {
                this.service = data; // Correctly set the service data
            })
            .catch(error => {
                console.error("Error fetching service:", error);
                alert("Failed to fetch service details.");
            });
        },
    
        deleteService() {
            fetch(`/api/service/delete/${this.service.id}`, {
                method: "DELETE",
                headers: {
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                this.$router.push("/admin");
            })
            .catch(error => console.error("Error deleting service:", error));
        }
    }
};


  
