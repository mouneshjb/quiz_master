import QuizCard from "../components/quiz_card.js"
import CreateQuizForm from "../components/new_quiz_form.js"


export default{
    template: `
    <div class="p-4">
        <h2 style="text-align: center;"> Available Quizes for {{subject.name}} </h2>
        <div v-if="quizes">
            <div class="row row-cols-1 row-cols-md-2 g-2" style="margin: auto;">
                <QuizCard @delete_quiz="deleteQuiz" v-for="(quiz, index) in quizes" :key="quiz.id" :quizIndex="index + 1" :message="message" :quiz="quiz" :description="quiz.description" :questions="questions_obj[quiz.id]" :quiz_id="quiz.id" :quizes=quizes :subject="subject" :chapters="chapters" />
                
            </div>
        </div>
        <div v-else> No quiz found </div>
        <br>
        <div style="text-align: center;">
            <button @click="isQuizFormVisible = true" class="btn btn-primary" style="display: inline;">+Add new quiz</button>
            <CreateQuizForm @create_quiz="createQuiz" @close="isQuizFormVisible = false" :message="message" :subject="subject" :isVisible="isQuizFormVisible" :chapters="chapters" />
        </div>
    </div>
    `,
    // in the component, data has to be a function always
    data() {
        return {
        subject: this.$route.query,
        chapters: [],
        quizes: [],
        questions_obj: {},
        isQuizFormVisible: false,
        message: ""
        };
      },
      async mounted() {
        try {
          // Fetch quizes
          const res = await fetch(`/api/quiz/get/sub/${this.subject.id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authentication-Token": localStorage.getItem("auth_token"),
            },
          });
    
          if (!res.ok) throw new Error("Failed to fetch quizes");
    
          this.quizes = await res.json();
          console.log("Quizes:", this.quizes);
    
          // Fetch questions for each quiz in parallel
          const questionResponses = await Promise.all(
            this.quizes.map(async (quiz) => {
              const questionRes = await fetch(`/api/question/get/${quiz.id}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  "Authentication-Token": localStorage.getItem("auth_token"),
                },
              });
    
              if (!questionRes.ok) console.log(`Failed to fetch questions for ${quiz.id}`);
    
              return { quiz_id: quiz.id, data: await questionRes.json() };
            })
          );
    
          // Assign chapter data correctly
          questionResponses.forEach(({ quiz_id, data }) => {
            this.$set(this.questions_obj, quiz_id, data); // Ensures Vue reactivity
          });
    
          console.log("Questions:", this.questions_obj);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
        
        // Fetch chapters

        try {
            
            const res = await fetch(`/api/chapter/get/${this.subject.id}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "Authentication-Token": localStorage.getItem("auth_token"),
              },
            });
      
            if (!res.ok) throw new Error("Failed to fetch subjects");

            this.chapters = await res.json();
            console.log("Chapters:", this.chapters);}

            catch (error) {
                console.error("Error fetching data:", error);

      }
    },

      methods:{
        async deleteQuiz(id){
          
          try {
              // Delete quiz
              const res = await fetch(`/api/quiz/delete/${id}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  "Authentication-Token": localStorage.getItem("auth_token"),
                },
              });
              
              if (!res.ok) throw new Error("Failed to fetch quizes");
              this.quizes = this.quizes.filter(quiz => quiz.id !== id);
        }
        catch (error) {
          console.error("Error fetching data:", error);
        }
      },
      async createQuiz(new_quiz){
          try {
            new_quiz.subject_id = this.subject.id
            console.log(new_quiz)
            const response = await fetch(`/api/quiz/create/${new_quiz.chapter_id}`, {
                  method: "POST",
                  headers: { 
                      "Content-Type": "application/json",
                      "Authentication-Token": localStorage.getItem("auth_token"),
                   },
                  body: JSON.stringify(new_quiz)
              });
              this.message = await response.json();
              console.log( this.message)
              if (response.ok){
                try {
                    // Fetch quizes again to get Sub ID of newly created quiz
                    const res = await fetch(`/api/quiz/get/sub/${this.subject.id}`, {
                        method: "GET",
                        headers: {
                          "Content-Type": "application/json",
                          "Authentication-Token": localStorage.getItem("auth_token"),
                        },
                      });
                
                      if (!res.ok) throw new Error("Failed to fetch quizes");
                
                      this.quizes = await res.json();
                      console.log("Quizes:", this.quizes);
                } catch (error) {
                    console.error("Error fetching data:", error);
                  }
              }
          } catch (error) {
              console.error("Error creating quiz:", error);
          }
  
      },
      
},
      components: {
        QuizCard,
        CreateQuizForm,
      
    }
}