# ---- Dev stage ----
FROM eclipse-temurin:21-jdk-jammy AS dev
WORKDIR /app
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN ./mvnw dependency:go-offline -B
COPY src/ src/
EXPOSE 8080
CMD ["./mvnw", "spring-boot:run", "-Dspring-boot.run.fork=false"]

# ---- Build stage ----
FROM dev AS build
RUN ./mvnw package -DskipTests -B

# ---- Runtime stage ----
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
