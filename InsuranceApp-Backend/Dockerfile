# Použijeme Eclipse Temurin 21 JDK ako base image
FROM eclipse-temurin:21-jdk-alpine

# Nastavíme pracovný adresár v konteineri
WORKDIR /app

# Skopírujeme Maven wrapper a POM, aby sme mohli buildnúť projekt
COPY mvnw mvnw
COPY mvnw.cmd mvnw.cmd
COPY .mvn .mvn
COPY pom.xml pom.xml

# Skopírujeme celý zdrojový kód
COPY src src

# Buildneme projekt v kontejnery (vytvorí target/...jar)
RUN ./mvnw clean package -DskipTests

# Skopírujeme výsledný JAR do finálneho spustiteľného súboru
COPY target/InsuranceApp-Backend-0.0.1-SNAPSHOT.jar app.jar

# Exponujeme port 8080
EXPOSE 8080

# Spustíme aplikáciu
ENTRYPOINT ["java","-jar","app.jar"]
