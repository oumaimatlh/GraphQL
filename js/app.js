import { router } from "./router.js";

function app() {
  const path = window.location.pathname;
  router(path);
}
app();
