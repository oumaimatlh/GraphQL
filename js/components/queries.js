export var queries = new Map()

queries.set('user', `
        query {
           user {
                id
                login
                firstName
                lastName
                events {
                    cohorts{
                      labelName
                    
                  }
                
                }
           }
        }
    `);

queries.set('level', ` query {transaction (where :{ _and: [
        { eventId: { _eq: 41 } }
        { type: { _eq: "level" } }
      ]}
  	limit : 1 
    order_by : {amount:desc}
  ) 
  {
    amount
    
  }}`);

queries.set('XP', `query {
    transaction_aggregate (where : {eventId: {_eq: 41} type: {_eq:"xp"}}) {
      aggregate{
        sum{
          amount
        }
      }
    }  }
`);

queries.set('Graph1',
`  query {
  transaction(
    where: {
      eventId: { _eq: 41 }
      type: { _eq: "xp" }
      object: {
        type: { _eq: "project" }
      }
    }
  ) {
    amount
    object {
      attrs(path: "language")
      name
    }
  }
}`

)

queries.set("audit", `
 query AuditQuery {
  transaction(where: { type: { _in: ["up", "down"] } }) {
    user {
      auditRatio
    }
    type
    object {
      name
    }
    amount
  }
}`)