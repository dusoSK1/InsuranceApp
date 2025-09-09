# Použijeme Eclipse Temurin 21 JDK ako base image
FROM eclipse-temurin:21-jdk-alpine

# Nastavíme pracovný adresár v kontejnere
WORKDIR /app

# Skopírujeme Maven wrapper a POM zo správneho podadresára
COPY InsuranceApp-backend/InsuranceApp-Backend/mvnw mvnw
COPY InsuranceApp-backend/InsuranceApp-Backend/mvnw.cmd mvnw.cmd
COPY InsuranceApp-backend/InsuranceApp-Backend/.mvn .mvn
COPY InsuranceApp-backend/InsuranceApp-Backend/pom.xml pom.xml

# Skopírujeme celý zdrojový kód
COPY InsuranceApp-backend/InsuranceApp-Backend/src src

# Spustíme Maven build priamo v kontejnere
RUN ./mvnw clean package -DskipTests

# Skopírujeme výsledný JAR do finálneho spustiteľného súboru
COPY InsuranceApp-backend/InsuranceApp-Backend/target/InsuranceApp-Backend-0.0.1-SNAPSHOT.jar app.jar

# Exponujeme port 8080
EXPOSE 8080

# Spustíme aplikáciu
ENTRYPOINT ["java","-jar","app.jar"]
