// when user clicks on 'Login', the user info. is stored in the localStorage, and user is redirected to /dashboard route 
// but how does BE api - '/api/home' is called from FE 
// we do by mounted life cycle, we can do adirect fetch call in the mounted, we need not create a method
// work of this dahboard is to retrieve the auth token and make a request to '/api/home', this should happen automattically, so, we use mounted hook
export default{
    template: `
    <div>
        <div style="text-align: center;">
            <p style="margin: auto ;"><h4>Below are current available subjects</h4> </p>
        </div>
            <div class="row row-cols-1 row-cols-md-4 g-4" style="margin: auto;">
                <div class="col" v-for="subject in subjects">
                    <div class="card h-100" style="height: 200px;">
                        <div class="card-body">
                        <router-link :to="{ path: '/user/quiz', query: subject }"><h5 class="card-title">{{subject.name}}</h5></router-link>
                        <p class="card-text">Click on the {{subject.name}} subject to view/attempt the quizes</p>
                        </div>
                    </div>
                </div>
            </div>
    </div>
    `,
    // in the component, data has to be a function always
    data: function(){
        return {
            subjects: [],
            quizes_obj: {},
        }
    },
    async mounted() {
        // Fetch users and subjects when this component loads
            
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
      
            // Fetch quiz for each subject in parallel
            const quizResponses = await Promise.all(
              this.subjects.map(async (subject) => {
                const quizRes = await fetch(`/api/quiz/get/sub/${subject.id}`, {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token"),
                  },
                });
      
                if (!quizRes.ok) console.log(`Failed to fetch chapters for ${subject.id}`);
      
                return { sub_id: subject.id, data: await quizRes.json() };
              })
            );
      
            // Assign quiz data correctly
            quizResponses.forEach(({ sub_id, data }) => {
              this.$set(this.quizes_obj, sub_id, data); // Ensures Vue reactivity
            });
            
            console.log("Quizes:", this.quizes_obj);
            this.$store.commit('updateQuizesObj',this.quizes_obj)
          } catch (error) {
            console.error("Error fetching data:", error);
          }
          if (!localStorage.getItem("dashboardReloaded")) {
            localStorage.setItem("dashboardReloaded", "true");
            location.reload(); // Reloads only once per session
          }
        }

}
