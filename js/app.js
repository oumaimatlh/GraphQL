import { router } from "./router.js";

function app(){
    let path = window.location.pathname
    router(path)
}
app();