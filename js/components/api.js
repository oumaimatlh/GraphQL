import { state } from "../state.js";
import { queries } from "./queries.js";

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
    
   return response
};


export async function GetData(typeQuery) {
     let data = await fetch(API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${state.token}`
        },
        body: JSON.stringify(
            {
                query : queries.get(typeQuery)
            }
        )
    })
    data = await data.json()
    return data 
}