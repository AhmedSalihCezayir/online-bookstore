# Use an official OpenJDK runtime as a parent image
FROM openjdk:17-oracle

# Set the working directory in the container
WORKDIR /app

# Copy the application JAR file into the container
COPY target/email-service-1.0-SNAPSHOT.jar .

# Expose the port that your Spring Boot app will run on
EXPOSE 8081

# Define the command to run your Spring Boot application
CMD ["java", "-jar", "email-service-1.0-SNAPSHOT.jar"]