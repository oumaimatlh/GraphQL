import { User } from "./api.js";
import { Logout } from "./logout.js";

export async function Home() {

    let data = await User("id", "login", "lastName", "firstName");
    console.log(data.data.user[0].id)
    const user = data.data.user[0];
    history.pushState({}, "", `/${user.login}`);
    
    let main = document.getElementById('content');
    main.innerHTML = `
        <div class="dashboard">

            <header class="header">
                <div class="header-profile">
                    <div class="avatar">${user.firstName.charAt(0).toUpperCase()}</div>
                    <div class="user-info">
                        <span class="welcome-text">Welcome</span>
                        <span class="user-name">${user.firstName} ${user.lastName}</span>
                    </div>
                </div>

                <div class="header-title">
                    <span class="brand-badge">${user.login} </span>
                </div>

                <div class="header-actions">
                    <div class="status-indicator">
                        <span class="dot"></span> Online
                    </div>
                    <button id="logoutBtn">
                        <span>Log Out</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                    </button>
                </div>
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

    Logout()
    
}

function LevelUser(){

}
