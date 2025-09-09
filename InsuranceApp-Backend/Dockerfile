# Použijeme Eclipse Temurin 21 ako base image
FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

# Skopírujeme Maven wrapper a POM
COPY mvnw mvnw
COPY mvnw.cmd mvnw.cmd
COPY .mvn .mvn
COPY pom.xml pom.xml
COPY src src

# Build projektu
RUN ./mvnw clean package -DskipTests

# Premenujeme výsledný JAR priamo z target/
RUN cp target/InsuranceApp-Backend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]
