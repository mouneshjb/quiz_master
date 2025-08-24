export default{
    template: `
    <div class="row">
        <div class="col" style="height: 700px;">
            <div class="border mx-auto mt-5" style="height: 300px; width: 400px; background-color: rgba(75, 192, 192, 0.6);">
                <div>
                    <h2 class="text-center">Login Form</h2>
        
                    <div class="mb-3">
                            <label for="email" class="form-label">E-Mail ID</label>
                            <input type="email" class="form-control" v-model="formData.email" id="email" placeholder="iitm@study.ac.in">
                        </div>
                        <div class="mb-3">
                            <label for="password" class="form-label">Password</label>
                            <input type="password" class="form-control" v-model="formData.password" id="password" placeholder="password">
                        </div>
                    <div style="text-align: center;">
                        <button class="btn btn-primary" @click="login"> Login </button>
                        <p style="color: red;">{{message}}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>`,
    data: function(){
        return {
            // creating a data object to club both email and password
            formData: {   
            email: "",
            password: ""
            },
            message: ""
        }
    },
    methods: {
        login: function(){
            fetch('/api/login', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json' // defined content-type
                },
                body: JSON.stringify(this.formData) //formData is an object. When we are sending this body to BE, BE assumes the data in the body is a string, and try to convert
                // it to JSON, so the information has to go as JSON-string
                // in the BE, request.get_json() - this needs a JSON-string, and it converts it to JSON object
            })
            // fetch() gives a promise, we resolve it using '.then'
            // fetch() is an asynch operation, so it always returns a promise, we resolve promise using '.then'
            .then(response => response.json()) //whatever the value that the promise returns will be caught and stored in the variable 'reponse'
            // in the request (fetch), we specified how should the data go to BE, in '.then', we mention how should the data be received 
            // above '.then' gives a fulfilled promise, if we log response, it gives nothing useful, hence to use the data recived,
            // we converted response to json by response.json(), when we did this, it again returns a promise
            // to catch the data given by this promise we use another .then 
            // response.json() itself (the resolve response itself) sends another promise, so we use another '.then()'
            // .then(data => console.log(data)) 
            .then(data => {
                // console.log(Object.keys(data))
                if (Object.keys(data).includes("auth-token")){
                    localStorage.setItem('user', JSON.stringify(data))
                    localStorage.setItem("auth_token", data['auth-token']) // we need to store the data recieved somewhere so that all the end points can access
                    localStorage.setItem("user_id", data["id"]) //localStorage is JS object, stored in the browser
                    localStorage.setItem("username", data["name"]) //localstorage is created by FE (as other end points need for authetication) and cookie session is created by BE
                    localStorage.setItem("role", data["role"])
                    this.$store.commit('setUser')
                    if (data["role"] == 'admin'){
                        this.$router.push('/admin_dashboard')
                    }
                    else{
                        this.$router.push('/user_dashboard') // similar to redirect('/dashboard') in flask 
                    }
            }
             else{
                this.message = data.message
             } 
            }) 
            // we can use reponse.status for error handling also with status code

        }
    }
}