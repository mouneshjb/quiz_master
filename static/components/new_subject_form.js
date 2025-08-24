export default{
    template: `
    <div class="modal" v-if="isVisible">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2>Add Subject</h2>
      <div class="row">
        <div class="col" style="height: 700px;">
            <div class="border mx-auto mt-5" style="height: 300px; width: 400px;">
                <div>
                    
                    <!-- id should be same as for. Here if it was BE, we would have given 'name' in place of 'v-model' -->
                    <!-- v-model acts the storage to store the values entered in the input -->
        
                    <div class="mb-3">
                            <label for="name" class="form-label">Name</label>
                            <input type="text" class="form-control" v-model="subject.name" id="name" placeholder="Biology">
                        </div>
                        <div class="mb-3">
                            <label for="description" class="form-label">Description</label>
                            <input type="text" class="form-control" v-model="subject.description" id="description" placeholder="Study of livings">
                        </div>
                    <div style="text-align: center;">
                        <button class="btn btn-primary" @click="add_subject"> Add subject </button>
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
    },
    data () {
      return {
        subject:{
        name: "",
        description: "",
        }
      }
    },
    methods: {
      closeModal() {
        this.subject = {
            name: "",
            description: "",
        };
        this.$emit('close');
      },
      add_subject() {
        if (this.subject.name.trim() !== '' && this.subject.description.trim() !== '') {
          this.$emit('create_subject', this.subject);
          this.subject = {
            name: "",
            description: "",
        };
          this.closeModal();
        }
      },
    },
}