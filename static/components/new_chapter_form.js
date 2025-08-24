export default{
    template: `
    <div class="modal" v-if="isVisible">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2>Add Chapter</h2>
      <div class="row">
        <div class="col" style="height: 700px;">
            <div class="border mx-auto mt-5" style="height: 300px; width: 400px;">
                <div>
        
                    <div class="mb-3">
                            <label for="name" class="form-label">Name</label>
                            <input type="text" class="form-control" v-model="chapter.name" id="name">
                        </div>
                        <div class="mb-3">
                            <label for="description" class="form-label">Description</label>
                            <input type="text" class="form-control" v-model="chapter.description" id="description">
                        </div>
                    <div style="text-align: center;">
                        <button class="btn btn-primary" @click="add_chapter"> Add Chapter </button>
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
        chapter:{
        name: "",
        description: "",
        }
      }
    },
    methods: {
      closeModal() {
        this.chapter = {
            name: "",
            description: "",
        };
        this.$emit('close');
      },
      add_chapter() {
        if (this.chapter.name.trim() !== '' && this.chapter.description.trim() !== '') {
          this.$emit('add_chapter', this.chapter);
          this.chapter = {
            name: "",
            description: "",
        };
          this.closeModal();
        }
      },
    },
}