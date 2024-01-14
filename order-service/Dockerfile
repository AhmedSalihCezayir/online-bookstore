# Use an official OpenJDK runtime as a parent image
FROM openjdk:17-oracle

# Set the working directory in the container
WORKDIR /app

# Copy the application JAR file into the container
COPY target/order-service-1.0-SNAPSHOT.jar .

# Copy the CSV file into the container
COPY src/main/resources/books.csv ./src/main/resources/books.csv

# Expose the port that your Spring Boot app will run on
EXPOSE 8080

# Define the command to run your Spring Boot application
CMD ["java", "-jar", "order-service-1.0-SNAPSHOT.jar"]