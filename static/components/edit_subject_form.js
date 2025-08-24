export default{
    template: `
    <div class="modal" v-if="isVisible">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2>Update Subject Details</h2>
      <div class="row">
        <div class="col" style="height: 700px;">
            <div class="border mx-auto mt-5" style="height: 300px; width: 400px;">
                <div>
                    
                    <!-- id should be same as for. Here if it was BE, we would have given 'name' in place of 'v-model' -->
                    <!-- v-model acts the storage to store the values entered in the input -->
        
                    <div class="mb-3">
                            <label for="name" class="form-label">Name</label>
                            <input type="text" class="form-control" v-model="subject.name" id="name">
                        </div>
                        <div class="mb-3">
                            <label for="description" class="form-label">Description</label>
                            <input type="text" class="form-control" v-model="subject.description" id="description">
                        </div>
                    <div style="text-align: center;">
                        <button class="btn btn-primary" @click="edit_subject"> Save edits </button>
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
        subject: Object
    },
    data () {
        return {
            updated_sub: { ...this.subject },
            }
      },
      watch: {
        subjet: {
          deep: true,
          handler(newSubject) {
            this.updated_sub = { ...newSubject }; // Keep it reactive
          },
        },
      },

    methods: {
      closeModal() {
        this.updated_sub.name = "";
        this.updated_sub.description = "";
        this.$emit('close');
      },
      edit_subject() {
        if (this.subject.name.trim() !== '' && this.subject.description.trim() !== '') {
        //   console.log("updated subject name form child:" + this.updated_sub.name)
            console.log("updated subject id from the form:" + this.subject.id)
            this.$emit('edit_subject', this.subject.id, this.subject.name, this.subject.description);
          
          this.closeModal();
        }
      },
    },
}