# Data Models
from .database import db
from flask_security import UserMixin, RoleMixin
from datetime import datetime, date, time

# 1st Entity - user
class User(db.Model, UserMixin):
    __tablename__ = 'user' # If we do not define this, the model auto assigns name as lower case of class name
    id=db.Column(db.Integer,primary_key=True)
    email=db.Column(db.String, unique=True, nullable = False)
    name = db.Column(db.String, nullable = False)
    password = db.Column(db.String, nullable = False)
    fs_uniquifier = db.Column(db.String, unique = True, nullable = False) # used for creating tokens for the users for the access to the authorized end points 
    date_of_signup = db.Column(db.DateTime, default = datetime.now) # NEED TO CONFIRM on type
    qualification = db.Column(db.String)
    active = db.Column(db.Boolean, nullable = False)
    ######## NEED TO UDATE DOB ##################
    dob = db.Column(db.Date, nullable = False)
    
    # fav_sub1 = db.Column(db.String, db.ForeignKey('subject.id'), nullable = False)
    # fav_sub2 = db.Column(db.String, db.ForeignKey('subject.id'), nullable = False)
    
    #Defining backreference to enable parent to have access to all the children 
    score = db.relationship('Score', cascade = 'all, delete', backref = 'user', lazy = True)
    roles = db.relationship('Role', backref = 'user', secondary = 'users_roles')

# for flask-security, we need to have many-to-many relationship with users and roles 
class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String, unique = True, nullable = False)
    description = db.Column(db.String)

# many-to-many
class UsersRoles(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'))

# 2rd Entity - scores
class Score(db.Model):
    __tablename__ = 'score'
    id=db.Column(db.Integer,primary_key=True)
    user_id=db.Column(db.Integer,db.ForeignKey('user.id'), nullable = False)
    quiz_id=db.Column(db.Integer,db.ForeignKey('quiz.id'), nullable = False)
    subject_id=db.Column(db.Integer,db.ForeignKey('subject.id'), nullable = False)
    time_of_attempt = db.Column(db.DateTime, default = datetime.now)
    score = db.Column(db.Integer, nullable = False)
    rating = db.Column(db.Float, nullable = False, default = 5)
    flag_quiz = db.Column(db.Integer, default = 0) # Flagged - 1, not flagged - 0
    review = db.Column(db.String)


# 3rd Entity - question
class Question(db.Model):
    __tablename__ = 'question'
    id=db.Column(db.Integer,primary_key=True)
    quiz_id=db.Column(db.Integer,db.ForeignKey('quiz.id'), nullable = False)
    # question parts
    question_statement = db.Column(db.String, nullable = False)
    question_title = db.Column(db.String, nullable = False)
    option1 = db.Column(db.String, nullable = False)
    option2 = db.Column(db.String, nullable = False)
    option3 = db.Column(db.String, nullable = False)
    option4 = db.Column(db.String, nullable = False)
    answer = db.Column(db.String, nullable = False)


# 4th Entity - quiz
class Quiz(db.Model):
    __tablename__ = 'quiz'
    id=db.Column(db.Integer,primary_key=True)
    chapter_id=db.Column(db.Integer,db.ForeignKey('chapter.id'), nullable = False)
    subject_id= db.Column(db.Integer,db.ForeignKey('subject.id'), nullable = False)
   
    date_of_quiz = db.Column(db.Date, nullable = False)
    number_of_questions = db.Column(db.Integer, nullable = False)
    time_duration = db.Column(db.Time, nullable = False)
    description = db.Column(db.String, nullable = False)

    score = db.relationship('Score', cascade = 'all, delete', backref = 'quiz', lazy = True) 
    question = db.relationship('Question', cascade = "all, delete", backref = 'quiz', lazy = True)

# 5th Entity - chapter
class Chapter(db.Model):
    __tablename__ = 'chapter'
    id=db.Column(db.Integer,primary_key=True)
    subject_id= db.Column(db.Integer,db.ForeignKey('subject.id'), nullable = False)
    name = db.Column(db.String, nullable = False)
    description = db.Column(db.String, nullable = False)

    quiz = db.relationship('Quiz', cascade = 'all, delete', backref = 'chapter', lazy = True) 

# 6th Entity - subject
class Subject(db.Model):
    __tablename__ = 'subject'
    id=db.Column(db.Integer,primary_key=True)
    name = db.Column(db.String, unique = True, nullable = False)
    description = db.Column(db.String, nullable = False)

    chapter = db.relationship('Chapter', cascade = 'all, delete', backref = 'subject', lazy = True) 
    quiz = db.relationship('Quiz', cascade = 'all, delete', backref = 'subject', lazy = True)
    score = db.relationship('Score', cascade = 'all, delete', backref = 'subject', lazy = True)