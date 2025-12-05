# Hair Try-On Backend Architecture

This document provides a comprehensive overview of the Hair Try-On backend architecture, design patterns, data flow, and technical decisions.

---

## 📐 Architecture Overview

The Hair Try-On backend follows a **layered architecture** pattern with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Applications                      │
│              (Web Frontend, Mobile Apps, etc.)               │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Layer (FastAPI)                     │
│  ┌──────────────┬──────────────┬──────────────────────────┐ │
│  │ Auth Routes  │ Image Routes │ Payment Routes │ User... │ │
│  └──────────────┴──────────────┴──────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Middleware Layer                          │
│  ┌──────────┬──────────┬──────────────┬──────────────────┐  │
│  │   CORS   │  Logging │ Rate Limiting│ Exception Handler│  │
│  └──────────┴──────────┴──────────────┴──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Service Layer                             │
│  ┌──────────────┬──────────────┬──────────────────────────┐ │
│  │ Auth Service │ Image Service│ Payment Service │ Mail...│ │
│  └──────────────┴──────────────┴──────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Repository Layer                           │
│  ┌──────────────┬──────────────┬──────────────────────────┐ │
│  │ User Repo    │ Image Repo   │ Transaction Repo │ ...  │ │
│  └──────────────┴──────────────┴──────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer (ORM)                          │
│  ┌──────────────┬──────────────┬──────────────────────────┐ │
│  │ User Model   │ Image Model  │ Transaction Model │ ...  │ │
│  └──────────────┴──────────────┴──────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Database                                │
│                  (PostgreSQL / SQLite)                       │
└─────────────────────────────────────────────────────────────┘

        External Services Integration
┌──────────────┬──────────────┬──────────────┬──────────────┐
│   AWS S3     │  Replicate   │ Dodo Payments│    Brevo     │
│ (Storage)    │  (AI Model)  │  (Payments)  │   (Email)    │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

---

## 🏗️ Design Patterns

### 1. **Layered Architecture**

The application is organized into distinct layers, each with specific responsibilities:

#### **API Layer** (`app/api/`)
- **Responsibility:** HTTP request/response handling, input validation, route definitions
- **Components:** FastAPI routers, endpoint definitions
- **Pattern:** RESTful API design
- **Key Files:**
  - `router.py` - Main API router aggregation
  - `v1/auth/` - Authentication endpoints
  - `v1/image.py` - Image generation endpoints
  - `v1/payment.py` - Payment processing endpoints
  - `v1/user.py` - User management endpoints

#### **Service Layer** (`app/services/`)
- **Responsibility:** Business logic, orchestration, external API integration
- **Components:** Service classes implementing business workflows
- **Pattern:** Service-oriented architecture
- **Key Services:**
  - `AuthService` - User authentication and authorization
  - `ImageGenService` - AI image generation workflow
  - `PaymentService` - Payment processing and webhook handling
  - `ImageUploadService` - S3 upload management
  - `GoogleAuthService` - OAuth integration
  - `MailService` - Email notifications

#### **Repository Layer** (`app/repository/`)
- **Responsibility:** Data access abstraction, CRUD operations
- **Components:** Repository classes for each model
- **Pattern:** Repository pattern
- **Benefits:**
  - Decouples business logic from data access
  - Centralizes database queries
  - Easier testing with mock repositories

#### **Data Layer** (`app/models/`)
- **Responsibility:** Database schema definition, ORM models
- **Components:** SQLAlchemy models
- **Pattern:** Active Record pattern (via SQLAlchemy ORM)

### 2. **Dependency Injection**

FastAPI's built-in dependency injection system is used throughout:

```python
# Example from app/core/dependencies.py
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    # Validate token and return user
    ...

# Usage in routes
@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user
```

**Benefits:**
- Automatic dependency resolution
- Easy testing with dependency overrides
- Clear declaration of route requirements

### 3. **Schema Validation with Pydantic**

All request/response data is validated using Pydantic models:

```python
# Input validation
class ImageGenRequest(BaseModel):
    style_id: int
    image_input_url: HttpUrl

# Output validation
class ImageGenResponse(BaseModel):
    image_id: int
    message: str
```

**Benefits:**
- Automatic data validation
- Type safety
- Auto-generated API documentation
- Serialization/deserialization

### 4. **Configuration Management**

Centralized configuration using Pydantic Settings:

```python
# app/core/config.py
class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    # ... other settings

    model_config = ConfigDict(env_file=".env")

settings = Settings()
```

**Benefits:**
- Type-safe configuration
- Environment variable validation
- Default values
- IDE autocomplete support

### 5. **Background Tasks**

Asynchronous processing for long-running operations:

```python
@router.post("/generate")
async def generate_image(
    data: ImageGenRequest,
    background_tasks: BackgroundTasks,
    ...
):
    # Create record immediately
    image = service.create_image_generation_record(...)

    # Process in background
    background_tasks.add_task(service.start_image_generation, image)

    return {"image_id": image.id}
```

**Use Cases:**
- AI image generation (can take 10-30 seconds)
- Email sending
- File processing

---

## 🔄 Data Flow

### Image Generation Workflow

```
┌──────────┐
│  Client  │
└────┬─────┘
     │ 1. POST /api/v1/image/generate
     │    {style_id, image_input_url}
     ▼
┌────────────────┐
│  API Endpoint  │ ◄── Rate Limiting (5/min)
└────┬───────────┘
     │ 2. Validate request
     │ 3. Check user credits
     ▼
┌──────────────────┐
│  ImageGenService │
└────┬─────────────┘
     │ 4. Create DB record (status: PENDING)
     │ 5. Return image_id immediately
     │ 6. Start background task
     ▼
┌────────────────────┐
│  Background Task   │
└────┬───────────────┘
     │ 7. Update status: PROCESSING
     │ 8. Call Replicate API
     │    (ByteDance SeeDream-4 model)
     ▼
┌──────────────┐
│  Replicate   │
└────┬─────────┘
     │ 9. Generate image (10-30s)
     │ 10. Return temporary URL
     ▼
┌────────────────────┐
│  ImageUploadService│
└────┬───────────────┘
     │ 11. Download from temp URL
     │ 12. Upload to S3
     │ 13. Get permanent S3 URL
     ▼
┌──────────────────┐
│  ImageGenService │
└────┬─────────────┘
     │ 14. Update DB record
     │     - status: COMPLETED
     │     - output_image_url: S3 URL
     │     - time_taken: duration
     │ 15. Deduct user credits
     ▼
┌──────────┐
│ Database │
└──────────┘

     ┌──────────┐
     │  Client  │ ◄── Polls GET /api/v1/image/status/{id}
     └──────────┘     to check completion
```

### Authentication Flow

#### Standard Email/Password Authentication

```
┌──────────┐
│  Client  │
└────┬─────┘
     │ 1. POST /api/v1/auth/register
     │    {email, password, name}
     ▼
┌────────────────┐
│  Auth Service  │
└────┬───────────┘
     │ 2. Hash password (bcrypt)
     │ 3. Create user record
     │ 4. Generate verification token
     │ 5. Send verification email
     ▼
┌──────────┐
│ Database │
└──────────┘

     ┌──────────┐
     │  Client  │ ◄── Clicks verification link
     └────┬─────┘
          │ 6. GET /api/v1/auth/verify?token=...
          ▼
     ┌────────────────┐
     │  Auth Service  │
     └────┬───────────┘
          │ 7. Verify token
          │ 8. Mark user as verified
          │ 9. Generate JWT tokens
          ▼
     ┌──────────┐
     │  Client  │ ◄── Receives access + refresh tokens
     └──────────┘
```

#### Google OAuth Flow

```
┌──────────┐
│  Client  │
└────┬─────┘
     │ 1. GET /api/v1/auth/google
     ▼
┌────────────────────┐
│  GoogleAuthService │
└────┬───────────────┘
     │ 2. Redirect to Google OAuth
     ▼
┌──────────────┐
│    Google    │
└────┬─────────┘
     │ 3. User authorizes
     │ 4. Redirect to callback URL
     ▼
┌────────────────────┐
│  Callback Endpoint │
└────┬───────────────┘
     │ 5. Exchange code for tokens
     │ 6. Get user info from Google
     ▼
┌────────────────────┐
│  GoogleAuthService │
└────┬───────────────┘
     │ 7. Find or create user
     │ 8. Generate JWT tokens
     ▼
┌──────────┐
│  Client  │ ◄── Redirect to frontend with tokens
└──────────┘
```

### Payment Processing Flow

```
┌──────────┐
│  Client  │
└────┬─────┘
     │ 1. POST /api/v1/payment/create-checkout
     │    {credits_amount}
     ▼
┌─────────────────┐
│ Payment Service │
└────┬────────────┘
     │ 2. Create checkout session
     │    via Dodo Payments API
     ▼
┌────────────────┐
│ Dodo Payments  │
└────┬───────────┘
     │ 3. Return checkout URL
     ▼
┌──────────┐
│  Client  │ ◄── Redirect to payment page
└────┬─────┘
     │ 4. Complete payment
     ▼
┌────────────────┐
│ Dodo Payments  │
└────┬───────────┘
     │ 5. Send webhook to backend
     │    POST /api/v1/payment/webhook
     ▼
┌─────────────────┐
│ Webhook Handler │
└────┬────────────┘
     │ 6. Verify webhook signature
     │ 7. Parse payment data
     ▼
┌─────────────────┐
│ Payment Service │
└────┬────────────┘
     │ 8. Create transaction record
     │ 9. Add credits to user account
     ▼
┌──────────┐
│ Database │
└──────────┘
```

---

## 🗄️ Database Schema

### Entity Relationship Diagram

```
┌─────────────────────┐
│       User          │
├─────────────────────┤
│ id (PK)             │
│ email               │
│ password_hash       │
│ name                │
│ profile_picture     │
│ credits             │◄──────┐
│ is_verified         │       │
│ oauth_provider      │       │
│ created_at          │       │
│ updated_at          │       │
└─────────────────────┘       │
         │                    │
         │ 1:N                │
         ▼                    │
┌─────────────────────┐       │
│  GeneratedImage     │       │
├─────────────────────┤       │
│ id (PK)             │       │
│ user_id (FK)        │───────┘
│ style_id (FK)       │───────┐
│ input_image_url     │       │
│ output_image_url    │       │
│ right_view_url      │       │
│ left_view_url       │       │
│ back_view_url       │       │
│ status              │       │
│ description         │       │
│ is_favourite        │       │
│ time_taken          │       │
│ created_at          │       │
└─────────────────────┘       │
                              │
         ┌────────────────────┘
         │ N:1
         ▼
┌─────────────────────┐
│       Style         │
├─────────────────────┤
│ id (PK)             │
│ name                │
│ description         │
│ prompt              │
│ thumbnail_url       │
│ is_active           │
│ created_at          │
└─────────────────────┘

┌─────────────────────┐
│    Transaction      │
├─────────────────────┤
│ id (PK)             │
│ user_id (FK)        │───────┐
│ payment_id          │       │
│ amount              │       │
│ credits_purchased   │       │
│ status              │       │
│ payment_method      │       │
│ created_at          │       │
└─────────────────────┘       │
                              │
         ┌────────────────────┘
         │ N:1
         ▼
┌─────────────────────┐
│       User          │
│   (same as above)   │
└─────────────────────┘

┌─────────────────────┐
│  BlacklistToken     │
├─────────────────────┤
│ id (PK)             │
│ token               │
│ blacklisted_on      │
│ expires_at          │
└─────────────────────┘
```

### Key Models

#### **User Model**
- Stores user authentication and profile data
- Tracks credit balance for image generation
- Supports both email/password and OAuth authentication
- Relationships: `generated_images`, `transactions`

#### **GeneratedImage Model**
- Stores image generation requests and results
- Tracks generation status (PENDING, PROCESSING, COMPLETED, FAILED)
- Stores multiple views (front, right, left, back)
- Includes performance metrics (time_taken)
- Relationships: `user`, `style`

#### **Style Model**
- Catalog of available hairstyles
- Contains AI prompts for Replicate
- Includes thumbnail for UI display
- Can be activated/deactivated

#### **Transaction Model**
- Payment history and audit trail
- Links payments to credit additions
- Tracks payment status and method

#### **BlacklistToken Model**
- Invalidated JWT tokens (logout, security)
- Automatically cleaned up after expiration

---

## 🔐 Security Architecture

### Authentication & Authorization

#### **JWT Token Strategy**
- **Access Token:** Short-lived (10 minutes), used for API requests
- **Refresh Token:** Long-lived (7 days), used to obtain new access tokens
- **Algorithm:** HS256 (HMAC with SHA-256)
- **Storage:** Client-side (localStorage/cookies)

#### **Token Lifecycle**

```
┌─────────┐
│  Login  │
└────┬────┘
     │
     ▼
┌──────────────────────────────┐
│ Generate Access + Refresh    │
│ Access: 10 min expiry        │
│ Refresh: 7 day expiry        │
└────┬─────────────────────────┘
     │
     ▼
┌──────────────────────────────┐
│ Client stores both tokens    │
└────┬─────────────────────────┘
     │
     │ ┌──────────────────────┐
     ├─┤ API Request          │
     │ │ Include access token │
     │ └──────────────────────┘
     │
     │ ┌──────────────────────┐
     ├─┤ Access token expires │
     │ │ Use refresh token    │
     │ │ Get new access token │
     │ └──────────────────────┘
     │
     │ ┌──────────────────────┐
     └─┤ Logout               │
       │ Blacklist both tokens│
       └──────────────────────┘
```

### Password Security
- **Hashing:** bcrypt with automatic salt generation
- **Rounds:** Default bcrypt work factor (currently 12)
- **No plaintext storage:** Passwords never stored in plain text

### OAuth Security
- **Provider:** Google OAuth 2.0
- **Scope:** Email and profile information
- **State Parameter:** CSRF protection
- **Token Exchange:** Server-side only (client never sees OAuth tokens)

### API Security Measures

#### **Rate Limiting**
```python
@limiter.limit("5/minute")
async def generate_image(...):
    # Prevents abuse of expensive AI operations
```

- **Image Generation:** 5 requests/minute per IP
- **Authentication:** Standard rate limits on login/register
- **Implementation:** SlowAPI with in-memory storage

#### **CORS Configuration**
- Configured in `app/core/middleware.py`
- Restricts allowed origins based on `FRONTEND_URL`
- Allows credentials for cookie-based auth

#### **Input Validation**
- All inputs validated via Pydantic schemas
- Type checking and format validation
- Automatic sanitization of user inputs

#### **File Upload Security**
- **Size Limit:** 10MB maximum
- **Type Validation:** Only image/jpeg, image/png, image/gif
- **Content-Type Verification:** MIME type checking
- **Virus Scanning:** (Recommended to add in production)

### Webhook Security
- **Signature Verification:** All payment webhooks verified using HMAC
- **Replay Protection:** Timestamp validation
- **Implementation:** Dodo Payments StandardWebhooks library

---

## 🚀 Performance Optimizations

### 1. **Asynchronous Processing**
- FastAPI's async/await for I/O operations
- Background tasks for long-running operations
- Non-blocking database queries where possible

### 2. **Database Optimization**
- **Indexes:** On frequently queried fields (user_id, email, status)
- **Pagination:** All list endpoints support pagination
- **Eager Loading:** Relationships loaded efficiently to avoid N+1 queries

### 3. **Caching Strategy**
- **Static Assets:** S3 with CloudFront (recommended)
- **API Responses:** (Can be added with Redis)
- **Database Queries:** (Can be added with Redis)

### 4. **Image Processing**
- **Lazy Loading:** Images processed on-demand
- **CDN Delivery:** S3 URLs can be fronted with CloudFront
- **Compression:** Images compressed before S3 upload

### 5. **Connection Pooling**
- SQLAlchemy connection pool for database
- HTTP client connection pooling (aiohttp, httpx)

---

## 📊 Monitoring & Observability

### Logging Strategy

#### **Structured Logging with Loguru**
```python
logger.info("Image generation started",
    image_id=image.id,
    user_id=user.id,
    style_id=style.id
)
```

**Log Levels:**
- `DEBUG`: Development debugging information
- `INFO`: Normal operations, business events
- `WARNING`: Unexpected but handled situations
- `ERROR`: Errors that need attention
- `CRITICAL`: System failures

#### **Log Destinations**
- **Console:** Development environment
- **File:** `log/` directory with rotation
- **Logfire:** Production observability platform

### Telemetry with Logfire

**Instrumentation:**
- FastAPI request/response tracing
- SQLAlchemy query performance
- System metrics (CPU, memory, disk)
- Custom business metrics

**Metrics Tracked:**
- Request latency
- Error rates
- Database query performance
- Image generation success rate
- Credit consumption patterns

### Error Tracking

**Exception Handling:**
```python
# app/core/exceptions.py
class CustomException(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=self.status_code,
            detail=self.detail
        )
```

**Custom Exceptions:**
- `NotEnoughCreditsException` (402)
- `ImageNotFoundException` (404)
- `StyleNotFoundException` (404)
- `InvalidTokenException` (401)
- `UserNotFoundException` (404)

---

## 🧪 Testing Strategy

### Test Structure
```
tests/
├── unit/              # Unit tests for services, repositories
├── integration/       # Integration tests for API endpoints
├── fixtures/          # Test data and fixtures
└── conftest.py        # Pytest configuration
```

### Testing Tools
- **pytest:** Test framework
- **pytest-asyncio:** Async test support
- **coverage:** Code coverage measurement

### Test Database
- Separate test database or in-memory SQLite
- Automatic setup/teardown with fixtures
- Database migrations applied before tests

---

## 🔄 CI/CD Considerations

### Recommended Pipeline

```yaml
# Example GitHub Actions workflow
1. Code Checkout
2. Setup Python 3.13
3. Install dependencies (uv sync)
4. Run linters (flake8, mypy)
5. Run tests (pytest)
6. Check coverage (>80%)
7. Build Docker image
8. Push to registry
9. Deploy to staging
10. Run smoke tests
11. Deploy to production
```

### Environment Management
- **Development:** Local `.env` file
- **Staging:** Environment variables in CI/CD
- **Production:** Secrets management (AWS Secrets Manager, etc.)

---

## 📦 Deployment Architecture

### Recommended Production Setup

```
┌─────────────────────────────────────────────────────────┐
│                    Load Balancer                         │
│                  (AWS ALB / Nginx)                       │
└────────────────────┬────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
    ┌────▼────┐            ┌────▼────┐
    │ FastAPI │            │ FastAPI │
    │ Worker 1│            │ Worker 2│
    └────┬────┘            └────┬────┘
         │                       │
         └───────────┬───────────┘
                     │
         ┌───────────▼───────────┐
         │                       │
    ┌────▼────┐            ┌────▼────┐
    │PostgreSQL│            │  Redis  │
    │ Primary  │            │  Cache  │
    └─────────┘            └─────────┘
```

### Scaling Strategies

#### **Horizontal Scaling**
- Multiple Uvicorn workers
- Load balancer distribution
- Stateless application design

#### **Vertical Scaling**
- Increase worker count per instance
- Optimize database queries
- Increase database resources

#### **Database Scaling**
- Read replicas for read-heavy operations
- Connection pooling
- Query optimization

---

## 🔮 Future Enhancements

### Planned Features
1. **Redis Caching:** Cache frequently accessed data
2. **Celery Task Queue:** Replace background tasks for better reliability
3. **WebSocket Support:** Real-time image generation status updates
4. **Admin Dashboard:** Enhanced admin panel with analytics
5. **Multi-region Support:** Deploy in multiple AWS regions
6. **Advanced Analytics:** User behavior tracking and insights
7. **A/B Testing:** Experiment framework for features
8. **GraphQL API:** Alternative to REST for flexible queries

### Technical Debt
1. Add comprehensive integration tests
2. Implement request/response caching
3. Add database query optimization
4. Implement proper secrets rotation
5. Add automated security scanning
6. Improve error messages and user feedback

---

## 📚 Additional Resources

### Documentation
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Pydantic Documentation](https://docs.pydantic.dev/)
- [Replicate Documentation](https://replicate.com/docs)

### Related Repositories
- Frontend Repository: [Link to frontend repo]
- Mobile App Repository: [Link to mobile repo]
- Infrastructure as Code: [Link to IaC repo]

---

## 🤝 Contributing

### Code Style
- Follow PEP 8 guidelines
- Use type hints for all functions
- Write docstrings for all public methods
- Run pre-commit hooks before committing

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:** feat, fix, docs, style, refactor, test, chore

### Pull Request Process
1. Create feature branch from `main`
2. Implement changes with tests
3. Update documentation
4. Submit PR with clear description
5. Address review comments
6. Merge after approval

---

## 📞 Contact & Support

For architecture questions or technical discussions:
- **Email:** [your-email@example.com]
- **Slack:** [Your Slack channel]
- **Documentation:** [Link to wiki/docs]

---

**Last Updated:** December 2025
**Version:** 1.0.0
**Maintainer:** [Your Name/Team]
