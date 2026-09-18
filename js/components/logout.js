import { router } from "../router.js";

export function Logout(){
    const logout = document.getElementById('logoutBtn')
    logout.addEventListener('click', ()=> {
        localStorage.removeItem('token') 
        router('/')
    });
};