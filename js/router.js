import { GetData } from "./components/api.js";
import { Home } from "./components/home.js";
import { LoginHome } from "./components/login.js";

export async function router(path) {

    if (path == "/home") {
        const data = await GetData()
        Home(data)
    }else {
        LoginHome();
    }

   
}