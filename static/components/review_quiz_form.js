
export default{
    template: `
    <div class="modal" v-if="isVisible">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2>Quiz Details</h2>
      <div class="row">
        <div class="col" style="height: 700px;">
            <div class="border mx-auto mt-5" style="height: 300px; width: 400px;">
                <div>
                    
                        <div class="mb-3">
                            <label for="description" class="form-label">Subject Name</label>
                            <input type="text" class="form-control" :value="$store.state.subject_for_user_quiz.name" id="description" readonly>
                        </div>
                        <div class="mb-3">
                            <label for="description" class="form-label">Chapter Name</label>
                            <input type="text" class="form-control" :value="getChapterById(quiz.chapter_id).name" id="description" readonly>
                        </div>
        
                        <div class="mb-3">
                            <label for="description" class="form-label">Description</label>
                            <input type="text" class="form-control" :value="updated_quiz.description" id="description" readonly>
                        </div>

                        <div class="mb-3">
                            <label for="date" class="form-label">Date of Quiz</label>
                            <input type="date" class="form-control" :value="updated_quiz.date_of_quiz" id="date" readonly>
                        </div>

                        <div class="mb-3">
                            <label for="duration" class="form-label">Duration of Quiz</label>
                            <input type="time" class="form-control" :value="updated_quiz.time_duration" id="duration" readonly>
                        </div>

                        <div class="mb-3">
                            <label for="number_of_que" class="form-label">Number of Questions</label>
                            <input type="text" class="form-control" :value="updated_quiz.number_of_questions" id="number_of_que" readonly>
                        </div>

                    <div style="text-align: center;">
                        
                        <button class="btn btn-primary" @click="closeModal"> Okay </button>
                      
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
        quiz: Object,
        chapters: Array,
        subject: Object,
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
      getChapterById(chapter_id) {
        return this.chapters.find(chapter => chapter.id === chapter_id);
      },
      
    }
  }
