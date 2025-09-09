# Použijeme Eclipse Temurin 21
FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

# Skopírujeme Maven wrapper a pom.xml
COPY mvnw .
COPY mvnw.cmd .
COPY .mvn .mvn
COPY pom.xml .

# Skopírujeme src priečinok
COPY src ./src

# Buildujeme JAR v kontejnere
RUN ./mvnw clean package -DskipTests

# Spustíme aplikáciu zo vygenerovaného JAR
ENTRYPOINT ["java", "-jar", "target/InsuranceApp-Backend-0.0.1-SNAPSHOT.jar"]

# Exponujeme port 8080
EXPOSE 8080
