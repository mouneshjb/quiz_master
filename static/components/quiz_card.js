import EditQuizForm from "../components/edit_quiz_form.js"
import EditQuestionForm from "../components/edit_question_form.js"
import AddQuestionForm from "../components/new_question_form.js"

export default {
    props : ['quizIndex', 'description', 'questions', 'subject', 'quizes', 'quiz', 'message', 'chapters'],
    template : `
    <div class="col">
                      <div class="card h-100" style="height: 200px; width: 600px;">

                        <div class="card-body">
                            <div class="row border" style="background-color: lightblue;">
                                <div class="col-5 my-2">
                                    <h5>Quiz {{quizIndex}} - Chapter ID: {{quiz.chapter_id}}</h5> 
                                </div>
                                <div class="col-7 border" style="text-align: right;">
                                    <button @click="openEditQuizForm(quiz)" class="btn btn-primary">Edit</button>
                                    <EditQuizForm @edit_quiz="editQuiz" @close="isEditQuizFormVisible = false" :isVisible="isEditQuizFormVisible" style="text-align: center;" :quiz="selectedQuiz" :subject="subject" :message="message" />
                                    <button @click="$emit('delete_quiz', quiz.id)" class="btn btn-danger">Delete</button>
                                </div>
                            </div>
                            <div style="width:575px; height:150px; overflow-y:auto;margin: auto;margin-bottom: 10px; text-align: center; border: 1px solid black;">
                            
                                <table cellspacing="0" cellpadding="1" border="1" width="565" style="margin: auto;">
                                  <tr style="color:white;background-color:grey;text-align: center;position: sticky;">
                                    <th>Sl. No.</th>
                                    <th>Question Title</th>
                                    <th>Actions</th>
                                    
                                </tr>
                         

                                <tr v-for="(question, index) in questions" :key="question.id">
                                
                                    <td>{{index + 1}}</td>
                                    <td>{{question.question_title}}</td>
                                    <td>
                                        <div>
                                            <button @click="openEditQuestionForm(question)"  class="btn btn-warning">Edit</button>
                                            
                                            <button @click="deleteQuestion(question.id)" class="btn btn-danger">Delete</button>
                                        </div>
                                    </td>
                                    
                                </tr>
                              
                                </table>
                                <EditQuestionForm @edit_question="editQuestion" @close="isEditQuestionFormVisible = false" style="text-align: center;" :question="selectedQuestion" :message="message" :isVisible="isEditQuestionFormVisible" />

                            </div>
                            <div style="text-align: center;">
                                <button @click="openAddQuestionForm(quiz)" class="btn btn-primary" style="display: inline;">+Add new question</button>
                                <AddQuestionForm @add_question="addQuestion" @close="isAddQuestionFormVisible = false" style="text-align: center;" :quiz="selectedQuiz" :message="message" :isVisible="isAddQuestionFormVisible" />
                            </div>
                           
                        </div>
                      </div>
                </div>
    `,
    // data() {
    //     return {
    //         isEditSubjectFormVisible: false,
    //         isEditChapterFormVisible: false,
    //         sub_id: this.subject.id,
    //         // selectedChapter: "",
    //         chapter_id: this.chapter.id
    //     };
    //   },
    data() {
        return {
            isEditQuizFormVisible: false, 
            isEditQuestionFormVisible: false,
            isAddQuestionFormVisible: false,
            selectedQuestion: null, // This will store the chapter being edited
            selectedQuiz: null, // This will store the subject being passed for adding a chapter
            quiz_id: null,  // Initialize without using this.subject.id
            question_id: null, // Initialize without using this.chapter.id
            selectedQuestions: { ...this.questions },
            passed_chapters: [ ...this.chapters ],
        };
    },
    created() {
   
        if (this.quiz) {
            this.quiz_id = this.quiz.id;
        }
        if (this.question) {
            this.question_id = this.question.id;
        }
    },
      
      mounted(){
    
      },
      methods: {
        openEditQuizForm(quiz) {
            console.log("before opening the edit form quiz card: " + quiz.id)
            this.selectedQuiz = { ...quiz }; // Make a copy to avoid direct mutation

            this.isEditQuizFormVisible = true;
        },

        // edit_quiz(description, date_of_quiz, time_duration, no_of_questions){
        //     // console.log("updated sub from sub card: " + this.sub_id)
        //     // console.log("updated subject id from sub card: " + this.subject.id)
        //     // console.log("updated sub from sub card: " + this.subject.name)
        //     this.$emit('edit_quiz', this.quiz_id, description, date_of_quiz, time_duration, no_of_questions);
        // },
        async editQuiz(id, description, date_of_quiz, time_duration, number_of_questions){
            // console.log("update from admin_dashboard: " + subject)
            // console.log("update name from admin_dashboard: " + subject.name)
            // console.log("update id from admin_dashboard: " + subject.id)
            const quiz = {
                id: this.quiz_id,
                description: description,
                date_of_quiz: date_of_quiz,
                time_duration: time_duration,
                number_of_questions: number_of_questions
            }
            try {
                const response = await fetch(`/api/quiz/update/${id}`, {
                    method: "PUT",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authentication-Token": localStorage.getItem("auth_token"),
                     },
                    
                    body: JSON.stringify(quiz)
                });
                this.message = await response.json();
                console.log( this.message)
                if (response.ok) {
                    const quizjIndex = this.quizes.findIndex(quiz => quiz.id === id);
                    
                    if (quizjIndex !== -1) {
                        this.$set(this.quizes, quizjIndex, { ...this.quizes[quizjIndex], ...quiz });
                    }
                }
            } catch (error) {
                console.error("Error creating quiz:", error);
            }
    
        },
        // edit_chapter(ch_id, name, description){
        //     // console.log("updated sub from sub card: " + this.sub_id)
        //     // console.log("updated subject id from sub card: " + this.subject.id)
        //     console.log("updated ch sub_id from sub card: " + this.subject.id)
        //     this.$emit('edit_chapter',ch_id, this.subject.id, name, description);
        // },
        openEditQuestionForm(question) {
            this.selectedQuestion = { ...question }; // Make a copy to avoid direct mutation
            this.isEditQuestionFormVisible = true;
        },

        async editQuestion(question_id, question_title, question_statement, option1, option2, option3, option4, answer){
            // console.log("update from admin_dashboard: " + subject)
            // console.log("update name from admin_dashboard: " + subject.name)
            console.log("update id from quiz card before sending quation to backend: ", option1, option2, option3, option4)
            const question = {
                
                question_title: question_title,
                question_statement: question_statement,
                option1: option1,
                option2: option2,
                option3: option3,
                option4: option4,
                answer: answer,
            }
            try {
                const response = await fetch(`/api/question/update/${question_id}`, {
                    method: "PUT",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authentication-Token": localStorage.getItem("auth_token"),
                     },
                    
                    body: JSON.stringify(question)
                });
                this.message = await response.json();
                console.log( this.message)
                if (response.ok) {
                
                        const queIndex = this.questions.findIndex(que => que.id === question_id);
                
                        if (queIndex !== -1) {
                            this.$set(this.questions, queIndex, { ...this.questions[queIndex], ...question });
                        }
                    
                }
            } catch (error) {
                console.error("Error creating quiz:", error);
            }
    
        },
        openAddQuestionForm(quiz){
            this.selectedQuiz = { ...quiz }; // Make a copy to avoid direct mutation
            this.isAddQuestionFormVisible = true;
            this.$store.commit("updateQuizId", quiz.id);
        },
        async addQuestion(new_question){
            // console.log("update from admin_dashboard: " + subject)
            // console.log("update name from admin_dashboard: " + subject.name)
            // console.log("update id from admin_dashboard: " + subject.id)
            new_question.quiz_id =  this.$store.state.quiz_id
            console.log(new_question.quiz_id)
            try {
                const response = await fetch(`/api/question/create/${new_question.quiz_id}`, {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authentication-Token": localStorage.getItem("auth_token"),
                     },
                    
                    body: JSON.stringify(new_question)
                });
                this.message = await response.json();
            console.log(this.message)
            if (response.ok){
                try {
                    // Fetch questions to get newly created question
                    const res = await fetch(`/api/question/get/${new_question.quiz_id}`, {
                      method: "GET",
                      headers: {
                        "Content-Type": "application/json",
                        "Authentication-Token": localStorage.getItem("auth_token"),
                      },
                    });
              
                    if (!res.ok) throw new Error("Failed to fetch subjects");
              
                    this.questions = await res.json();
                    console.log("Question:", this.questions);
                } catch (error) {
                    console.error("Error fetching data:", error);
                  }
            }
        } catch (error) {
            console.error("Error creating quiz:", error);
        }
    
        },
        async deleteQuestion(id){
            this.questions = this.questions.filter(question => question.id !== id);
            try {
                // Delete subject
                const res = await fetch(`/api/question/delete/${id}`, {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token"),
                  },
                });
          
                if (!res.ok) throw new Error("Failed to fetch questions");
          
          }
          catch (error) {
            console.error("Error fetching data:", error);
          }
        },
    },
    computed: {
        // formattedDate(){
        //     return new Date(this.date).toLocaleString();
        // }
    },
    components: {
        EditQuizForm,
        EditQuestionForm,
        AddQuestionForm,
    }
}