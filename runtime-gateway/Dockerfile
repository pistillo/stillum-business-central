# ─── Build stage ────────────────────────────────────────────────────────────
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /build
COPY . .
RUN mvn package -DskipTests -q

# ─── Runtime stage ──────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /build/target/quarkus-app/ ./
# Runtime-gateway usa la porta Quarkus di default (8080 interno),
# mappata a 8083 sull'host tramite docker-compose.full.yml
EXPOSE 8080
CMD ["java", "-jar", "quarkus-run.jar"]
