import { GetData } from "./api.js";
import { Logout } from "./logout.js";

export async function Home() {

    let user = await GetData('user');
    let level = await GetData('level');
    let xPtotal = await GetData('XP') ;

    
    user = user.data.user[0];
    level = level.data.transaction[0].amount;
    xPtotal = xPtotal.data.transaction_aggregate.aggregate.sum.amount;
    xPtotal = Math.round(xPtotal / 1000); 


    //Premiere Graph 

    let data = await GetData('Graph1')
    console.log(data)

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
                    <span class="brand-badge">${user.login}</span>
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
                <!-- Carte Level HUD Élégante -->
                <div class="card level-card-v2">
                    <div class="level-card-header">
                        <div class="level-icon-wrapper">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00f2fe" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                        </div>
                        <span class="level-badge-tag">RANK PROGRESS</span>
                    </div>

                    <div class="level-card-content">
                        <span class="level-sub-title">CURRENT LEVEL</span>
                        <div class="level-display">
                            <span class="level-number">${level}</span>
                        </div>
                    </div>

                    <div class="level-progress-wrapper">
                        <div class="level-progress-bar" style="width: 70%;"></div>
                    </div>
                </div>

                <div class="card xp-card-v2">
                    <div class="xp-card-header">
                        <div class="xp-icon-wrapper">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff0080" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                            </svg>
                        </div>
                        <span class="xp-badge-tag">Event 41</span>
                    </div>

                    <div class="xp-card-content">
                        <span class="xp-sub-title">CUMULATIVE XP</span>
                        <div class="xp-display">
                            <span class="xp-number">${xPtotal}</span>
                            <span class="xp-unit">kB</span>
                        </div>
                    </div>

                    <div class="xp-progress-wrapper">
                        <div class="xp-progress-bar" style="width: 85%;"></div>
                    </div>
                </div>

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

    Logout();
}

