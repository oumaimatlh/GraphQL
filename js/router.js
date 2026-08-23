import { Home } from "./components/home.js";
import { LoginHome } from "./components/login.js";

export function router(path) {

    if (path === "/" || path==="/index.html") {
        LoginHome();
    }else if (path === "/home") {
        Home()
    }
}