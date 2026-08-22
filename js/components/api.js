import { state } from "../state";

var API = "https://learn.zone01oujda.ma/api/auth/signin"

export async function Authentification(identifier, password){

    //Basic Authentication (c 'est une maniere d' envoyer un username/email + password)
    /**
        Authorization: Basic XXXXX 
                Basic => les infos d 'auth sont encodées en Base64

    */
    let credentials = btoa(`${identifier}:${password}`);

    let response = await fetch(API, {
        method: "POST",
        headers: {
            "Authorization": `Basic ${credentials}`
        }
    });
   return response
};


export async function User(...attrbs){
    let query = `
        query {
           User {
                
           }
        }
    `
    let data = await fetch(API, {
        method: "GET",
        headers: {
            "Content-Type": 'application/json',
            "Authorization" : `Bearer ${state.token}`
        },
        body : JSON.stringify({
            query
        })
    })
}