export default {
    template: `
    <div style="display: flex; justify-content: center; margin-top: 100px; gap: 20px; height: 150vh;">
    <div style="width: 500px; height: 400px;">
        <h2 style="text-align: center;">Your Top Scores by Subject</h2>
        <canvas id="barChart"></canvas>
    </div>

    <div style="width: 500px; height: 400px;">
        <h2 style="text-align: center;">Number of Attempts by Subject</h2>
        <canvas id="pieChart"></canvas>
    </div>
</div>
  `,
    data() {
      return {
        subjects: [],
        scores_obj: {},  // Stores subject-wise top scores
        // attemptsData: [] // Stores subject-wise user attempts
      };
    },
    methods: {
      renderCharts() {
          // Extract data for charts
          const subjects = this.subjects.map((s) => s.name);
  
          // Top Scores (Max score per subject)
          const topScores = this.subjects.map((s) => {
              const scores = this.scores_obj[s.id] || [];
              return scores.length ? Math.max(...scores.map(score => score.score)) : 0;
          });
  
          // Number of Attempts (Total attempts per subject)
          const attempts = this.subjects.map((s) => (this.scores_obj[s.id] || []).length);
  
          // Generate unique colors for each subject
          const dynamicColors = subjects.map((_, i) => `hsl(${i * 60}, 70%, 60%)`);
  
          // Render Bar Chart (Top Scores)
          if (this.barChart) this.barChart.destroy(); // Destroy if exists
          const barCtx = document.getElementById("barChart").getContext("2d");
          this.barChart = new Chart(barCtx, {
              type: "bar",
              data: {
                  labels: subjects,
                  datasets: [{
                      label: "Top Scores",
                      data: topScores,
                      backgroundColor: dynamicColors,
                      borderColor: dynamicColors.map(c => c.replace("60%", "50%")),
                      borderWidth: 1
                  }]
              },
              options: { responsive: true }
          });
  
          // Render Pie Chart (User Attempts)
          if (this.pieChart) this.pieChart.destroy(); // Destroy if exists
          const pieCtx = document.getElementById("pieChart").getContext("2d");
          this.pieChart = new Chart(pieCtx, {
              type: "pie",
              data: {
                  labels: subjects,
                  datasets: [{
                      data: attempts,
                      backgroundColor: dynamicColors
                  }]
              },
              options: { responsive: true }
          });
      }
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
      
            // Fetch chapters for each subject in parallel
            const scoreResponses = await Promise.all(
              this.subjects.map(async (subject) => {
                const scoreRes = await fetch(`/api/score/get/sub/${subject.id}`, {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token"),
                  },
                });
      
                if (!scoreRes.ok) console.log(`Failed to fetch chapters for ${subject.id}`);
      
                return { sub_id: subject.id, data: await scoreRes.json() };
              })
            );
      
            // Assign chapter data
            scoreResponses.forEach(({ sub_id, data }) => {
              this.$set(this.scores_obj, sub_id, data); // Ensures Vue reactivity
                
            });
            
            console.log("Chapters:", this.scores_obj);
            // Calling renderCharts after fetching data
            this.$nextTick(() => {
                this.renderCharts();
              });
          } catch (error) {
            console.error("Error fetching data:", error);
          }

       
          },
          
    }