import SubjectCard from "../components/subject_card.js"


export default{
    template: `
    <div>
    <h4> Results for {{searchQuery}} under {{searchCategory}}...</h4>
        <div v-if="filteredResults">
            <div v-if="searchCategory === 'user'" style="width:1200px; height:500px; overflow-y:auto;margin: auto;margin-bottom: 10px; text-align: center; border: 1px solid black;">
                            
                <table cellspacing="0" cellpadding="1" border="1" width="1180" style="margin: auto;">
                    <tr style="color:white;background-color:grey;text-align: center;position: sticky;">
                        <th>Sl No.</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>User ID</th>
                        <th>Qualification</th>
                        <th>Date of Birth</th>
                        <th>Date of signup</th>
                        
                    </tr>
                    
                    <tr v-for="(user, index) in filteredResults" :key="user.id">
                        <td>{{index+1}}</td>
                        <td>{{user.name}}</td>
                        <td>{{user.email}}</td>
                        <td>{{user.id}}</td>
                        <td>{{user.qualification}}</td>
                        <td>{{user.dob}}</td>
                        <td>{{user.date_of_signup}}</td>
                    </tr>
                
                </table>  
                            
            </div>
            
            
                <div v-else>
                    
                        <div class="row row-cols-1 row-cols-md-2 g-2" style="margin: auto;">
                            <SubjectCard @delete_subject="deleteSubject" @edit_subject="editSubject" v-for="subject in filteredResults" :key="subject.id" :subject="subject" :name="subject.name" :description="subject.description" :chapters="chapters[subject.id]" :subject_id="subject.id" />
                            
                        </div>
                </div>
        </div>
        <div v-else> No results found </div>
    <div>


    </div>`,
    // in the component, data has to be a function always
    
    computed: {
        ...Vuex.mapState(["searchQuery", "searchCategory", "chapters"]),
        filteredResults() {
          const dataset = this.$store.state.searchCategory === "user" ? this.users : this.subjects;
          console.log("Search Query:", this.$store.state.searchQuery);
          console.log("Search Category:", this.$store.state.searchCategory);
          return dataset.filter(item => item.name.toLowerCase().includes(this.$store.state.searchQuery.toLowerCase()));
        },

      },
      data() {
        return {
          users: [],       // Fetch from API
          subjects: []     // Fetch from API
        };
      },
      async mounted() {
        // Fetch users and subjects when this component loads
        try {
            // Fetch subjects
            const res = await fetch("/api/user/get", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "Authentication-Token": localStorage.getItem("auth_token"),
              },
            });
      
            if (!res.ok) throw new Error("Failed to fetch users");
      
            this.users = await res.json();
            console.log("users:", this.users);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        
        
        try {
            // Fetch subjects
            const res = await fetch("/api/subject/get", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "Authentication-Token": localStorage.getItem("auth_token"),
              },
            });
      
            if (!res.ok) throw new Error("Failed to fetch subjects");
      
            this.subjects = await res.json();
            console.log("Subjects:", this.subjects);
        } catch (error) {
            console.error("Error fetching data:", error);
          }

      },
      components: {
        SubjectCard,
      
    },
}