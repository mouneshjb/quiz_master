export default{
    template: `
    <div class="row">
        <div class="col" style="height: 700px;">
            <div class="border mx-auto mt-5" style="height: 550px; width: 400px; background-color: rgba(75, 192, 192, 0.6);">
               
                    <h2 class="text-center">Registration Form</h2> 
                     <div style="margin-top: 30px;">
                        <div class="mb-3">
                            <label for="email" class="form-label">E-Mail ID</label>
                            <input type="email" class="form-control" v-model="formData.email" id="email" placeholder="iitm@study.ac.in">
                        </div>
                        <div class="mb-3">
                            <label for="password" class="form-label">Password</label>
                            <input type="password" class="form-control" v-model="formData.password" id="password" placeholder="password">
                        </div>
                        <div class="mb-3">
                            <label for="name" class="form-label">Full name</label>
                            <input type="text" class="form-control" v-model="formData.name" id="name" placeholder="Mounesh">
                        </div>
                        <div class="mb-3">
                            <label for="dob" class="form-label">Date of Birth (YYYY-MM-DD)</label>
                            <input type="text" class="form-control" v-model="formData.dob" id="dob" placeholder="2000-01-01">
                        </div>
                        <div class="mb-3">
                            <label for="qualification" class="form-label">Qualification</label>
                            <input type="text" class="form-control" v-model="formData.qualification" id="qualification" placeholder="Bachelors">
                        </div>
                    <div style="text-align: center;">
                        <button class="btn btn-primary" @click="register"> Register </button>
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
            password: "",
            name: "",
            dob: "",
            qualification: ""
            }
     
        }
    },
    methods: {
        register: function(){
            fetch('/api/register', {
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
            // to catch the data given by this promis we use another .then 
            // response.json() itself (the resolve response itself) sends another promise, so we use another '.then()'
            // .then(data => console.log(data)) 
            .then(data => {
                alert(data.message)
                this.$router.push('/login')
            }) 

        }
    }
}