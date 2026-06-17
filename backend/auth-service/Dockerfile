# ══════════════════════════════════════════════════════════════════════
#  Spring Boot Multi-Stage Dockerfile  (Java 17 / Maven)
#  This file is IDENTICAL for all Spring Boot microservices.
#  Place it in the root of each service folder (next to pom.xml).
# ══════════════════════════════════════════════════════════════════════

# ── Stage 1: Build ────────────────────────────────────────────────────
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Copy pom.xml first and download dependencies.
# This layer is cached unless pom.xml changes — fast rebuilds.
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build the executable JAR (skip tests for speed)
COPY src ./src
RUN mvn package -DskipTests -B

# ── Stage 2: Run ──────────────────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Security best-practice: run as a non-root user
RUN addgroup -S spring && adduser -S spring -G spring

# Copy the JAR produced by Stage 1
COPY --from=build /app/target/*.jar app.jar

USER spring

ENTRYPOINT ["java", "-jar", "app.jar"]
