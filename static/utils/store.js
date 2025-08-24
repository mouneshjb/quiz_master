// when we refresh, it goes back to the default state of Vuex
const store = new Vuex.Store({
    state: {
        // similar to component data
        auth_token: null,
        role: null,
        loddedIn: false,
        user_id: null,
        name: null,
        searchCategory: "",
        searchQuery: "",
        chapters: {},
        quiz_id: null,
        subject_id: null,
        editSubject: null,
        quizes_obj: {},
        subject_for_user_quiz: "",
        current_quiz: "",
        user_chapters: [],
    },
    mutations: {
        // methods to change the state
        setUser(state){
            try{
                if (JSON.parse(localStorage.getItem('user'))){
                   const user = JSON.parse(localStorage.getItem('user'));
                   state.auth_token = user['auth-token'];
                   state.role = user.role;
                   state.name = user.name;
                   state.loggedIn = true;
                   state.user_id = user.id;
                }
               } catch {
                   console.warn('not logged in')
           }         
        },
        logout(state){
            state.auth_token = null;
            state.role = null;
            state.loggedIn = false;
            state.user_id = null;

            localStorage.removeItem('user')
            localStorage.removeItem('dashboardReloaded')
        },
        updateSearchCategory(state, category) {
            state.searchCategory = category;
          },
          updateSearchQuery(state, query) {
            state.searchQuery = query;
          },
          updateChapters(state, chapters){
            state.chapters = chapters;
          },
          updateQuizId(state, quiz_id){
            state.quiz_id = quiz_id;
          },
          updateSubjectId(state, subject_id){
            state.subject_id = subject_id;
          },
          updateEditSubject(state, subject){
            state.editSubject = subject;
          },
          updateQuizesObj(state, quizes){
            state.quizes_obj = quizes;
          },
          updateSubjectforUserQuiz(state, subject){
            state.subject_for_user_quiz = subject;
          },
          updateCurrentQuiz(state, current_quiz){
            state.current_quiz = current_quiz;
          },
          updateUserChapters(state, chapters){
            state.user_chapters = chapters;
          },
    },
    actions: {
        // can be async
    }
}) 

//when browser refreshes
store.commit('setUser')

export default store;