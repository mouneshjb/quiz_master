
export default{
    template: `
    <div style="position: relative;">
    <!-- Timer at the Top Right -->
    <div 
        style="
            position: absolute;
            top: 10px;
            right: 10px;
            background-color: #ffeb3b;
            padding: 10px;
            border-radius: 5px;
            font-weight: bold;
        "
    >
        Time Left: {{ formattedTime }}
    </div>

    <h4> Quiz ID: {{ quiz.id }} </h4>
    <br>
    
    <div 
        v-for="(question, qIndex) in formattedQuestions" 
        :key="qIndex"
        class="p-3 mb-3 rounded shadow-sm" 
        style="background-color: #e3f2fd;"
    >
        <h5> {{ qIndex+1 }}. {{ question.question_statement }}</h5>
        <br>

        <div 
            class="form-check" 
            v-for="(option, oIndex) in question.options" 
            :key="oIndex"
        >
            <input 
                class="form-check-input" 
                type="radio" 
                :id="'option-' + qIndex + '-' + oIndex"
                :value="option" 
                v-model="selectedAnswers[question.id]" 
                :name="'quizOptions-' + qIndex"
            />
            <label 
                class="form-check-label" 
                :for="'option-' + qIndex + '-' + oIndex"
            >
                {{ option }}
            </label>
        </div>
    </div>
    <!-- Rating Input Box -->
    <div class="p-3 mb-3 rounded shadow-sm" style="background-color: #f8f9fa;">
        <h5> Please provide a rating for this quiz: (out of 10) </h5> 
        <input 
            type="number" 
            v-model="rating" 
            min="1" 
            max="10" 
            class="form-control" 
            style="width: 100px;"
        />
    </div>

    <div>
        <button @click="submitQuiz" class="btn btn-danger">Submit</button>
    </div>
</div>
    `,
    // in the component, data has to be a function always
    
    computed: {
        ...Vuex.mapState(["searchQuery", "searchCategory"]),
        formattedQuestions() {
            const formatted = this.questions.map(q => ({
                ...q,
                options: [q.option1, q.option2, q.option3, q.option4] // Convert to array
            }));
            console.log("Formatted Questions:", formatted); // Debugging
            return formatted;
        },
        formattedTime() {
            const minutes = Math.floor(this.timeLeft / 60);
            const seconds = this.timeLeft % 60;
            return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
        }
      },
      
      data() {
        return {
          quiz: this.$store.state.current_quiz,      
          questions: [],     // Fetch from API
          selectedAnswers: {}, // Stores selected answers
          timeLeft: 0, // Time in seconds
          timerInterval: null,
          rating:"",
          new_score: {}
        };
      },
      async mounted() {

        try {
            // Fetch questions
            const quiz_id = this.$store.state.current_quiz.id
            const res = await fetch(`/api/question/get/${quiz_id}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "Authentication-Token": localStorage.getItem("auth_token"),
              },
            });
      
            if (!res.ok) throw new Error("Failed to fetch questions");
      
            this.questions = await res.json();
            console.log("Questions:", this.questions);
        } catch (error) {
            console.error("Error fetching data:", error);
          }
          this.startTimer(); // Start timer when component loads

      },
      methods: {
        getCurrentTimestamp() {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, "0"); // Month (01-12)
            const day = String(now.getDate()).padStart(2, "0"); // Day (01-31)
            const hours = String(now.getHours()).padStart(2, "0"); // Hours (00-23)
            const minutes = String(now.getMinutes()).padStart(2, "0"); // Minutes (00-59)
            const seconds = String(now.getSeconds()).padStart(2, "0"); // Seconds (00-59)
    
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        },
        
        startTimer() {
            const [hh, mm] = this.quiz.time_duration.split(":").map(Number);
            this.timeLeft = hh * 3600 + mm * 60; // Convert HH:MM to seconds

            this.timerInterval = setInterval(() => {
                if (this.timeLeft > 0) {
                    this.timeLeft--;
                } else {
                    clearInterval(this.timerInterval);
                    this.submitQuiz(); // Auto-submit when time ends
                }
            }, 1000);
        },
        async submitQuiz(){
            alert("Submitting quiz...");
            const timeOfAttempt = this.getCurrentTimestamp(); // Capture time when user submits
            
            // calculating score for the quiz
            let score_value = 0;
            for (let question of this.questions){
                if (this.selectedAnswers[question.id] === question.answer){
                    score_value++;
                }
            }
            // creating new_score object before sending to backend
            this.new_score.quiz_id = this.quiz.id
            this.new_score.time_of_attempt = timeOfAttempt
            this.new_score.score = score_value
            this.new_score.rating = this.rating

            try {
                const response = await fetch(`/api/score/create/${this.quiz.id}`, {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authentication-Token": localStorage.getItem("auth_token"),
                     },
                    
                    body: JSON.stringify(this.new_score)
                });
                this.message = await response.json();
            console.log(this.message)
            
        } catch (error) {
            console.error("Error creating score:", error);
        }
            this.$router.push('/user/score')
        }
      
    },
    beforeDestroy() {
        clearInterval(this.timerInterval); // Clear timer when component is destroyed
    },
}