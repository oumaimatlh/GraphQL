export const query = `
  query {
      user :
          user {
            login
            firstName
            lastName
            events (limit:1) {
              cohorts {
                labelName
              }
            }
          }

      level :
          transaction (where: {_and:[ {eventId: {_eq:41}} {type:{_eq:"level"}}] }  limit:1 order_by:{amount:desc}) {
              amount
          }
  
      XP: 
          transaction_aggregate (where : {eventId: {_eq: 41} type: {_eq:"xp"}}){
            aggregate{
              sum{
                amount
              }
            }
          }

      xpModule :  
          transaction(where: { eventId: { _eq: 41 } type: { _eq: "xp" } object: {  type: { _eq: "project" } }}) 
          {
            amount
            object {
              attrs(path: "language")
            }
          }
  
      audit :  
        transaction(where: { type: { _in: ["up", "down"] } }) {
          user {
            auditRatio
          }
          type
          amount
        }
}
`;