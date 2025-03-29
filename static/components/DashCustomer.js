export default {
    template:`
    <div class="d-flex flex-column vh-100">
    <div class="d-flex flex-column mt-5 mb-4 pt-4" style="height: 20vh;">
        <div class="text-center  fst-italic fw-bold fs-3"> 
                Welcome, {{userData.username}}
        </div>
    </div>
    <hr class="mx-5">
    <div class="d-flex flex-grow-1">
    


    </div>
    </div>
    
    `,



    data: function(){
      return {
        userData:{}
      }
    },
    mounted(){
      fetch('/api/customer',{
          method:'GET',
          headers:{
              "Content-Type":"application/json",
              "Authentication-Token":localStorage.getItem("auth_token")
          }
      })
      .then(response => {
        if (!response.ok) {
            throw new Error("Failed to fetch user data");
        }
        return response.json();})
      .then(data=>this.userData=data)
  }

}