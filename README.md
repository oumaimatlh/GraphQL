# GraphQL
### Différence entre API REST && GraphQL :
* OverFetching : 
    Le serveur envoie des données que le front ne le utilise pas, Mais via GraphQL client demande exactement les champs nécessaire 
* Via Rest on a plusieurs routes cepandant GraphQL envoie la requete ds le corps de la requete HTTP
    ex:
        {
            "query": "{ user(id: 5) { id nickname } }"
        }

* Au niveau d méthode en REST : Méthodes HTTP; GraphQL: Query et Mutation

### GraphQL :
* Schema: le Schema qui décrit tous les objets disponibles
* Type: la forme d'un Objet
* Query: GET des données 
* Mutation : Créer, Modifier, Supp des données 
* Resolver : Le code qui récupere reellement les données (Back-End)

#### SCHEMA:
    représente les objets disponibles : Champs => Type CH => données qu'on peut lire => Les opération qu'on peut effectuer .
            Ex: 
                type User {
                    id: ID!
                    nickname: String!
                    email: String!
                    age: Int
                }
                ! =>  champ Obligatoire : Not Null

#### Query (Get des données )
    DS schema 
        type Query {
            users: [User!]!
        }
            Une opération appl users qui retourne une liste d"utilisateurs 
            query {
                users {
                    id
                    nickname
                }
            }
        
        [User!]! => 
            [User] => liste d'utilisateurs peut etre NUll
            [User!]=> chaque élément de la liste ne peut pas être null mais la liste peut etre null => [User, null, User] (Invalid)
            [User!]! => ni les items ni la liste doit etre Not Null

#### Mutation (Modifier des données)

Type Mutation {
    CreatePost(title: String!, content:String!): Post!
}

Front envoie : 
    mutation {
    createPost(
        title: "Apprendre GraphQL"
        content: "Je commence GraphQL aujourd'hui."
    ) {
        id
        title
    }
    }

    Apre la creation  dpost le serveur renvoie id et title 
        ...

#### Resolver (Back-End):
    Schema GraphQL lié au resolver
    


#### SPA 
Single Page Application :
    une seul Page HTML => js qui va changer le contenu 
                index.html
                   │
                   ▼
                 app.js
                   │
          ┌────────┼────────┐
          ▼        ▼        ▼
       /profile  /projects  /skills
          │        │        │
          ▼        ▼        ▼
       render()  render()  render()