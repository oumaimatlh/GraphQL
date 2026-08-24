import { router } from "../router.js";
import { state } from "../state.js";
import { Authentification } from "./api.js";

export function LoginHome(){

    let main = document.getElementById('content');
    main.innerHTML =  `  
            <div class="left-content">
                <div class="graphql-title">
                    <h1>GraphQL</h1>
                    <p>Welcome Back — Sign In To Your Workspace </p>
                </div>
                                
                <div class="form-card">
                    <form id="form">
                        <div class="input-group">
                            <input type="text" name="identifier" id="identifier" placeholder=" " />
                            <label for="identifier">Username && Email </label>
                        </div>
                        <div class="input-group">
                            <input type="password" name="password" id="password" placeholder=" " />
                            <label for="password">Password </label>
                        </div>
                        <p id="error-message"></p>
                        <button type="submit" class="submit-btn" >Se connecter</button>
                    </form>
                </div>
            </div>

            <div class="spline-wrapper">
                <spline-viewer url="https://prod.spline.design/ooMQsUJXH5-lG0e1/scene.splinecode"></spline-viewer>
                <div class="hide-spline-logo"></div>
            </div>`;


     
    let form = document.getElementById("form");
    let error = document.getElementById('error-message')


    form.addEventListener("submit",async (event)=>{
        event.preventDefault();
        
        let data = new  FormData(form)

        let identifier = data.get("identifier") ; 
        let password = data.get("password") ;

        if (!identifier.trim() || !password.trim()) {
            error.textContent = "All fields are required."
            error.style.color = "red"
            return
        }

        let res =await  Authentification(identifier, password); 
        let body = await res.json()
        if (body.error) {
            error.textContent = body.error
            error.style.color = "red"
            return
        }
        
        localStorage.setItem('token', body)
        state.token = body
        router('/home')
    })


    const onChangeIdentifier = document.getElementById('identifier')
    const onChangePassword = document.getElementById('password')

    onChangeIdentifier.addEventListener('focus', ()=>error.textContent="")
    onChangePassword.addEventListener('focus', ()=>error.textContent="")

}