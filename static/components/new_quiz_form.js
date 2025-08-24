export default{
    template: `
    <div class="modal" v-if="isVisible">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2>Add Quiz</h2>
      <div class="row">
        <div class="col" style="height: 700px;">
            <div class="border mx-auto mt-5" style="height: 300px; width: 400px;">
                <div>
                    
                    <!-- id should be same as for. Here if it was BE, we would have given 'name' in place of 'v-model' -->
                    <!-- v-model acts the storage to store the values entered in the input -->

                    <div class="mb-3">
                    <select v-model="quiz.chapter_id" name="search_by" class="form-control">
                          <option disabled selected>Select a Chapter</option> 
                          <option v-for="(chapter, index) in chapters" :key="chapter.id" :value="chapter.id">
                            {{ chapter.name }}
                          </option>
                        </select>
                    </div>

                    <div class="mb-3">
                            <label for="description" class="form-label">Description</label>
                            <input type="text" class="form-control" v-model="quiz.description" id="description">
                        </div>

                        <div class="mb-3">
                            <label for="date" class="form-label">Date of Quiz</label>
                            <input type="date" class="form-control" v-model="quiz.date_of_quiz" id="date">
                        </div>

                        <div class="mb-3">
                            <label for="duration" class="form-label">Duration of Quiz</label>
                            <input type="time" class="form-control" v-model="quiz.time_duration" id="duration">
                        </div>

                        <div class="mb-3">
                            <label for="number_of_que" class="form-label">Number of Questions</label>
                            <input type="number" class="form-control" v-model="quiz.number_of_questions" id="number_of_que">
                        </div>

                    <div style="text-align: center;">
                        <button class="btn btn-primary" @click="add_quiz"> Add Quiz </button>
                        <button class="btn btn-danger" @click="closeModal"> Cancel </button>
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
  </div>
    `,
    props: {
        isVisible: Boolean,
        chapters: Array,
        subject: Object
    },
    data () {
      return {
        quiz:{
          chapter_id: "",
          description: "",
          date_of_quiz: "",
          time_duration: "",
          number_of_questions: "",
        }
      }
    },
    methods: {
      closeModal() {
        this.quiz = {
          chapter_id: "",
          description: "",
          date_of_quiz: "",
          time_duration: "",
          number_of_questions: "",
        };
        this.$emit('close');
      },
      add_quiz() {
        console.log('reached to new_quiz form')
        if (!this.quiz.chapter_id || !this.quiz.description.trim() || !this.quiz.date_of_quiz ||
          !this.quiz.time_duration || !this.quiz.number_of_questions) {
        alert("Please fill all fields!");
        return; // Stops execution if validation fails
      }

      // Emit event to parent
      this.$emit("create_quiz", this.quiz);
        
          this.closeModal();
        }
      },
    }
