export default{
    template: `

<div>
<!-- Admin View -->
<div v-if="$store.state.loggedIn && $store.state.role === 'admin'">
<nav class="navbar navbar-expand-lg navbar-light" style="background-color:lightgrey">
        <div class="container-fluid">
          <div class="collapse navbar-collapse" id="navbarText">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                    <router-link :to="{ path:'/admin_dashboard'}"><button class="btn btn-primary">Home</button></router-link>
                </li>
                <li class="nav-item" style="border: 1px;margin-left: 5px; margin-right: 5px;">
                  
                   <div style="border: 1px; align-items: center;display: inline;">
                    
                        <div class="mb-3" style="display: inline;">
                            <select v-model="searchCategory" class="form-control" style="display: inline-block; width: 120px;">
                                <option value="" disabled selected>Search By</option>
                                <option value="user">User</option>
                                <option value="subject">Subject</option>
                            </select>
                        </div>
                        <input type="text" class="form-control" v-model="searchQuery" placeholder="Search Text" style="display: inline-block; width: 120px;">
                        <button @click="performSearch" style="height: 35px;">Search</button>
                    
                </div>
                
                </li>
                
                <li class="nav-item">
                    <router-link :to="{ path:'/admin/summary'}"><button class="btn btn-primary">Summary</button></router-link>
                </li>
                <li class="nav-item">
                    <button class="btn btn-danger" v-if="$store.state.loggedIn" @click="logOut">Logout</button>
                </li>
            </ul>
            
            <button @click="csvExport" class="btn btn-success">Download Scores</button>
            
            <span class="navbar-text">
              Welcome to Admin: {{$store.state.name}}
            </span>
          </div>
        </div>
      </nav>
</div>



<!-- User View -->

<div class="row border" style="background-color: lightblue;" v-else-if="$store.state.loggedIn && $store.state.role === 'user'">
    <nav class="navbar navbar-expand-lg navbar-light" style="background-color:lightskyblue">
            <div class="container-fluid">
                <div class="collapse navbar-collapse" id="navbarText">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                    <router-link :to="{ path:'/user_dashboard'}"><button class="btn btn-primary">Home</button></router-link>
                </li>
                <li class="nav-item" style="border: 1px;margin-left: 5px; margin-right: 5px;">
                    
                   <div style="border: 1px; align-items: center;display: inline;">
                    
                        <div class="mb-3" style="display: inline;">
                            <select v-model="searchCategory" class="form-control" style="display: inline-block; width: 120px;">
                                <option value="" disabled selected>Search By</option>
                                <option value="subject">Subject</option>
                                <option value="date">Date</option>
                            </select>
                        </div>
                        <input type="text" class="form-control" v-model="searchQuery" placeholder="Search Text" style="display: inline-block; width: 120px;">
                        <button @click="performSearch" style="height: 35px;">Search</button>
                    
                </div>
                
                </li>
                
                <li class="nav-item">
                    <router-link :to="{ path:'/user/score'}"><button class="btn btn-primary">Scores</button></router-link>
                </li>
                <li class="nav-item">
                    <router-link :to="{ path:'/user/summary'}"><button class="btn btn-secondary">Summary</button></router-link>
                </li>
                <li class="nav-item">
                    <button class="btn btn-danger" v-if="$store.state.loggedIn" @click="logOut">Logout</button>
                </li>
                </ul>
                
                <span class="navbar-text">
                    Welcome to Customer: {{$store.state.name}}
                </span>
                </div>
            </div>
        </nav>
</div>

<!-- Guest (Not Logged In) View -->
    <div class="row" style="background-color:rgb(207, 172, 231);" v-else>
        <div class="col-10 my-2">
            <h3>Welocome to Quiz Master!</h3>
        </div>
        <div class="col-2">
            <router-link to="/login" class="btn btn-primary my-2">Login</router-link>
            <router-link to="/register" class="btn btn-warning my-2">Register</router-link>
        </div>
    </div>
</div>
    `,
    data() {
        return {
          searchCategory: "", // Local data for search category
          searchQuery: "" // Local data for search query
        };
      },
      watch: {
        searchCategory(newVal) {
          this.$store.commit("updateSearchCategory", newVal); // Update Vuex state
        },
        searchQuery(newVal) {
          this.$store.commit("updateSearchQuery", newVal); // Update Vuex state
        }
      },
      methods: {
        performSearch() {
          if (!this.searchCategory || !this.searchQuery.trim()) {
            alert("Please select a category and enter a search query.");
            return;
          }
          if (this.$store.state.role === 'admin')
          this.$router.push({ path: "/admin/search" }); // Navigate to results
          else{
          this.$router.push({ path: "/user/search" });
          }
        },
        logOut(){
          this.$store.commit('logout');
          this.$router.push('/login')
        },
        async csvExport(){
          try {
            // Fetch subjects again to get Sub ID of newly created subject
            const res = await fetch("/api/csv_report", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "Authentication-Token": localStorage.getItem("auth_token"),
              },
            });
      
            if (!res.ok) throw new Error("Failed to initiate task");
      
            const task_output = await res.json();
            console.log("task_output:", task_output);
        //     try{
        //       const task_res = await fetch(`/api/csv_report_result/${task_output.id}`, {
        //         method: "GET",
        //         headers: {
        //           "Content-Type": "application/json",
        //           "Authentication-Token": localStorage.getItem("auth_token"),
        //         },
        //       });
        
        //       if (!task_res.ok) throw new Error("Failed to get task result");
        
        //       const task_result_output = await res.json();
        //       console.log("task_output:", task_result_output);
        //     }
        //     catch (error) {
        //       console.error("Error fetching data:", error);
        //     }

        window.location.href = `/api/csv_report_result/${task_output.id}`
        } catch (error) {
            console.error("Error fetching data:", error);
          }
        },
      }

}