import EditSubjectForm from "../components/edit_subject_form.js"
import EditChapterForm from "../components/edit_chapter_form.js"
import AddChapterForm from "../components/new_chapter_form.js"

export default {
    props : ['name', 'description', 'chapters', 'subject', 'subjects', 'message', 'subject_id'],
    template : `
    <div class="col">
                      <div class="card h-100" style="height: 200px; width: 600px;">

                        <div class="card-body">
                            <div class="row border" style="background-color: lightblue;">
                                <div class="col-5 my-2">
                                    <router-link :to="{ path: '/admin/quiz_dashboard', query: subject }"><h5>{{name}}</h5> 
                                </div>
                                <div class="col-7 border" style="text-align: right;">
                                    <button @click="openEditSubjectForm(subject)" class="btn btn-primary">Edit</button>
                                    <EditSubjectForm @edit_subject="editSubject" @close="isEditSubjectFormVisible = false" :isVisible="isEditSubjectFormVisible" style="text-align: center;" :subject="$store.state.editSubject" :message="message" />
                                    <button @click="delete_subject(subject_id)" class="btn btn-danger">Delete</button>
                                </div>
                            </div>
                            <div style="width:575px; height:150px; overflow-y:auto;margin: auto;margin-bottom: 10px; text-align: center; border: 1px solid black;">
                            
                                <table cellspacing="0" cellpadding="1" border="1" width="565" style="margin: auto;">
                                  <tr style="color:white;background-color:grey;text-align: center;position: sticky;">
                                    <th>Chapter Name</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                    
                                </tr>
                                

                                <tr v-for="chapter in chapters" :key="chapter.id">
                                
                                    <td>{{chapter.name}}</td>
                                    <td>{{chapter.description}}</td>
                                    <td>
                                        <div>
                                            <button @click="openEditChapterForm(chapter)"  class="btn btn-warning">Edit</button>
                                            
                                            <button @click="deleteChapter(chapter.id)" class="btn btn-danger">Delete</button>
                                        </div>
                                    </td>
                                    
                                </tr>
                              
                                </table>
                                <EditChapterForm @edit_chapter="editChapter" @close="isEditChapterFormVisible = false" style="text-align: center;" :chapter="selectedChapter" :message="message" :isVisible="isEditChapterFormVisible" />

                            </div>
                            <div style="text-align: center;">
                                <button @click="openAddChapterForm(subject)" class="btn btn-primary" style="display: inline;">+Add new chapter</button>
                                <AddChapterForm @add_chapter="addChapter" @close="isAddChapterFormVisible = false" style="text-align: center;" :subject="selectedSubject" :message="message" :isVisible="isAddChapterFormVisible" />
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
            isEditSubjectFormVisible: false, 
            isEditChapterFormVisible: false,
            isAddChapterFormVisible: false,
            selectedChapter: null, // This will store the chapter being edited
            selectedSubject: null, // This will store the subject being passed for adding a chapter
            
            chapter_id: null, // Initialize without using this.chapter.id
            selectedChapters: { ...this.chapters },
        };
    },
    created() {
        // Now this.subject and this.chapter are accessible
        if (this.subject) {
            this.subject_id = this.subject.id;
        }
        if (this.chapter) {
            this.chapter_id = this.chapter.id;
        }
    },
      
      mounted(){
    
      },
      methods: {
        openEditSubjectForm(subject) {
            this.selectedSubject = { ...subject }; // Make a copy to avoid direct mutation
            console.log("before opening the edit form sub id: " + subject.id)
            console.log("before opening the edit form sub id: " + this.selectedSubject.id)
            this.$store.commit("updateEditSubject", this.selectedSubject)
            this.isEditSubjectFormVisible = true;
        },
        delete_subject(subject_id){
            console.log("to be deleted sub id from sub card: " + subject_id)
            this.$emit('delete_subject', subject_id);
        },
        async editSubject(id, name, description){
            // console.log("update from admin_dashboard: " + subject)
            // console.log("update name from admin_dashboard: " + subject.name)
            // console.log("update id from admin_dashboard: " + subject.id)
            const subject = {
                id: this.subject.id,
                name: name,
                description: description,
            }
            try {
                const response = await fetch(`/api/subject/update/${this.subject.id}`, {
                    method: "PUT",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authentication-Token": localStorage.getItem("auth_token"),
                     },
                    
                    body: JSON.stringify(subject)
                });
                this.message = await response.json();
                console.log( this.message)
                if (response.ok) {
                    const subjIndex = this.subjects.findIndex(sub => sub.id === this.subject.id);
                    
                    if (subjIndex !== -1) {
                        this.$set(this.subjects, subjIndex, { ...this.subjects[subjIndex], ...subject });
                    }
                }
            } catch (error) {
                console.error("Error creating subject:", error);
            }
    
        },
        // edit_chapter(ch_id, name, description){
        //     // console.log("updated sub from sub card: " + this.sub_id)
        //     // console.log("updated subject id from sub card: " + this.subject.id)
        //     console.log("updated ch sub_id from sub card: " + this.subject.id)
        //     this.$emit('edit_chapter',ch_id, this.subject.id, name, description);
        // },
        openEditChapterForm(chapter) {
            this.selectedChapter = { ...chapter }; // Make a copy to avoid direct mutation
            this.isEditChapterFormVisible = true;
        },
        async editChapter(ch_id, name, description){
            // console.log("update from admin_dashboard: " + subject)
            // console.log("update name from admin_dashboard: " + subject.name)
            // console.log("update id from admin_dashboard: " + subject.id)
            const chapter = {
                id: ch_id,
                subject_id: this.subject.id,
                name: name,
                description: description,
            }
            try {
                const response = await fetch(`/api/chapter/update/${ch_id}`, {
                    method: "PUT",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authentication-Token": localStorage.getItem("auth_token"),
                     },
                    
                    body: JSON.stringify(chapter)
                });
                this.message = await response.json();
                console.log( this.message)
                if (response.ok) {
                    // const subjectChapters = this.chapters[this.subject.id]; // Get the array for the subject
                
                        const chIndex = this.chapters.findIndex(ch => ch.id === ch_id);
                
                        if (chIndex !== -1) {
                            this.$set(this.chapters, chIndex, { ...this.chapters[chIndex], ...chapter });
                        }
                    
                }
            } catch (error) {
                console.error("Error creating subject:", error);
            }
    
        },
        openAddChapterForm(subject){
            console.log("before opening form: " + subject.id)
            this.selectedSubject = { ...subject }; // Make a copy to avoid direct mutation
            this.isAddChapterFormVisible = true;
            this.$store.commit("updateSubjectId", subject.id);
        },
        async addChapter(new_chapter){
            // console.log("update from admin_dashboard: " + subject)
            // console.log("update name from admin_dashboard: " + subject.name)
            // console.log("update id from admin_dashboard: " + subject.id)
            console.log("in addChapeter: " + this.subject.id)
            new_chapter.subject_id = this.$store.state.subject_id
            try {
                const response = await fetch(`/api/chapter/create/${new_chapter.subject_id}`, {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authentication-Token": localStorage.getItem("auth_token"),
                     },
                    
                    body: JSON.stringify(new_chapter)
                });
                this.message = await response.json();
            console.log(this.message)
            if (response.ok){
                try {
                    // Fetch chapters to get newly created chapter
                    const res = await fetch(`/api/chapter/get/${new_chapter.subject_id}`, {
                      method: "GET",
                      headers: {
                        "Content-Type": "application/json",
                        "Authentication-Token": localStorage.getItem("auth_token"),
                      },
                    });
              
                    if (!res.ok) throw new Error("Failed to fetch subjects");
              
                    this.chapters = await res.json();
                    console.log("Chapters:", this.chpaters);
                } catch (error) {
                    console.error("Error fetching data:", error);
                  }
            }
        } catch (error) {
            console.error("Error creating subject:", error);
        }
    
        },
        async deleteChapter(id){
            this.chapters = this.chapters.filter(chapter => chapter.id !== id);
            try {
                // Delete subject
                const res = await fetch(`/api/chapter/delete/${id}`, {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token"),
                  },
                });
          
                if (!res.ok) throw new Error("Failed to fetch chapters");
          
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
        EditSubjectForm,
        EditChapterForm,
        AddChapterForm,
    }
}