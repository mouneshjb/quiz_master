from flask import current_app as app
from flask_restful import Api, Resource, reqparse 
# In route, we used request.get_json(), here, we are using reqparse is required to define what 
# details/ attributes we want to extract from the request body
from .models import *
from flask_security import current_user, auth_required, roles_required, roles_accepted
from .util_funcs import roles_list

api = Api()

cache = app.cache

#### SUBJECT end points ####
sub_parser = reqparse.RequestParser()
sub_parser.add_argument('name')
sub_parser.add_argument('description')

class SubApi(Resource):
# in routes, we can give anything as function name under the route, but here we need to give defined names
    @auth_required('token')
    @roles_accepted('admin', 'user')
    @cache.cached(timeout = 3, key_prefix = "subjects")
    def get(self): # get for subjects is simply retreival operation, there is no request body
        # based on who is the user - normal user or admin, we want to get all subjects or only few, we need to modify for that
        subjects = [] # stores list of objects of class Subject
        sub_jsons = []
        subjects = Subject.query.all()
        # convering every object of class Subject into a disctionary
        for sub in subjects:
            this_sub = {}
            this_sub["id"] = sub.id
            this_sub["name"] = sub.name
            this_sub["description"] = sub.description
            sub_jsons.append(this_sub)
        if sub_jsons:
            return sub_jsons
        else:
            return {
                "message": "No subjects found"
            }, 404
    
    @auth_required('token')
    @roles_required('admin')
    def post(self):
        try:
            args = sub_parser.parse_args()
            sub = Subject(name = args["name"],
                        description = args["description"])
            db.session.add(sub)
            db.session.commit()
            return {
                "message": "Subject created successfully"
            }
        
        except:
            return {
                "message": "All fields are not provided or the subject provided already exists"
            }, 400

    @auth_required('token')
    @roles_required('admin')
    def put(self, sub_id):
        sub_exists = Subject.query.filter(Subject.id == sub_id).first()
        if sub_exists:
            args = sub_parser.parse_args()
            sub_exists.name = args["name"]
            sub_exists.description = args["description"]
            db.session.commit()
            return {
                "message": "The subject updated successfully"
            }

        else:
            return {
                "message": "The subject does not exist"
            }, 404
        
    @auth_required('token')
    @roles_required('admin')
    def delete(self, sub_id):
        sub_exists = Subject.query.filter(Subject.id == sub_id).first()
        if sub_exists:
            db.session.delete(sub_exists)
            db.session.commit()
            return {
                "message": "The subject deleted successfully"
            }

        else:
            return {
                "message": "The subject does not exist"
            }, 404

api.add_resource(SubApi, '/api/subject/get', '/api/subject/create', '/api/subject/update/<int:sub_id>', '/api/subject/delete/<int:sub_id>')


#### CHAPTER end points ####
ch_parser = reqparse.RequestParser()
ch_parser.add_argument('name')
ch_parser.add_argument('description')

class ChApi(Resource):
    @auth_required('token')
    @roles_accepted('admin', 'user')
    def get(self, sub_id):
        chapters = [] # stores list of objects of class Chapter
        ch_jsons = []
        chapters = Chapter.query.filter(Chapter.subject_id == sub_id).all()
        # convering every object of class Chapter into a disctionary
        for ch in chapters:
            this_ch = {}
            this_ch["id"] = ch.id
            this_ch["name"] = ch.name
            this_ch["description"] = ch.description
            ch_jsons.append(this_ch)
        if ch_jsons:
            return ch_jsons
        else:
            return {
                "message": "No chapters found!"
            }, 404
    
    @auth_required('token')
    @roles_required('admin')
    def post(self, sub_id):
        try:
            args = ch_parser.parse_args()
            ch = Chapter(name = args["name"],
                        description = args["description"],
                        subject_id = sub_id)
            db.session.add(ch)
            db.session.commit()
            return {
                "message": "Chapter created successfully"
            }
        
        except:
            return {
                "message": "All fields are not provided"
            }, 400

    @auth_required('token')
    @roles_required('admin')
    def put(self, ch_id):
        ch_exists = Chapter.query.filter(Chapter.id == ch_id).first()
        if ch_exists:
            args = ch_parser.parse_args()
            ch_exists.name = args["name"]
            ch_exists.description = args["description"]
            db.session.commit()
            return {
                "message": "The chapter updated successfully"
            }

        else:
            return {
                "message": "The chapter does not exist"
            }, 404
        
    @auth_required('token')
    @roles_required('admin')
    def delete(self, ch_id):
        ch_exists = Chapter.query.filter(Chapter.id == ch_id).first()
        if ch_exists:
            db.session.delete(ch_exists)
            db.session.commit()
            return {
                "message": "The chapter deleted successfully"
            }

        else:
            return {    
                "message": "The chapter does not exist"
            }, 404
        
api.add_resource(ChApi, '/api/chapter/get/<int:sub_id>', '/api/chapter/create/<int:sub_id>', '/api/chapter/update/<int:ch_id>', '/api/chapter/delete/<int:ch_id>')


#### QUIZ end points ####
quiz_parser = reqparse.RequestParser()
quiz_parser.add_argument('date_of_quiz')
quiz_parser.add_argument('description')
quiz_parser.add_argument('number_of_questions')
quiz_parser.add_argument('time_duration')


class QuizApi(Resource):
    @auth_required('token')
    @roles_accepted('admin', 'user')
    def get(self, ch_sub, id):
        quiz = [] # stores list of objects of class Chapter
        quiz_jsons = []
        if ch_sub == "ch":
            quiz = Quiz.query.filter(Quiz.chapter_id == id).all()
        elif ch_sub == "sub":
            quiz = Quiz.query.filter(Quiz.subject_id == id).all()
        
        # convering every object of class Chapter into a disctionary
        for qz in quiz:
            # chapter = Quiz.query.get(qz.chapter_id)
            this_quiz = {}
            this_quiz["id"] = qz.id
            this_quiz["chapter_id"] = qz.chapter_id
            this_quiz["subject_id"] = qz.subject_id
            this_quiz["date_of_quiz"] = qz.date_of_quiz.strftime("%Y-%m-%d")
            this_quiz["number_of_questions"] = qz.number_of_questions
            this_quiz["time_duration"] = qz.time_duration.strftime("%H:%M")
            this_quiz["description"] = qz.description
            quiz_jsons.append(this_quiz)
        if quiz_jsons:
            return quiz_jsons
        else:
            return {
                "message": "No quiz found!"
            }, 404
    
    @auth_required('token')
    @roles_required('admin')
    def post(self, ch_id):
        args = quiz_parser.parse_args()
        chapter = Chapter.query.get(ch_id)
        date_of_quiz = datetime.strptime(args['date_of_quiz'], "%Y-%m-%d").date()
        time_duration = datetime.strptime(args['time_duration'], "%H:%M").time()
        try:
            quiz = Quiz(date_of_quiz = date_of_quiz,
                        time_duration = time_duration,
                        number_of_questions = args["number_of_questions"],
                        description = args["description"],
                        chapter_id = ch_id,
                        subject_id = chapter.subject_id)
            db.session.add(quiz)
            db.session.commit()
            return {
                "message": "Quiz created successfully"
            }
        
        except:
            return {
                "message": "All fields are not provided"
            }, 400

    @auth_required('token')
    @roles_required('admin')
    def put(self, quiz_id):
        quiz_exists = Quiz.query.filter(Quiz.id == quiz_id).first()
        args = quiz_parser.parse_args()
        date_of_quiz = datetime.strptime(args['date_of_quiz'], "%Y-%m-%d").date()
        time_duration = datetime.strptime(args['time_duration'], "%H:%M").time()
        if quiz_exists:
            quiz_exists.description = args["description"]
            quiz_exists.date_of_quiz = date_of_quiz
            quiz_exists.time_duration = time_duration
            quiz_exists.number_of_questions = args["number_of_questions"]
            db.session.commit()
            return {
                "message": "The quiz updated successfully"
            }

        else:
            return {
                "message": "The quiz does not exist"
            }, 404
        
    @auth_required('token')
    @roles_required('admin')
    def delete(self, quiz_id):
        quiz_exists = Quiz.query.filter(Quiz.id == quiz_id).first()
        if quiz_exists:
            db.session.delete(quiz_exists)
            db.session.commit()
            return {
                "message": "The quiz deleted successfully"
            }

        else:
            return {    
                "message": "The quiz does not exist"
            }, 404
        
api.add_resource(QuizApi, '/api/quiz/get/<string:ch_sub>/<int:id>', '/api/quiz/create/<int:ch_id>', '/api/quiz/update/<int:quiz_id>', '/api/quiz/delete/<int:quiz_id>')


#### Question end points ####
que_parser = reqparse.RequestParser()
que_parser.add_argument('question_statement')
que_parser.add_argument('question_title')
que_parser.add_argument('option1')
que_parser.add_argument('option2')
que_parser.add_argument('option3')
que_parser.add_argument('option4')
que_parser.add_argument('answer')


class QuestionApi(Resource):
    @auth_required('token')
    @roles_accepted('admin', 'user')
    def get(self, quiz_id):
        question = [] # stores list of objects of class Chapter
        question_jsons = []
        
        question = Question.query.filter(Question.quiz_id == quiz_id).all()
        # convering every object of class Chapter into a disctionary
        for que in question:
            this_question = {}
            this_question["id"] = que.id
            this_question["quiz_id"] = que.quiz_id
            this_question["question_statement"] = que.question_statement
            this_question["question_title"] = que.question_title
            this_question["option1"] = que.option1
            this_question["option2"] = que.option2
            this_question["option3"] = que.option3
            this_question["option4"] = que.option4
            this_question["answer"] = que.answer
            question_jsons.append(this_question)
        if question_jsons:
            return question_jsons
        else:
            return {
                "message": "No question found!"
            }, 404
    
    @auth_required('token')
    @roles_required('admin')
    def post(self, quiz_id):
        args = que_parser.parse_args()
    
        try:
            question = Question(question_statement = args["question_statement"],
                        question_title = args["question_title"],
                        option1 = args["option1"],
                        option2 = args["option2"],
                        option3 = args["option3"],
                        option4 = args["option4"],
                        answer = args["answer"],
                        quiz_id = quiz_id)
            db.session.add(question)
            db.session.commit()
            return {
                "message": "Question created successfully"
            }
        
        except:
            return {
                "message": "All fields are not provided"
            }, 400

    @auth_required('token')
    @roles_required('admin')
    def put(self, que_id):
        que_exists = Question.query.get(que_id)
        args = que_parser.parse_args()
        
        if que_exists:
            que_exists.question_statement = args["question_statement"]
            que_exists.question_title = args["question_title"]
            que_exists.option1 = args["option1"]
            que_exists.option2 = args["option2"]
            que_exists.option3 = args["option3"]
            que_exists.option4 = args["option4"]
            que_exists.answer = args["answer"]
            db.session.commit()
            return {
                "message": "The question updated successfully"
            }

        else:
            return {
                "message": "The question does not exist"
            }, 404
        
    @auth_required('token')
    @roles_required('admin')
    def delete(self, que_id):
        que_exists = Question.query.get(que_id)
        if que_exists:
            db.session.delete(que_exists)
            db.session.commit()
            return {
                "message": "The question deleted successfully"
            }

        else:
            return {    
                "message": "The question does not exist"
            }, 404
        
api.add_resource(QuestionApi, '/api/question/get/<int:quiz_id>', '/api/question/create/<int:quiz_id>', '/api/question/update/<int:que_id>', '/api/question/delete/<int:que_id>')


#### Score end points ####
score_parser = reqparse.RequestParser()
score_parser.add_argument('user_id')
score_parser.add_argument('quiz_id')
score_parser.add_argument('subject_id')
score_parser.add_argument('time_of_attempt')
score_parser.add_argument('score')
score_parser.add_argument('rating')
score_parser.add_argument('flag_quiz')
score_parser.add_argument('review')

class ScoreApi(Resource):
    @auth_required('token')
    @roles_accepted('admin', 'user')
    def get(self, sub_quiz, id):
        score = [] # stores list of objects of class Chapter
        score_jsons = []
        if "admin" in current_user.roles:
            score = Score.query.filter(Score.subject_id == id).all()
        elif "user" in current_user.roles:
            if sub_quiz == "sub":
                score = Score.query.filter(Score.subject_id == id, Score.user_id == current_user.id).all()
            else:
                score = Score.query.filter(Score.quiz_id == id, Score.user_id == current_user.id).all()
        # convering every object of class Chapter into a disctionary
        for sco in score:
            this_score = {}
            this_score["id"] = sco.id
            this_score["quiz_id"] = sco.quiz_id
            this_score["subject_id"] = sco.subject_id
            this_score["time_of_attempt"] = sco.time_of_attempt.strftime("%Y-%m-%d %H:%M:%S")
            this_score["score"] = sco.score
            this_score["rating"] = sco.rating
            score_jsons.append(this_score)
        if score_jsons:
            return score_jsons
        else:
            return {
                "message": "No socre found!"
            }, 404
    
    @auth_required('token')
    @roles_required('user')
    def post(self, quiz_id):
        args = score_parser.parse_args()
        quiz = Quiz.query.get(quiz_id)
        sub_id = quiz.subject_id
        time_of_attempt = datetime.strptime(args["time_of_attempt"], "%Y-%m-%d %H:%M:%S")
        try:
            score = Score(quiz_id = quiz_id,
                        subject_id = sub_id,
                        user_id = current_user.id,
                        time_of_attempt = time_of_attempt,
                        score = args["score"],
                        rating = args["rating"])

            db.session.add(score)
            db.session.commit()
            return {
                "message": "Score created successfully"
            }
        
        except:
            return {
                "message": "All fields are not provided"
            }, 400

api.add_resource(ScoreApi, '/api/score/get/<string:sub_quiz>/<int:id>', '/api/score/create/<int:quiz_id>')

class UserApi(Resource):
    @auth_required('token')
    @roles_required('admin')
    def get(self):
        users = [] # stores list of objects of class Chapter
        user_jsons = []
        users = User.query.all()
            
       
        for user in users:
            this_user = {}
            this_user["id"] = user.id
            this_user["email"] = user.email
            this_user["name"] = user.name
            this_user["qualification"] = user.qualification
            this_user["date_of_signup"] = user.date_of_signup.strftime("%Y-%m-%d")
            this_user["dob"] = user.dob.strftime("%Y-%m-%d")
            this_user["role"] = user.roles[0].name

            user_jsons.append(this_user)
        if user_jsons:
            return user_jsons
        else:
            return {
                "message": "No user found!"
            }, 404
        
api.add_resource(UserApi, '/api/user/get')