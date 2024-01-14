# How to Start the Project 

1. Execute the following command in the project root: `mvn -DskipTests package`.
2. Fill in the `spring.mail.username` and `spring.mail.password` fields in the application.properties file of the `email-service`.
3. Set up Firebase authentication information in the `firebase_config.js` file located in the `frontend` folder. Current firebase config is just an example and thus not working.
4. Execute the following command in the project root to start all the container and the project: `docker-compose up`.
5. Project will start at `localhost:3000`.
