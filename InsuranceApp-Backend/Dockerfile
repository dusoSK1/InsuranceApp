# 1. fáza: build projektu
FROM eclipse-temurin:21-jdk-alpine AS build

# Nastavíme pracovný adresár
WORKDIR /app

# Skopírujeme Maven súbory
COPY pom.xml mvnw ./
COPY .mvn .mvn

# Stiahne závislosti (cache layer)
RUN ./mvnw dependency:go-offline -B

# Skopírujeme celý projekt
COPY src src

# Vytvoríme JAR súbor
RUN ./mvnw clean package -DskipTests

# 2. fáza: runtime
FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

# Skopírujeme JAR z build fázy
COPY --from=build /app/target/*.jar app.jar

# Exponujeme port
EXPOSE 8080

# Spustíme aplikáciu
ENTRYPOINT ["java", "-jar", "app.jar"]
