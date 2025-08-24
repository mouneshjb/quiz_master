// when user clicks on 'Login', the user info. is stored in the localStorage, and user is redirected to /dashboard route 
// but how does BE api - '/api/home' is called from FE 
// we do by mounted life cycle, we can do adirect fetch call in the mounted, we need not create a method
// work of this dahboard is to retrieve the auth token and make a request to '/api/home', this should happen automattically, so, we use mounted hook
import SubjectCard from "../components/subject_card.js"
import CreateSubjectForm from "../components/new_subject_form.js"


export default{
   
    template: `
    <div class="p-4">
        <h2 style="text-align: center;"> Available Subjects </h2>
        <div v-if="subjects">
            <div class="row row-cols-1 row-cols-md-2 g-2" style="margin: auto;">
                <SubjectCard @delete_subject="deleteSubject" @edit_subject="editSubject" v-for="subject in subjects" :key="subject.id" :message="message" :subject="subject" :subjects="subjects" :name="subject.name" :description="subject.description" :chapters="chapters_obj[subject.id]" :subject_id="subject.id" />
                
            </div>
        </div>
        <div v-else> No subjects found </div>
        <br>
        <div style="text-align: center;">
            <button @click="isSubjectFormVisible = true" class="btn btn-primary" style="display: inline;">+Add new subject</button>
            <CreateSubjectForm @create_subject="createSubject" @close="isSubjectFormVisible = false" :message="message" :isVisible="isSubjectFormVisible" />
        </div>
    </div>
    `,
    // in the component, data has to be a function always
    data() {
        return {
          subjects: [],
          chapters_obj: {},
          isSubjectFormVisible: false,
          message: ""

        };
      },
      async mounted() {
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
    
          // Fetch chapters for each subject in parallel
          const chapterResponses = await Promise.all(
            this.subjects.map(async (subject) => {
              const chapterRes = await fetch(`/api/chapter/get/${subject.id}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  "Authentication-Token": localStorage.getItem("auth_token"),
                },
              });
    
              if (!chapterRes.ok) console.log(`Failed to fetch chapters for ${subject.id}`);
    
              return { sub_id: subject.id, data: await chapterRes.json() };
            })
          );
    
          // Assign chapter data correctly
          chapterResponses.forEach(({ sub_id, data }) => {
            this.$set(this.chapters_obj, sub_id, data); // Ensures Vue reactivity
          });
          
          console.log("Chapters:", this.chapters_obj);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
        if (!localStorage.getItem("dashboardReloaded")) {
          localStorage.setItem("dashboardReloaded", "true");
          location.reload(); // Reloads only once per session
        }
      },
   
    watch: {
        chapters_obj(newVal) {
          this.$store.commit("updateChapters", newVal); // Update Vuex state
        },
                subjects: {
                  handler(newVal) {
                    console.log("Subjects updated:", newVal);
                  },
                  deep: true, // Ensures nested objects are watched
                },
            
      },
    methods:{
      async deleteSubject(id){
        console.log("before initiating delete sub id: " + id)
        try {
            // Delete subject
            const res = await fetch(`/api/subject/delete/${id}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                "Authentication-Token": localStorage.getItem("auth_token"),
              },
              
            });
      
            if (!res.ok) throw new Error("Failed to fetch subjects");
            this.subjects = this.subjects.filter(subject => subject.id !== id);
      
      }
      catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    async createSubject(new_subject){
        try {
            const response = await fetch("/api/subject/create", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token"),
                 },
                body: JSON.stringify(new_subject)
            });
            this.message = await response.json();
            console.log( this.message)
            if (response.ok){
                try {
                    // Fetch subjects again to get Sub ID of newly created subject
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
            }
        } catch (error) {
            console.error("Error creating subject:", error);
        }

    },
    
    // async editChapter(ch_id, sub_id, name, description){
    //     // console.log("update from admin_dashboard: " + subject)
    //     // console.log("update name from admin_dashboard: " + subject.name)
    //     // console.log("update id from admin_dashboard: " + subject.id)
    //     const chapter = {
    //         id: ch_id,
    //         name: name,
    //         description: description,
    //     }
    //     try {
    //         const response = await fetch(`/api/chapter/update/${ch_id}`, {
    //             method: "PUT",
    //             headers: { 
    //                 "Content-Type": "application/json",
    //                 "Authentication-Token": localStorage.getItem("auth_token"),
    //              },
                
    //             body: JSON.stringify(chapter)
    //         });
    //         this.message = await response.json();
    //         console.log( this.message)
    //         if (response.ok) {
    //             const subjectChapters = this.chapters[sub_id]; // Get the array for the subject
            
    //             if (subjectChapters) {
    //                 const chIndex = subjectChapters.findIndex(ch => ch.id === ch_id);
            
    //                 if (chIndex !== -1) {
    //                     this.$set(subjectChapters, chIndex, { ...subjectChapters[chIndex], ...chapter });
    //                 }
    //             }
    //         }
    //     } catch (error) {
    //         console.error("Error creating subject:", error);
    //     }

    // }
},
    components: {
        SubjectCard,
        CreateSubjectForm,
      
    },
    // watch: {
    //   '$store.state.auth_token': function (newVal) {
    //     if (newVal) {
    //       location.reload(); // Refresh the page when user logs in
    //     }
    //   }
    // }
}
