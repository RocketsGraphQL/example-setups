describe('Checks if pages are visitable', () => {
    it('Visits the Signup page', () => {
      cy.visit('http://localhost:3000/signup')
    })
    it('Visits the Login page', () => {
        cy.visit('http://localhost:3000/login')
    })
})

// We don't have a todos table on Hasura, first create one

describe('Creates the todos table on the Hasura endpoint', () => {
    it('Creates the todos table', () => {
        cy.request({
            method: 'POST', 
            url: 'https://hasura-qlvtp9u.rocketgraph.app/v1/query',
            headers: {
                'Content-Type': 'application/json',
                'X-Hasura-Role': 'admin',
                'X-Hasura-Admin-Secret': 'myadminsecretkey',
            },
            body: {
                "type": "run_sql",
                "source": "postgres",
                "args": {
                  "source": "postgres",
                  "cascade": true,
                  "sql": "CREATE TABLE todos(id UUID NOT NULL DEFAULT gen_random_uuid(), name text, created_at TIMESTAMP DEFAULT now(), is_completed BOOLEAN DEFAULT false, PRIMARY KEY (id));"
                }
            }
        })
    })
    it('Tracks the todos table', () => {
        cy.request({
            method: 'POST', 
            url: 'https://hasura-qlvtp9u.rocketgraph.app/v1/query',
            headers: {
                'Content-Type': 'application/json',
                'X-Hasura-Role': 'admin',
                'X-Hasura-Admin-Secret': 'myadminsecretkey',
            },
            body: {
                "type":"bulk",
                "source":"postgres",
                "resource_version":2,
                "args":[
                    {
                        "type":"track_table",
                        "args":{
                            "table":{
                                "name":"todos",
                                "schema":"public"
                            },
                            "source":"postgres"
                        }
                    }
                ]
            }
        })
    })
})

// First check that features work with public profile

// Set the public profile using the Hasura API

describe('Creates a public role', () => {
    it('Create role: Public with insert permissions', () => {
        cy.request({
            method: 'POST', 
            url: 'https://hasura-qlvtp9u.rocketgraph.app/v1/query',
            headers: {
                'Content-Type': 'application/json',
                'X-Hasura-Role': 'admin',
                'X-Hasura-Admin-Secret': 'myadminsecretkey',
            },
            body: {
                "type" : "create_insert_permission",
                "source":"postgres",
                "args" : {
                    "table" : {
                        "name": "todos",
                        "schema": "public"
                    },
                    "source":"postgres",
                    "role" : "public",
                    "permission" : {
                        "check" : {
                            // "author_id" : "X-HASURA-USER-ID"
                        },
                        // "set":{
                        //     "id":"X-HASURA-USER-ID"
                        // },
                        "columns":["name","is_completed", "id", "created_at"]
                    }
                }
            }
        })
    })
    it('Create role: Public with select permissions', () => {
        cy.request({
            method: 'POST', 
            url: 'https://hasura-qlvtp9u.rocketgraph.app/v1/query',
            headers: {
                'Content-Type': 'application/json',
                'X-Hasura-Role': 'admin',
                'X-Hasura-Admin-Secret': 'myadminsecretkey',
            },
            body: {
                "type" : "create_select_permission",
                "source":"postgres",
                "args" : {
                    "table" : {
                        "name": "todos",
                        "schema": "public"
                    },
                    "source":"postgres",
                    "role" : "public",
                    "permission" : {
                        "check" : {
                            // "author_id" : "X-HASURA-USER-ID"
                        },
                        // "set":{
                        //     "id":"X-HASURA-USER-ID"
                        // },
                        "filter": {},
                        "columns":["name","is_completed", "id", "created_at"]
                    }
                }
            }
        })
    })
})


// Remove the public role usig the API


// Set the User profile

// Logout

// Login
