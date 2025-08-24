// multiple end points - /login, /register etc.
// every route will be an object
import Home from './pages/home.js'
import Login from './pages/login.js'
import Register from './pages/register.js'
import Navbar from './components/navbar.js'
import Footer from './components/footer.js'

import AdminDashboard from './pages/admin_dashboard.js'
import QuizDashboard from './pages/admin_quiz_dashboard.js'
import SummaryStats from  './pages/admin_summary.js'
import SearchResults from  './pages/admin_search.js'

import UserDashboard from './pages/user_dashboard.js'
import UserQuiz from './pages/user_quiz.js'
import UserScore from './pages/user_score.js'
import UserSummary from './pages/user_summary.js'
import UserSearch from './pages/user_search.js'
import QuizPage from './pages/quiz_page.js'

import store from "./utils/store.js"


const routes = [
    {path: '/', component: Home},
    {path: '/login', component: Login},
    {path: '/register', component: Register},
    {path: '/admin_dashboard', component: AdminDashboard, meta : {requiresLogin : true, role : "admin"}},
    {path: '/admin/quiz_dashboard', component: QuizDashboard, meta : {requiresLogin : true, role : "admin"}},
    {path: '/admin/summary', component: SummaryStats, meta : {requiresLogin : true, role : "admin"}},
    {path: '/admin/search', component: SearchResults, meta : {requiresLogin : true, role : "admin"}},
    {path: '/user_dashboard', component: UserDashboard, meta : {requiresLogin : true}},
    {path: '/user/quiz', component: UserQuiz, meta : {requiresLogin : true}},
    {path: '/user/score', component: UserScore, meta : {requiresLogin : true}},
    {path: '/user/summary', component: UserSummary, meta : {requiresLogin : true}},
    {path: '/user/search', component: UserSearch, meta : {requiresLogin : true}},
    {path: '/user/quiz_page/:quiz_id', component: QuizPage, meta : {requiresLogin : true}},

]

const router = new VueRouter({
    routes // route: route
})

// navigation guards
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresLogin)) {
        if (!store.state.loggedIn) {
            return next('/login'); // Use return to stop execution
        }

        if (to.meta.role && to.meta.role !== store.state.role) {
            alert('Role not authorized');
            return next('/'); // Stop execution after redirect
        }
    }

    next(); // Call next() only once
});


const app = new Vue({
    el: "#app",
    router, // router: router
    store,
    template: `
    <div class="container">
        <nav-bar></nav-bar>
        <router-view></router-view>
        <foot></foot>
    </div>
    `,
    data: {
        section: "Frontned"
    },
    components: {
        "nav-bar": Navbar, // if '-' is present in key, we need "" around key
        "foot": Footer
    }
})