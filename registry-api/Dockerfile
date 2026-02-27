# ─── Build stage ────────────────────────────────────────────────────────────
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /build
COPY . .
RUN mvn package -DskipTests -q

# ─── Runtime stage ──────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /build/target/quarkus-app/ ./
EXPOSE 8081
CMD ["java", "-jar", "quarkus-run.jar"]
