// user search component

import ReviewQuizForm from "../components/review_quiz_form.js"


export default{
    template: `
    <div>
    <h4> Results for {{searchQuery}} under {{searchCategory}}...</h4>
    <div v-if="filteredResults">
        <div v-if="searchCategory === 'date'" style="width:1200px; height:500px; overflow-y:auto;margin: auto;margin-bottom: 10px; text-align: center; border: 1px solid black;">
                        
            <table cellspacing="0" cellpadding="1" border="1" width="1180" style="margin: auto;">
                <tr style="color:white;background-color:grey;text-align: center;position: sticky;">
                    <th>Sl No.</th>
                    <th>Date of Quiz</th>
                    <th>Number of Questions</th>
                    <th>Quiz ID</th>
                    <th>Time Duration (HH:MM)</th>
                    <th>Action</th>
                   
                    
                </tr>
                
                <tr v-for="(quiz, index) in filteredResults" :key="quiz.id">
                    <td>{{index+1}}</td>
                    <td>{{quiz.date_of_quiz}}</td>
                    <td>{{quiz.number_of_questions}}</td>
                    <td>{{quiz.description}}</td>
                    <td>{{quiz.time_duration}}</td>
                    <td>
                        <div>
                            <button @click="selectedQuiz = { ...quiz }; isReviewQuizFormVisible = true; subject = subjects.find(subject => subject.id === quiz.subject_id);"  class="btn btn-warning">Review</button>
                            
                            <button style="width: 70px" v-if="new Date(quiz.date_of_quiz + 'T23:59:59') < new Date()" class="btn btn-danger" disabled>Expired</button>
                            <button style="width: 70px" v-else @click="openQuiz(quiz)" class="btn btn-success">Start</button>
                        </div>
                    </td>
                 
                </tr>
            
            </table>  
              <ReviewQuizForm @close="isReviewQuizFormVisible = false" style="text-align: center;" :chapters="chapters" :subject="subject" :quiz="selectedQuiz" :isVisible="isReviewQuizFormVisible" />
                        
        </div>
        
        
            <div v-else>
                
                    <div style="text-align: center;">
                        <p style="margin: auto ;"><h4>Below are current available subjects</h4> </p>
                    </div>
                    <div class="row row-cols-1 row-cols-md-4 g-4" style="margin: auto;">
                        <div class="col" v-for="subject in filteredResults">
                            <div class="card h-100" style="height: 200px;">
                        <div class="card-body">
                            <router-link :to="{ path: '/user/quiz', query: subject }"><h5 class="card-title">{{subject.name}}</h5></router-link>
                        <p class="card-text">Click on the {{subject.name}} subject to view/attempt the quizes</p>
                    </div>
                </div>
            </div>
        </div>
            </div>
    </div>
    <div v-else> No results found </div>
</div>
    `,
    // in the component, data has to be a function always
    
    computed: {
        ...Vuex.mapState(["searchQuery", "searchCategory"]),
        filteredResults() {
          const quizes = this.quizes_obj ? Object.values(this.quizes_obj).flat() : [];
          const dataset = this.$store.state.searchCategory === "date" ? quizes : this.subjects;
        //   console.log("Search Query:", this.$store.state.searchQuery);
        //   console.log("Search Category:", this.$store.state.searchCategory);
        //   console.log("quizes", quizes);
        if (this.$store.state.searchCategory === 'subject') {
            return dataset.filter(item => item.name?.toLowerCase().includes(this.$store.state.searchQuery.toLowerCase()));
        } 
        else { 
            return dataset.filter(item => item.date_of_quiz?.includes(this.$store.state.searchQuery)); 
        }
    },

      },
      data() {
        return {
            isReviewQuizFormVisible: false,
            selectedQuiz: null,
            quizes_obj: this.$store.state.quizes_obj, 
          subjects: [],    // Fetch from API
          chapters_obj: {},
          chapters: [],
          subject: ""
        };
      },

    watch: {
        subject(newVal, oldVal) {
            console.log("Value changed from", oldVal, "to", newVal);
            this.$store.commit('updateSubjectforUserQuiz', newVal);
        }
        },
    
      methods: {
        openQuiz(quiz){
            if (new Date(quiz.date_of_quiz + "T23:59:59") >= new Date()){
            this.$store.commit('updateCurrentQuiz', quiz);
            this.$router.push('/user/quiz_page/' + quiz.id);
            }
            else {
                alert("Sorry, the quiz has expired!")
            }
        }
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
            
            this.chapters = Object.values(this.chapters_obj).flat();
  
            console.log("Chapters:", this.chapters_obj);
          } catch (error) {
            console.error("Error fetching data:", error);
          }

      },
      components: {
        ReviewQuizForm,
      
    },
}