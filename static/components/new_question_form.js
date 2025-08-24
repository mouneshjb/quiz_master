export default{
    template: `
    <div class="modal" v-if="isVisible">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2>Add Question</h2>
      <div class="row">
        <div class="col" style="height: 700px;">
            <div class="border mx-auto mt-5" style="height: 300px; width: 400px;">
                <div>
                    
                    <!-- id should be same as for. Here if it was BE, we would have given 'name' in place of 'v-model' -->
                    <!-- v-model acts the storage to store the values entered in the input -->
        
                    <div class="mb-3">
                            <label for="title" class="form-label">Question Title</label>
                            <input type="text" class="form-control" v-model="question.question_title" id="title">
                        </div>
                        <div class="mb-3">
                            <label for="statement" class="form-label">Question Statement</label>
                            <input type="text" class="form-control" v-model="question.question_statement" id="statement">
                        </div>
                        <div class="mb-3">
                            <label for="option1" class="form-label">Option 1</label>
                            <input type="text" class="form-control" v-model="question.option1" id="option1">
                        </div>
                        <div class="mb-3">
                            <label for="option2" class="form-label">Option 2</label>
                            <input type="text" class="form-control" v-model="question.option2" id="option2">
                        </div>
                        <div class="mb-3">
                            <label for="option3" class="form-label">Option 3</label>
                            <input type="text" class="form-control" v-model="question.option3" id="option3">
                        </div>
                        <div class="mb-3">
                            <label for="option4" class="form-label">Option 4</label>
                            <input type="text" class="form-control" v-model="question.option4" id="option4">
                        </div>
                        <div class="mb-3">
                            <label for="answer" class="form-label">Answer</label>
                            <input type="text" class="form-control" v-model="question.answer" id="answer">
                        </div>

                    <div style="text-align: center;">
                        <button class="btn btn-primary" @click="add_question"> Add Question </button>
                        <button class="btn btn-danger" @click="closeModal"> Cancel </button>
                        <p style="color: red;">{{message}}</p>
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
        quiz: Object
    },
    data () {
      return {
        question:{
          question_title: "",
          question_statement: "",
          option1: "",
          option2: "",
          option3: "",
          option4: "",
          answer: "",
        }
      }
    },
    methods: {
      closeModal() {
        this.question = {
          question_title: "",
          question_statement: "",
          option1: "",
          option2: "",
          option3: "",
          option4: "",
          answer: "",
        };
        this.$emit('close');
      },
      add_question() {
        if (this.question.question_title.trim() !== '' && this.question.question_statement.trim() !== '' &&
        this.question.option1.trim() !== '' &&
        this.question.option2.trim() !== '' &&
        this.question.option3.trim() !== '' &&
        this.question.option4.trim() !== '' &&
        this.question.answer.trim() !== '') {
          this.$emit('add_question', this.question);
          
          this.closeModal();
        }
      },
    },
}