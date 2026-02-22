# Changelog

All notable changes to the Stillum Business Portal project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup with microservices architecture
- Registry API for artifact management
- Publisher Service for artifact publishing
- Runtime Gateway for workflow execution
- Portal UI frontend application
- Docker Compose configuration for local development
- Kubernetes Helm charts for production deployment
- GitHub Actions CI/CD workflows
- Comprehensive documentation

### Changed

### Deprecated

### Removed

### Fixed

### Security

## [1.0.0] - 2024-02-22

### Added
- Initial release of Stillum Business Portal
- Registry API microservice
  - Artifact lifecycle management
  - Version control
  - Dependency management
  - Search and filtering
- Publisher Service
  - BPMN validation
  - DMN validation
  - Form validation
  - Artifact bundling
  - S3/MinIO integration
- Runtime Gateway
  - Workflow execution
  - Task management
  - Instance lifecycle
  - Temporal integration
- Portal UI
  - Dashboard
  - Artifact browser
  - Workflow monitoring
  - Task management interface
- Infrastructure
  - PostgreSQL database
  - MinIO object storage
  - Temporal workflow engine
  - Keycloak authentication
  - Docker Compose setup
- Deployment
  - Kubernetes Helm charts
  - Multi-environment values
  - Ingress configuration
  - RBAC templates
- CI/CD
  - GitHub Actions workflows
  - Automated testing
  - Docker image building
  - Helm chart packaging
  - Security scanning

[Unreleased]: https://github.com/stillum/business-portal/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/stillum/business-portal/releases/tag/v1.0.0
