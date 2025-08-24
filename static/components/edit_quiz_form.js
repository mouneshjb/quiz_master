export default{
    template: `
    <div class="modal" v-if="isVisible">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2>Update Quiz Details</h2>
      <div class="row">
        <div class="col" style="height: 700px;">
            <div class="border mx-auto mt-5" style="height: 300px; width: 400px;">
                <div>
                    
                    <!-- id should be same as for. Here if it was BE, we would have given 'name' in place of 'v-model' -->
                    <!-- v-model acts the storage to store the values entered in the input -->
        
                        <div class="mb-3">
                            <label for="description" class="form-label">Description</label>
                            <input type="text" class="form-control" v-model="updated_quiz.description" id="description">
                        </div>

                        <div class="mb-3">
                            <label for="date" class="form-label">Date of Quiz</label>
                            <input type="date" class="form-control" v-model="updated_quiz.date_of_quiz" id="date">
                        </div>

                        <div class="mb-3">
                            <label for="duration" class="form-label">Duration of Quiz</label>
                            <input type="time" class="form-control" v-model="updated_quiz.time_duration" id="duration">
                        </div>

                        <div class="mb-3">
                            <label for="number_of_que" class="form-label">Number of Questions</label>
                            <input type="text" class="form-control" v-model="updated_quiz.number_of_questions" id="number_of_que">
                        </div>

                    <div style="text-align: center;">
                        <button class="btn btn-primary" @click="edit_quiz"> Save edits </button>
                        <button class="btn btn-danger" @click="closeModal"> Cancel </button>
                        <p style="color: red;">{{message}}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

      <!-- <button @click="submitTask">Submit</button> -->
    </div>
  </div>
    `,
    props: {
        isVisible: Boolean,
        quiz: Object
    },
    data () {
      return {
        updated_quiz: { ...this.quiz },
        }
      },
      watch: {
        quiz: {
          deep: true,
          handler(newQuiz) {
            this.updated_quiz = { ...newQuiz }; // Keep it reactive
          },
        },
      },

    methods: {
      closeModal() {
        this.updated_quiz.description = "";
        this.updated_quiz.date_of_quiz = "";
        this.updated_quiz.time_duration = "",
        this.updated_quiz.number_of_questions = "",
        this.$emit('close');
      },
      edit_quiz() {
        if (!this.updated_quiz.description.trim() || !this.updated_quiz.date_of_quiz ||
        !this.updated_quiz.time_duration || !this.updated_quiz.number_of_questions) {
          alert("Please fill all fields!");
        return; // Stops execution if validation fails
        }
        //   console.log("updated subject name form child:" + this.updated_sub.name)
        //     console.log("updated subject id:" + this.updated_sub.id)
        console.log("from quiz edit form: " + this.updated_quiz.id)
          this.$emit('edit_quiz', this.updated_quiz.id, this.updated_quiz.description, this.updated_quiz.date_of_quiz, this.updated_quiz.time_duration, this.updated_quiz.number_of_questions);
           
          this.closeModal();
        
      },
    },
}