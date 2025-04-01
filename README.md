# rest-api-project
At a high-level, you need to build a web application using the decoupled client-server architecture:

A server application with a REST API
A web browser application

BUILD A REST API THAT INCLUDES :
Node.js
Express.js
Caddy
MongoDB/Mongoose
JWT

You should also demonstrate use of tools like:

npm
VSCode
Hoppscotch

ARCHITECTURE
├── API-collection.json
├── README.md
├── package.json
├── server.js
└── src
    ├── controllers
    │   └── ...
    ├── middleware
    │   └── ...
    ├── models
    │   └── ...
    └── routes
        ├── index.js
        └── ...

Use Express to implement the REST API.

To a large extent, this core task is about implementing code in src/routes.


Three entities, each with five endpoints:
Get all
Get by ID
Create
Update
Delete
Be sure to:

Take advantage of nested routers.
Use the appropriate HTTP methods (GET, POST, PUT, DELETE).
Respond with appropriate status codes (e.g., 200 OK, 404 Not Found).
Implement/use appropriate middleware.
Be sure to list the endpoints in the README.md file.

Use Mongoose to implement the data model and database interface.

To a large extent, this core task is about implementing code in src/models.

You do not need to draw a diagram of the data model, however, having one may benefit you.

Be sure to implement Mongoose schemas and models, with the consideration for:

Having references between schemas.

Having at least two one-to-many or many-to-many relationships in the data model.

Using a "controller" architecture, connect the API endpoints to the data model, and implement any useful business logic.

To a large extent, this core task is about implementing code in src/controllers.

For each entity in your data model, be sure there is a relevant CRUD operation.

Demonstrate your application running on the internet. Be sure to configure Caddy to direct incoming traffic to the application.

Choose an API URL like https://<student-id>.ifn666.com/assessment02/api.

Provide us a copy of /etc/caddy/Caddyfile at the root of your submission.

Test your API using Hoppscotch, or a similar tool. Be sure to demonstrate your use of Hoppscotch (or alike) in the video and submit the collection as a JSON file (API-collection.json).

-You may implement user authentication with JSON web tokens (JWT).

-Be sure to have endpoints for:

-Registering a new user (at minimum: username, password)
-Login as existing user
-Some features of your API must be protected by the authentication process. For example, "get all" routes might only be available to authenticated users, or personal data can be fetched by only those it belongs to.


-You may implement user-input validation. Be sure to explain the purpose of the validation and how you handle erroneous input.
If you are attempting this task, make sure to also complete the corresponding task in the web application section.

-You may implement additional security features to your API, for example, with Helmet. Authentication with JWT is not considered a part of this additional feature. Be sure to explain why the security features you are using are useful.
