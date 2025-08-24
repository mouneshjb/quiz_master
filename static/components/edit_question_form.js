export default{
    template: `
    <div class="modal" v-if="isVisible">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2>Update Question Details</h2>
      <div class="row">
        <div class="col" style="height: 700px;">
            <div class="border mx-auto mt-5" style="height: 300px; width: 400px;">
                <div>
                    
              
        
                    <div class="mb-3">
                            <label for="title" class="form-label">Question Title</label>
                            <input type="text" class="form-control" v-model="updated_question.question_title" id="title">
                        </div>
                        <div class="mb-3">
                            <label for="statement" class="form-label">Question Statement</label>
                            <input type="text" class="form-control" v-model="updated_question.question_statement" id="statement">
                        </div>
                        <div class="mb-3">
                            <label for="option1" class="form-label">Option 1</label>
                            <input type="text" class="form-control" v-model="updated_question.option1" id="option1">
                        </div>
                        <div class="mb-3">
                            <label for="option2" class="form-label">Option 2</label>
                            <input type="text" class="form-control" v-model="updated_question.option2" id="option2">
                        </div>
                        <div class="mb-3">
                            <label for="option3" class="form-label">Option 3</label>
                            <input type="text" class="form-control" v-model="updated_question.option3" id="option3">
                        </div>
                        <div class="mb-3">
                            <label for="option4" class="form-label">Option 4</label>
                            <input type="text" class="form-control" v-model="updated_question.option4" id="option4">
                        </div>
                        <div class="mb-3">
                            <label for="answer" class="form-label">Answer</label>
                            <input type="text" class="form-control" v-model="updated_question.answer" id="answer">
                        </div>

                    <div style="text-align: center;">
                        <button class="btn btn-primary" @click="edit_question"> Save edits </button>
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
        question: Object, // Receive the chapter object
        isVisible: Boolean
    },
    data () {
      return {
        updated_question: { ...this.question },
        // updated_ch: {
        //     name: "",
        //     description: "",
        //     // id: this.chapter.id,
        //     // sub_id: this.chapter.subject_id
        // },
        
        }
      },
    watch: {
        question: {
          deep: true,
          handler(newQuestion) {
            this.updated_question = { ...newQuestion }; // Keep it reactive
          },
        },
      },

    methods: {
      closeModal() {
        this.updated_question.question_title = "";
        this.updated_question.question_statement = "";
        this.updated_question.option1 = "";
        this.updated_question.option2 = "";
        this.updated_question.option3 = "";
        this.updated_question.option4 = "";
        this.updated_question.answer = "";
        this.$emit('close');
      },
      edit_question() {
        if (this.updated_question.question_title.trim() !== '' && this.updated_question.question_statement.trim() !== '' &&
        this.updated_question.option1.trim() !== '' &&
        this.updated_question.option2.trim() !== '' &&
        this.updated_question.option3.trim() !== '' &&
        this.updated_question.option4.trim() !== '' &&
        this.updated_question.answer.trim() !== '') {
        //   console.log("updated chapter name form child:" + this.updated_ch.name)
        //     // console.log("updated subject id:" + this.updated_ch.id)
        //     console.log("updated chapter id:" + this.chapter.id)
        //     console.log("updated chapter sub id:" + this.chapter.subject_id)
            this.$emit('edit_question', this.updated_question.id, this.updated_question.question_title, this.updated_question.question_statement, 
              this.updated_question.option1,
              this.updated_question.option2,
              this.updated_question.option3,
              this.updated_question.option4,
              this.updated_question.answer);

          this.closeModal();
        }
      },
    },
    // watch: {
    //     chapter: {
    //       deep: true,
    //       handler(newChapter) {
    //         this.localChapter = { ...newChapter };
    //       },
    //     },
    //   },
}