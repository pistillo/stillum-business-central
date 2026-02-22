# Build stage
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /build
# Cache dependencies first
COPY pom.xml .
RUN mvn dependency:go-offline -q || true
COPY src ./src
RUN mvn clean package -DskipTests -Dquarkus.package.jar.type=fast-jar

# Run stage
FROM eclipse-temurin:21-jre-alpine
RUN apk add --no-cache curl
WORKDIR /app
COPY --from=builder /build/target/quarkus-app/lib/ ./lib/
COPY --from=builder /build/target/quarkus-app/*.jar ./
COPY --from=builder /build/target/quarkus-app/app/ ./app/
COPY --from=builder /build/target/quarkus-app/quarkus/ ./quarkus/

EXPOSE 8080
ENV JAVA_OPTS="-Xmx512m -Xms256m"
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar quarkus-run.jar"]
