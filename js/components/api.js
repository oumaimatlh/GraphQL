import { router } from "../router.js";
import { query } from "./query.js";

var LOGIN = "https://learn.zone01oujda.ma/api/auth/signin";
var API = "https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql";

export async function Authentification(identifier, password){
    let credentials = btoa(`${identifier}:${password}`);

    let response = await fetch(LOGIN, {
        method: "POST",
        headers: {
            "Authorization": `Basic ${credentials}`
        }
    });
    console.log('login', response)
   return response
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
    })
    data = await data.json()
    console.log('data', data)
    if (data.errors) {
        localStorage.removeItem('token')
        router('/')
        return 
    }
    return data 
}