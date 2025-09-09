# Použijeme Eclipse Temurin 21 ako base image
FROM eclipse-temurin:21-jdk-alpine

# Nastavíme pracovný adresár v konteineri
WORKDIR /app

# Skopírujeme JAR súbor z target priečinka
COPY target/*.jar app.jar

# Exponujeme port 8080 (ak tvoj Spring Boot beží tu)
EXPOSE 8080

# Spustíme aplikáciu
ENTRYPOINT ["java","-jar","app.jar"]
