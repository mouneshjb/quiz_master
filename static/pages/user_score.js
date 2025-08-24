export default{
    template: `
    <div>
        <h2 style="text-align: center;"> Scores for attempted quizzes </h2>
            <div style="width:1200px; height:500px; overflow-y:auto;margin: auto;margin-bottom: 10px; text-align: center; border: 1px solid black;">
                            
                <table cellspacing="0" cellpadding="1" border="1" width="1180" style="margin: auto;">
                    <tr style="color:white;background-color:grey;text-align: center;position: sticky;">
                        <th>Sl No.</th>
                        <th>Time of Attempt</th>
                        <th>Quiz ID</th>
                        <th>Subject Name</th>
                        <th>Score</th>
                        <th>Rating</th>
                        
                    </tr>
                    
                    <tr v-for="(score, index) in allScores" :key="score.id">
                        <td>{{index+1}}</td>
                        <td>{{score.time_of_attempt}}</td>
                        <td>{{score.quiz_id}}</td>
                        <td>{{subjects.find(sub => sub.id === score.subject_id)?.name || 'N/A'}}</td>
                        <td>{{score.score}}</td>
                        <td>{{score.rating}}</td>
                        
                     
                    </tr>
                
                </table>  
                  
            </div>

    </div>
    `,
    // in the component, data has to be a function always
    
    computed: {
      allScores() {
          return this.scores_obj 
              ? Object.values(this.scores_obj)
                    .flat()
                    .sort((a, b) => new Date(b.time_of_attempt.replace(" ", "T")) - new Date(a.time_of_attempt.replace(" ", "T")))
              : [];
      }
  },
      data() {
        return {
       
            subjects: [],
            scores_obj: {},
            
        };
      },
    
      async mounted() {
    

        try {
          // Fetch subjects
          const res = await fetch("/api/subject/get", {
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
                  "Authentication-Token": localStorage.getItem("auth_token"),
              },
          });
      
          if (!res.ok) throw new Error("Failed to fetch subjects");
      
          this.subjects = await res.json();
          console.log("Subjects:", this.subjects);
      
          // Fetch scores for each subject in parallel
          const scoreResponses = await Promise.all(
              this.subjects.map(async (subject) => {
                  try {
                      const scoreRes = await fetch(`/api/score/get/sub/${subject.id}`, {
                          method: "GET",
                          headers: {
                              "Content-Type": "application/json",
                              "Authentication-Token": localStorage.getItem("auth_token"),
                          },
                      });
      
                      if (!scoreRes.ok) throw new Error(`No scores for Subject ID: ${subject.id}`);
      
                      return { sub_id: subject.id, data: await scoreRes.json() };
                  } catch (err) {
                      console.warn(err.message); // Log warning but do not add to scores_obj
                      return null;
                  }
              })
          );
      
          // Filter out failed responses (null values)
          scoreResponses
              .filter(response => response !== null) // Keep only successful responses
              .forEach(({ sub_id, data }) => {
                  this.$set(this.scores_obj, sub_id, data); // Vue reactivity for dynamic updates
              });
      
          console.log("Scores:", this.scores_obj);
      } catch (error) {
          console.error("Error fetching data:", error);
      }
    },
    methods: {
        // openReviewQuizForm(quiz) {
        //     console.log("Opening review form for quiz:", quiz.id);
        //     this.selectedQuiz = { ...quiz };
        //     this.isReviewQuizFormVisible = true;
        //   },
    },
       
      components: {
      
    },
}