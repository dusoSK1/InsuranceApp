# Použijeme Eclipse Temurin 21 ako base image
FROM eclipse-temurin:21-jdk-alpine

# Nastavíme pracovný adresár v konteineri
WORKDIR /app

# Skopírujeme Maven wrapper a POM z podpriečinka InsuranceApp-Backend
COPY InsuranceApp-Backend/mvnw mvnw
COPY InsuranceApp-Backend/mvnw.cmd mvnw.cmd
COPY InsuranceApp-Backend/.mvn .mvn
COPY InsuranceApp-Backend/pom.xml pom.xml

# Skopírujeme celý src kód
COPY InsuranceApp-Backend/src src

# Spustíme Maven build priamo v kontejnere
RUN ./mvnw clean package -DskipTests

# Skopírujeme výsledný JAR do finálneho spustiteľného súboru
COPY InsuranceApp-Backend/target/InsuranceApp-Backend-0.0.1-SNAPSHOT.jar app.jar

# Exponujeme port 8080
EXPOSE 8080

# Spustíme aplikáciu
ENTRYPOINT ["java","-jar","app.jar"]
