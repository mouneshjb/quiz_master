# Quiz Master

Quiz Master is an application to test your knowledge on different topics in the form of timed quizzes. It is a multi-user platform to assist for prepare for exams on different topics.

![quiz_master](https://github.com/mouneshjb/assets/blob/main/quiz_master/landing_page.png)

## 💻 Built with

### Backend
- **Flask**: A web framework.
- **Flask_SQLAlchemy**: Manages database operations.
- **Flask_RESTful**: Simplifies creating REST APIs.
- **Flask-Caching**: Adds caching support.
- **Celery**: Handles asynchronous tasks.
- **Redis**: Message broker and caching layer.
- **SQLite**: A lightweight database.



### Frontend
- **HTML**: For structuring web pages.
- **CSS**: Styles web pages.
- **Bootstrap**: For responsive and mobile-first design.
- **JavaScript**: Adds interactivity.
- **VueJS**: Builds dynamic, reactive user interfaces.
- **ChartJS**: Visualizes data through charts.



## ⚙️ Installation Steps

### 1. Clone the Repository
```
git clone https://github.com/mouneshjb/quiz_master.git
```
### 2. Change the working directory
```bash
cd quiz_master
```

### 3. Create & Activate Virtual Environment
- #### Create Virtual Environment
  
```bash
python -m venv venv
```

- #### Activate Virtual Environment
For Linux/macOS:
```
source venv/bin/activate
```
For Windows:
```
venv\Scripts\activate
```

### 4. Install Required Backend Package Dependencies
```bash
pip install -r requirements.txt
```

### 5. Run the Backend
```bash
python app.py
```

### 8. Setup Redis
Make sure Redis is installed and running. You can start Redis using:
```
redis-server
```
### 9. Run Celery Worker
In a new terminal window, run the Celery worker:
```
celery -A run.celery worker --loglevel=info
```
### 10. Run Celery Beat
In another terminal window, run the Celery Beat scheduler:
```
celery -A run.celery beat --loglevel=info
```
### 11. Setup Mailhog in cmd (run in home/<user>)
```
~/go/bin/MailHog
```
Access at mailhog at http://localhost:8025/. For more details, check this document: https://github.com/mouneshjb/assets/blob/main/quiz_master/Configuring-MailHog.pdf

✨ You are all set!

<hr>

## 📸 Screenshots
![quiz_master](https://github.com/mouneshjb/assets/blob/main/quiz_master/admin_dashboard.png)
![quiz_master](https://github.com/mouneshjb/assets/blob/main/quiz_master/adding_quiz.png)
![quiz_master](https://github.com/mouneshjb/assets/blob/main/quiz_master/adding_question.png)
![quiz_master](https://github.com/mouneshjb/assets/blob/main/quiz_master/summary_analysis.png)
![quiz_master](https://github.com/mouneshjb/assets/blob/main/quiz_master/user_dashboard.png)
![quiz_master](https://github.com/mouneshjb/assets/blob/main/quiz_master/available_quiz.png)
![quiz_master](https://github.com/mouneshjb/assets/blob/main/quiz_master/quiz_page.png)
![quiz_master](https://github.com/mouneshjb/assets/blob/main/quiz_master/summary_page.png)


<hr>

<h3 align="center">
Thank You! :)
</h3>


