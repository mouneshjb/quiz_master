from celery import shared_task
from .models import Score, User, Quiz
from .util_funcs import format_report
from .mail import send_email
from datetime import datetime, timedelta
import csv

@shared_task(ignore_results = False, name = "download_csv_report")
def csv_report():
    scores = Score.query.all()
    csv_file_name = f"scores_{datetime.now().strftime("%f")}.csv"
    with open(f'static/{csv_file_name}', 'w', newline="") as csvfile:
        sl_no = 1
        scores_csv = csv.writer(csvfile, delimiter=",")
        scores_csv.writerow(['Sl No.', 'User ID', 'User Name', 'Quiz ID', 'Subject Name',  'Chapter Name', 'Time of attempt', 'Score', 'Rating'])

        for score in scores:
            this_score = [sl_no, score.user.id, score.user.name, score.quiz_id, score.subject.name, score.quiz.chapter.name, score.time_of_attempt, score.score, score.rating]
            scores_csv.writerow(this_score)
            sl_no += 1

    return csv_file_name

# implemented using Celery Beat (peiodic task scheduling)
@shared_task(ignore_results = False, name = "monthly_report")
def monthly_report():
    users = User.query.all()
    for user in users[1:]:
        user_data = {}
        user_data['name'] = user.name
        user_data['email'] = user.email
        scores = []

        total_scores = user.score
        # filtering scores of one month from today
        # Get the date 30 days ago
        thirty_days_ago = datetime.now() - timedelta(days=30)

        # Filter scores within the last 30 days
        monthly_scores = [score for score in total_scores if score.time_of_attempt >= thirty_days_ago]

        for sco in monthly_scores:
            this_score = {}
            
            this_score["date_of_attempt"] = sco.time_of_attempt.strftime("%Y-%m-%d")
            this_score["time_of_attempt"] = sco.time_of_attempt.strftime("%H:%M:%S")
            this_score["quiz_id"] = sco.quiz_id
            this_score["subject_name"] = sco.subject.name
            this_score["chapter_name"] = sco.quiz.chapter.name
            this_score["score"] = sco.score
            this_score["rating"] = sco.rating
            scores.append(this_score)
            
            user_data['score'] = scores
            message = format_report('templates/email_template.html', user_data)
        send_email(user.email, subject = "Monthly Scores Report - Quiz Master", message=message)

    return "Monthly reports sent via email"

# @shared_task(ignore_results = False, name = "subject_update")
# def subject_update(): 
#     return "New subject is added"

@shared_task(ignore_results = False, name = "daily_reminder")
def daily_reminder(): 
    date_today = datetime.now().date()
    quizzes = Quiz.query.filter(Quiz.date_of_quiz == date_today).all()
    quiz_list = []  # Store the transformed quiz data separately
    for quiz in quizzes:
        this_quiz = {}
        
        this_quiz["date_of_quiz"] = quiz.date_of_quiz.strftime("%Y-%m-%d")
        this_quiz["subject_name"] = quiz.subject.name
        this_quiz["chapter_name"] = quiz.chapter.name
        this_quiz["number_of_questions"] = quiz.number_of_questions
        this_quiz["time_duration"] = quiz.time_duration
        this_quiz["description"] = quiz.description
        
        quiz_list.append(this_quiz)

    users = User.query.all()
    for user in users[1:]:
        user_data = {}
        user_data['name'] = user.name
        user_data['email'] = user.email
        user_data['today_date'] = datetime.now().date().strftime("%Y-%m-%d")
        user_data['daily_quizzes'] = quiz_list

        message = format_report('templates/reminder_email_template.html', user_data)

        send_email(user.email, subject = "Reminder for today's quizzes - Quiz Master", message=message)

    return "Daily reminder email sent"

