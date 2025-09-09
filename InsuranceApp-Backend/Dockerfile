# Použijeme Eclipse Temurin 21 ako base image
FROM eclipse-temurin:21-jdk-alpine

# Nastavíme pracovný adresár v konteineri
WORKDIR /app

# Skopírujeme JAR súbor z target priečinka
COPY InsuranceApp-Backend/target/InsuranceApp-Backend-0.0.1-SNAPSHOT.jar app.jar

# Exponujeme port 8080
EXPOSE 8080

# Spustíme aplikáciu
ENTRYPOINT ["java", "-jar", "app.jar"]
