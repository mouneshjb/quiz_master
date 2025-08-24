export default {
    template: `
    <div style="display: flex; justify-content: center; flex-wrap: wrap; margin-top: 30px; gap: 20px; height: auto;">
    <!-- Top Scores Chart -->
    <div style="width: 500px; height: 400px;">
        <h2 style="text-align: center;">Top Scores by Subject</h2>
        <canvas id="barChart"></canvas>
    </div>

    <!-- User Attempts Chart -->
    <div style="width: 500px; height: 300px;">
        <h2 style="text-align: center;">User Attempts by Subject</h2>
        <canvas id="pieChart"></canvas>
    </div>

    <!-- Average Ratings Chart -->
    <div style="width: 500px; height: 400px;">
        <h2 style="text-align: center;">Average Ratings by Subject</h2>
        <canvas id="ratingChart"></canvas>
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
      async fetchData() {
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
  
              // Fetch scores for each subject (only if response is 200)
              const scoresResponses = await Promise.all(
                  this.subjects.map(async (subject) => {
                      const scoreRes = await fetch(`/api/score/get/sub/${subject.id}`, {
                          method: "GET",
                          headers: {
                              "Content-Type": "application/json",
                              "Authentication-Token": localStorage.getItem("auth_token"),
                          },
                      });
  
                      if (!scoreRes.ok) {
                          console.log(`Failed to fetch scores for ${subject.id}`);
                          return null; // Skip this subject if the fetch failed
                      }
  
                      return { sub_id: subject.id, data: await scoreRes.json() };
                  })
              );
  
              // Store scores in reactive state, filtering out failed fetches
              scoresResponses.forEach(({ sub_id, data }) => {
                  if (data) {
                      this.$set(this.scores_obj, sub_id, data);
                  }
              });
  
              console.log("Scores:", this.scores_obj);
  
              // Render charts after data is loaded
              this.$nextTick(() => this.renderCharts());
  
          } catch (error) {
              console.error("Error fetching data:", error);
          }
      },
  
      renderCharts() {
          const subjects = this.subjects.map((s) => s.name);
  
          // Extract Top Scores
          const topScores = this.subjects.map((s) => {
              const scores = Array.isArray(this.scores_obj[s.id]) ? this.scores_obj[s.id] : [];
              return scores.length ? Math.max(...scores.map(score => score.score)) : 0;
          });
  
          // Extract Number of Attempts
          const attempts = this.subjects.map((s) => 
              Array.isArray(this.scores_obj[s.id]) ? this.scores_obj[s.id].length : 0
          );
  
          // Extract Average Ratings
          const avgRatings = this.subjects.map((s) => {
              const scores = Array.isArray(this.scores_obj[s.id]) ? this.scores_obj[s.id] : [];
              const ratings = scores.map(score => parseFloat(score.rating) || 0).filter(r => !isNaN(r));
              
              return ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2) : 0;
          });
  
          console.log("Average Ratings:", avgRatings);
  
          // Dynamic colors for different subjects
          const dynamicColors = subjects.map((_, i) => `hsl(${i * 60}, 70%, 60%)`);
  
          this.$nextTick(() => {
              // Destroy old charts before rendering new ones
              if (this.barChart) this.barChart.destroy();
              if (this.pieChart) this.pieChart.destroy();
              if (this.ratingChart) this.ratingChart.destroy();
  
              // Top Scores Chart
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
  
              // Attempts Pie Chart
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
  
              // Average Ratings Chart
              const ratingCtx = document.getElementById("ratingChart").getContext("2d");
              this.ratingChart = new Chart(ratingCtx, {
                  type: "bar",
                  data: {
                      labels: subjects,
                      datasets: [{
                          label: "Average Rating",
                          data: avgRatings,
                          backgroundColor: dynamicColors,
                          borderColor: dynamicColors.map(c => c.replace("60%", "50%")),
                          borderWidth: 1
                      }]
                  },
                  options: { 
                      responsive: true,
                      scales: {
                          y: {
                              beginAtZero: true,
                              max: 10
                          }
                      }
                  }
              });
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
            const scoresResponses = await Promise.all(
              this.subjects.map(async (subject) => {
                const scoreRes = await fetch(`/api/score/get/sub/${subject.id}`, {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token"),
                  },
                });
      
                if (!scoreRes.ok) console.log(`Failed to fetch scores for ${subject.id}`);
      
                return { sub_id: subject.id, data: await scoreRes.json() };
              })
            );
      
            // Assign chapter data correctly
            scoresResponses.forEach(({ sub_id, data }) => {
              this.$set(this.scores_obj, sub_id, data); // Ensures Vue reactivity
            });
      
            console.log("scores:", this.scores_obj);

            // Calling renderCharts after fetching data
            this.$nextTick(() => {
            this.renderCharts();
          });

          } catch (error) {
            console.error("Error fetching data:", error);
          }

       
          },
          
    }