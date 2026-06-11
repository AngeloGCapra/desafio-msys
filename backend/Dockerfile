# ----- Stage 1: build -----
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app

# Cache de dependencias: copia o pom primeiro
COPY pom.xml .
RUN mvn -B dependency:go-offline

# Copia o codigo e empacota (pula testes no build da imagem)
COPY src ./src
RUN mvn -B clean package -DskipTests

# ----- Stage 2: runtime -----
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
