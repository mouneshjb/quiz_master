export default{
    template: `
    <div class="modal" v-if="isVisible">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2>Update Chapter Details</h2>
      <div class="row">
        <div class="col" style="height: 700px;">
            <div class="border mx-auto mt-5" style="height: 300px; width: 400px;">
                <div>
                    
                    <!-- id should be same as for. Here if it was BE, we would have given 'name' in place of 'v-model' -->
                    <!-- v-model acts the storage to store the values entered in the input -->
        
                    <div class="mb-3">
                            <label for="name" class="form-label">Name</label>
                            <input type="text" class="form-control" v-model="updated_ch.name" id="name">
                        </div>
                        <div class="mb-3">
                            <label for="description" class="form-label">Description</label>
                            <input type="text" class="form-control" v-model="updated_ch.description" id="description">
                        </div>
                    <div style="text-align: center;">
                        <button class="btn btn-primary" @click="edit_chapter"> Save edits </button>
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
        chapter: Object, // Receive the chapter object
        isVisible: Boolean
    },
    data () {
      return {
        updated_ch: { ...this.chapter },
        // updated_ch: {
        //     name: "",
        //     description: "",
        //     // id: this.chapter.id,
        //     // sub_id: this.chapter.subject_id
        // },
        
        }
      },
    watch: {
        chapter: {
          deep: true,
          handler(newChapter) {
            this.updated_ch = { ...newChapter }; // Keep it reactive
          },
        },
      },

    methods: {
      closeModal() {
        this.updated_ch.name = "";
        this.updated_ch.description = "";
        this.$emit('close');
      },
      edit_chapter() {
        if (this.updated_ch.name.trim() !== '' && this.updated_ch.description.trim() !== '') {
        //   console.log("updated chapter name form child:" + this.updated_ch.name)
        //     // console.log("updated subject id:" + this.updated_ch.id)
        //     console.log("updated chapter id:" + this.chapter.id)
        //     console.log("updated chapter sub id:" + this.chapter.subject_id)
            this.$emit('edit_chapter', this.updated_ch.id, this.updated_ch.name, this.updated_ch.description);
          this.updated_ch.name = ""
          this.updated_ch.description = ""
          
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