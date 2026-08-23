import { User } from "./api.js";

export async function Home() {
    let data = await User("login", "lastName", "firstName")
    history.pushState({}, "", `/${data.data.user[0].login}`); //=> Recurperation d username ds path "otalhaou"
    
    let main = document.getElementById('content');
    main.innerHTML = `
        <div class="dashboard">

            <header class="header">
                <div class="header-profile"></div>
                <div class="header-title"></div>
                <div class="header-datetime"></div>
            </header>


            <aside class="side-column left-column">
                <div class="card"></div>
                <div class="card"></div>
                <div class="card"></div>
            </aside>


            <section class="center-column">
                <div class="center-bottom">
                    <div class="card"></div>
                    <div class="card"></div>
                </div>
            </section>


            <aside class="side-column right-column">
                <div class="card"></div>
                <div class="card"></div>
                <div class="card"></div>
            </aside>

        </div>
    `;
}