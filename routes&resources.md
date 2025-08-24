# Here, the 'api' is added just to differentiate from FE routes - Vue routes (actual UI routes)

# routes for user related operation, resources(flask-restful) for transaction in sample project

# user based routes

/api/home - user dashboard
/api/admin - admin dashboard
/api/register - user registration

# APIs for admin
## CRUD on subject

/api/subject/get
/api/subject/create
/api/subject/update/<sub_id>
/api/subject/delete/<sub_id>

## CRUD on chapter

/api/chapter/get/<sub_id>
/api/chapter/create/<sub_id>
/api/chapter/update/<ch_id>
/api/chapter/delete/<ch_id>

## CRUD on quiz

/api/quiz/get/<ch_id>
/api/quiz/create/<ch_id>
/api/quiz/update/<quiz_id>
/api/quiz/delete/<quiz_id>

## CRUD on question

/api/question/get/<quiz_id>
/api/question/create/<quiz_id>
/api/question/update/<que_id>
/api/question/delete/<que_id>


/api/score/get/admin/<user_id>/sub/<id>

# APIs for user
## Score and reading quiz elements

/api/score/create/<user_id>/<quiz_id>
/api/score/get/user/<user_id>/quiz/<id> or /api/score/get/user/<user_id>/sub/<id>


GET of sub, ch, quiz - similar to admin, but different UI

We will implement FE through Vue CDN, this will need an entry point for the application 
Both FE and BE will run on the same origin (same Port, same protocol, same domain name or IP address)

When we want to show different components together in a page - simple component being rendered
When we want to replace the content with different component - as router (e.g: navigation bar)
Acivation of benv in WSL - Part 5, 00:31:00

The components folder in static folder will have the different scripts to render different html pages