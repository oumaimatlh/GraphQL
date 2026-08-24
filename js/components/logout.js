import { router } from "../router.js";

export function Logout(){

    let logout = document.getElementById('logoutBtn')

    logout.addEventListener('click', ()=> {
        localStorage.removeItem('token')
        history.pushState({}, "", `/index.html`);
        router('/')
    })
}