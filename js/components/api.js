import { router } from "../router.js";
import { query } from "./query.js";

const LOGIN = "https://learn.zone01oujda.ma/api/auth/signin";
const API = "https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql";

export async function Authentification(identifier, password){
    const credentials = btoa(`${identifier}:${password}`);
    const response = await fetch(LOGIN, {
        method: "POST",
        headers: {
            "Authorization": `Basic ${credentials}`
        }
    });
   return response;
};
export async function GetData() {
     let data = await fetch(API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(
            {
                query
            }
        )
    });
    data = await data.json();

    if (data.errors) {
        localStorage.removeItem('token');
        router('/');
        return 
    }
    return data ;
}