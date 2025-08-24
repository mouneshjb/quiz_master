import ReviewQuizForm from "../components/review_quiz_form.js"

export default{
    template: `
    <div>
        <h2 style="text-align: center;"> Available quiz under {{subject.name}} </h2>
            <div style="width:1200px; height:500px; overflow-y:auto;margin: auto;margin-bottom: 10px; text-align: center; border: 1px solid black;">
                            
                <table cellspacing="0" cellpadding="1" border="1" width="1180" style="margin: auto;">
                    <tr style="color:white;background-color:grey;text-align: center;position: sticky;">
                        <th>Sl No.</th>
                        <th>Date of Quiz</th>
                        <th>Number of Questions</th>
                        <th>Quiz Description</th>
                        <th>Time Duration (HH:MM)</th>
                        <th>Action</th>
                       
                        
                    </tr>
                    
                    <tr v-for="(quiz, index) in quizes_obj[subject.id]" :key="quiz.id">
                        <td>{{index+1}}</td>
                        <td>{{quiz.date_of_quiz}}</td>
                        <td>{{quiz.number_of_questions}}</td>
                        <td>{{quiz.description}}</td>
                        <td>{{quiz.time_duration}}</td>
                        <td>
                            <div>
                                <button style="width: 70px" @click="selectedQuiz = { ...quiz }; isReviewQuizFormVisible = true;"  class="btn btn-warning">Review</button>
                                
                                <button style="width: 70px" v-if="new Date(quiz.date_of_quiz + 'T23:59:59') < new Date()" class="btn btn-danger" disabled>Expired</button>
                                <button style="width: 70px" v-else @click="openQuiz(quiz)" class="btn btn-success">Start</button>
                            </div>
                        </td>
                     
                    </tr>
                
                </table>  
                  <ReviewQuizForm @close="isReviewQuizFormVisible = false" style="text-align: center;" :chapters="chapters" :subject="subject" :quiz="selectedQuiz" :isVisible="isReviewQuizFormVisible" />          
            </div>

    </div>
    `,
    // in the component, data has to be a function always
    
    computed: {
        ...Vuex.mapState(["quizes_obj","subject_for_user_quiz"]),
        

      },
      data() {
        return {
            
            isReviewQuizFormVisible: false, 
            selectedQuiz: null,
            chapters: [],
            subject: this.$route.query,
            subject_id: localStorage.getItem("subject_id_for_user_quiz")
        };
      },
      async mounted() {
        
         // Fetch chapters
        
         const sub = this.$route.query
         localStorage.setItem("subject_for_user_quiz", sub);
         this.$store.commit('updateSubjectforUserQuiz', sub);
         const temp = this.$store.state.subject_for_user_quiz
         console.log("from mouting: " + temp.name)

         try {
            
            const res = await fetch(`/api/chapter/get/${sub.id}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "Authentication-Token": localStorage.getItem("auth_token"),
              },
            });
      
            if (!res.ok) throw new Error("Failed to fetch chapters");

            this.chapters = await res.json();
            console.log("Chapters:", this.chapters);}

            catch (error) {
                console.error("Error fetching data:", error);

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
       
      components: {
        ReviewQuizForm,
    },
}