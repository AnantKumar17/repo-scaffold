---
name: api-doc-generator
description: >
  Generate and maintain API documentation for {PROJECT_NAME}. Auto-invoke when
  asked to document APIs, generate OpenAPI specs, or update API documentation.
---

# API Documentation Generator — {PROJECT_NAME}

## Documentation Format

- **Format**: {API_DOC_FORMAT}
- **Location**: {API_DOC_LOCATION}
- **Interactive Docs**: {INTERACTIVE_DOCS_URL}

## API Specification

### OpenAPI/Swagger

{OPENAPI_SPEC_LOCATION}

### Generating OpenAPI Spec

{OPENAPI_GENERATION_COMMAND}

### Updating OpenAPI Spec

When adding/modifying endpoints:

1. **Add annotations** to handler code:
```{LANGUAGE}
{OPENAPI_ANNOTATION_EXAMPLE}
```

2. **Regenerate spec**:
```bash
{OPENAPI_REGEN_COMMAND}
```

3. **Validate spec**:
```bash
{OPENAPI_VALIDATE_COMMAND}
```

## Documenting Endpoints

### Required Documentation

For each endpoint, document:
- **Method & Path**: `GET /api/v1/resources/:id`
- **Description**: What this endpoint does
- **Authentication**: Required auth type
- **Request Parameters**: Path, query, body
- **Request Examples**: Sample requests
- **Response Schema**: Success response structure
- **Response Examples**: Sample responses
- **Error Codes**: Possible error responses
- **Rate Limits**: If applicable

### Documentation Template

```markdown
## {METHOD} {PATH}

**Description**: {DESCRIPTION}

**Authentication**: {AUTH_TYPE}

### Request

**Path Parameters**:
- `{param}` (type): description

**Query Parameters**:
- `{param}` (type, optional): description

**Request Body**:
```json
{REQUEST_EXAMPLE}
```

### Response

**Success (200)**:
```json
{RESPONSE_EXAMPLE}
```

**Errors**:
- `400 Bad Request`: Invalid input
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

### Example

```bash
curl -X {METHOD} \
  {BASE_URL}{PATH} \
  -H "Authorization: Bearer TOKEN" \
  -d '{REQUEST_BODY}'
```
```

## Request/Response Schemas

### Schema Definition Pattern

{SCHEMA_DEFINITION_PATTERN}

### Validation Rules

{VALIDATION_RULES_PATTERN}

## API Versioning

**Current Version**: {API_VERSION}

### Versioning Strategy

{VERSIONING_STRATEGY}

### Deprecation Policy

{DEPRECATION_POLICY}

## Interactive Documentation

### Swagger UI

{SWAGGER_UI_LOCATION}

Access at: {SWAGGER_UI_URL}

### Postman Collection

{POSTMAN_COLLECTION_LOCATION}

Import collection:
```bash
{POSTMAN_IMPORT_COMMAND}
```

## Auto-Documentation from Code

### Code Comments Pattern

{CODE_COMMENT_PATTERN}

### Generating Docs

```bash
{DOC_GENERATION_COMMAND}
```

## API Design Guidelines

### RESTful Conventions

{REST_CONVENTIONS}

### Naming Conventions

- **Resources**: Plural nouns (`/users`, `/orders`)
- **Actions**: HTTP verbs (GET, POST, PUT, DELETE)
- **Filtering**: Query params (`?status=active`)
- **Pagination**: `?page=1&limit=20`
- **Sorting**: `?sort=createdAt&order=desc`

### Response Format

{RESPONSE_FORMAT_STANDARD}

Standard response structure:
```json
{
  "data": {},
  "meta": {},
  "errors": []
}
```

### Error Response Format

{ERROR_RESPONSE_FORMAT}

Standard error:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": {}
  }
}
```

## API Testing Documentation

### Example Requests

{EXAMPLE_REQUESTS_LOCATION}

### Integration Tests as Documentation

{TEST_AS_DOC_STRATEGY}

## Changelog

{API_CHANGELOG_LOCATION}

Document changes:
- New endpoints
- Modified endpoints
- Deprecated endpoints
- Breaking changes

### Changelog Entry Template

```markdown
## v2.1.0 - 2026-04-19

### Added
- `POST /api/v1/resources` - Create resource
- `GET /api/v1/resources/:id/related` - Get related resources

### Changed
- `GET /api/v1/resources` - Added `status` filter parameter

### Deprecated
- `GET /api/v1/old-resources` - Use `/api/v1/resources` instead

### Removed
- `v1` endpoints (as announced in v2.0.0)
```

## Client SDKs

{SDK_GENERATION}

Supporting clients:
- **JavaScript/TypeScript**: {JS_SDK_LOCATION}
- **Python**: {PYTHON_SDK_LOCATION}
- **Go**: {GO_SDK_LOCATION}

## Rate Limiting Documentation

{RATE_LIMIT_DOCS}

## Authentication Documentation

{AUTH_DOCS}

## Common API Patterns

{API_PATTERNS}

## API Metrics

Document performance characteristics:
- Average response time
- p95/p99 latency
- Throughput (requests/second)
- Error rate

## Usage

Ask Claude for help with:
- "Document the new endpoint POST /api/v1/orders"
- "Generate OpenAPI spec"
- "Update API documentation"
- "Create Postman collection"
- "Add request/response examples"
