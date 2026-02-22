# Contributing to Stillum Business Portal

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the Stillum Business Portal project.

## Code of Conduct

- Be respectful and inclusive
- Focus on the code, not the person
- Help others learn and grow
- Report inappropriate behavior to team@stillum.com

## Getting Started

### Prerequisites
- Java 21
- Node.js 20+
- Docker & Docker Compose
- Git

### Setup Development Environment

1. Fork the repository
2. Clone your fork:
```bash
git clone https://github.com/your-username/business-portal.git
cd business-portal
```

3. Add upstream remote:
```bash
git remote add upstream https://github.com/stillum/business-portal.git
```

4. Create development branch:
```bash
git checkout -b feature/your-feature-name
```

5. Start infrastructure:
```bash
docker-compose up -d
```

## Development Workflow

### Branching Strategy

- `main` - Production releases (protected)
- `develop` - Integration branch
- Feature branches: `feature/description`
- Bug fixes: `bugfix/description`
- Hotfixes: `hotfix/description`

### Commit Messages

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test additions/updates
- `chore`: Build, dependencies, config changes

**Examples:**
```
feat(publisher): add artifact validation for BPMN

Implement comprehensive BPMN XML validation including:
- Structure validation
- Required element checks
- ID attribute validation

Closes #123
```

```
fix(runtime-gateway): correct workflow instance status update

The status was not being updated correctly after task completion.
Now properly transitions through workflow states.

Fixes #456
```

### Code Style

#### Java
- Follow [Google Java Style Guide](https://google.github.io/styleguide/javaguide.html)
- Use 4-space indentation
- Max line length: 120 characters
- Use meaningful variable names
- Add Javadoc comments for public methods

```java
/**
 * Validates BPMN XML content.
 *
 * @param xml the BPMN XML string to validate
 * @return ValidationResult containing validity status and errors
 */
public ValidationResult validateBpmn(String xml) {
    // Implementation
}
```

#### JavaScript/TypeScript
- Use Prettier for formatting
- Use ESLint for linting
- Use 2-space indentation
- Max line length: 100 characters
- Use descriptive variable names
- Add JSDoc comments for functions

```javascript
/**
 * Fetches artifact from registry.
 *
 * @param {string} artifactId - The artifact identifier
 * @param {string} version - The artifact version
 * @returns {Promise<Artifact>} The artifact data
 */
async function getArtifact(artifactId, version) {
  // Implementation
}
```

### Testing

#### Backend Tests

Write tests for all public methods:

```bash
cd registry-api
mvn test

# Test specific class
mvn test -Dtest=ArtifactServiceTest

# Test specific method
mvn test -Dtest=ArtifactServiceTest#testCreateArtifact
```

#### Frontend Tests

```bash
cd portal-ui
npm test

# Run in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

#### Test Coverage

- Aim for >80% code coverage
- Test happy paths and error cases
- Use meaningful test names

```java
@Test
public void shouldValidateBpmnWithCorrectStructure() {
    // Arrange
    String validBpmn = "<bpmn:process id='test'>...</bpmn:process>";
    
    // Act
    ValidationResult result = validationService.validateBpmn(validBpmn);
    
    // Assert
    assertTrue(result.isValid());
}

@Test
public void shouldRejectBpmnWithoutProcessId() {
    // Arrange
    String invalidBpmn = "<bpmn:process>...</bpmn:process>";
    
    // Act
    ValidationResult result = validationService.validateBpmn(invalidBpmn);
    
    // Assert
    assertFalse(result.isValid());
}
```

## Submitting Changes

### Before Submitting

1. Update your branch with latest develop:
```bash
git fetch upstream
git rebase upstream/develop
```

2. Run tests:
```bash
# Backend
for svc in registry-api publisher runtime-gateway; do
  cd $svc && mvn clean test && cd ..
done

# Frontend
cd portal-ui && npm test && cd ..
```

3. Check code quality:
```bash
# Java linting with checkstyle (if configured)
mvn checkstyle:check

# JavaScript linting
cd portal-ui && npm run lint && cd ..
```

4. Build the application:
```bash
docker-compose build
```

5. Test with Docker Compose:
```bash
docker-compose up -d
# Run manual tests
docker-compose down
```

### Creating a Pull Request

1. Push to your fork:
```bash
git push origin feature/your-feature-name
```

2. Create PR on GitHub with:
   - Clear title and description
   - Reference to related issues: "Fixes #123"
   - List of changes
   - Screenshots/demos if applicable

3. PR Template:
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Fixes #123

## Testing
- [ ] Unit tests added
- [ ] Integration tests added
- [ ] Manual testing done

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests pass locally
```

## Code Review Process

### For Reviewers
- Be constructive and respectful
- Focus on code quality, not personal style
- Approve when satisfied
- Request changes if needed

### For Contributors
- Respond to comments promptly
- Ask for clarification if needed
- Update code based on feedback
- Re-request review after changes

## Documentation

### When to Document
- Public APIs
- Configuration options
- Complex business logic
- Database schema changes
- Deployment procedures

### Documentation Checklist
- [ ] Javadoc/JSDoc comments added
- [ ] README updated if adding features
- [ ] Architecture document updated
- [ ] API documentation updated
- [ ] Examples provided if applicable

## Release Process

Releases are created from the `main` branch using semantic versioning (MAJOR.MINOR.PATCH).

1. Update version numbers
2. Update CHANGELOG.md
3. Create git tag
4. Push to repository
5. GitHub Actions builds and pushes Docker images

## Reporting Issues

### Bug Report Template
```markdown
## Description
Clear description of the bug

## Reproduction
Steps to reproduce:
1.
2.
3.

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS:
- Java/Node version:
- Docker version:

## Logs
Relevant error logs or stack traces
```

### Feature Request Template
```markdown
## Description
Clear description of the feature

## Motivation
Why this feature is needed

## Proposed Solution
How you envision the feature working

## Alternatives
Other approaches considered
```

## Performance Guidelines

- Minimize database queries (use joins, batch operations)
- Cache frequently accessed data
- Use pagination for large datasets
- Optimize Docker image sizes
- Monitor memory and CPU usage

## Security Guidelines

- Never commit secrets or credentials
- Use environment variables for configuration
- Validate and sanitize all inputs
- Use parameterized queries
- Keep dependencies updated
- Report security issues responsibly

## Questions?

- Check existing issues
- Review documentation
- Ask in discussions
- Email: team@stillum.com

Thank you for contributing!
