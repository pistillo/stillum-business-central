# Build stage
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /build
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests -P native 2>&1 | tail -20 || mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /build/target/quarkus-app/lib/   ./lib/
COPY --from=builder /build/target/quarkus-app/quarkus ./quarkus/
COPY --from=builder /build/target/quarkus-app/app/   ./app/
COPY --from=builder /build/target/quarkus-app/*.jar ./

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "quarkus-run.jar"]
