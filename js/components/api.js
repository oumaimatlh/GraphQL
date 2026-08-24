import { state } from "../state.js";

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


export async function User(...args){
    let query = `
        query {
           user {
                ${args.join('\n')}
           }
        }
    `
    let res = await fetch(API, {
        method: "POST",
        headers: {
            "Content-Type": 'application/json',
            "Authorization" : `Bearer ${state.token}`
        },
        body : JSON.stringify({
            query
        })
    })

    let data = await res.json()
    console.log(data)
    return data
}

const query =  ` transaction (where :{ _and: [
        { eventId: { _eq: 41 } }
        { type: { _eq: "level" } }
      ]}
  	limit : 1 
    order_by : {amount:desc}
  ) 
  {
    amount
    
  }`
export function Transaction(){
    
}