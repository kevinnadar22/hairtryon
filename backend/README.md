# Hair Try-On Backend API

A FastAPI-based backend service for AI-powered hairstyle try-on application. This service handles user authentication, image processing, AI-powered hairstyle generation using Replicate, payment processing, and cloud storage management.

---

## 🚀 Tech Stack

### Core Framework & Runtime
- **[FastAPI](https://fastapi.tiangolo.com/)** `v0.121.3` - Modern, high-performance web framework for building APIs
- **[Uvicorn](https://www.uvicorn.org/)** `v0.38.0` - Lightning-fast ASGI server
- **[Python](https://www.python.org/)** `>=3.13` - Programming language

### Database & ORM
- **[SQLAlchemy](https://www.sqlalchemy.org/)** `v2.0.44` - SQL toolkit and ORM for database operations
- **[Alembic](https://alembic.sqlalchemy.org/)** `v1.17.2` - Database migration tool


### AI & Image Processing
- **[Replicate](https://replicate.com/)** `v1.0.7` - AI model hosting platform for hairstyle generation (ByteDance SeeDream-4 model)

### Cloud Storage
- **[boto3](https://boto3.amazonaws.com/)** `v1.41.2` - AWS SDK for S3 image storage
- **[botocore](https://botocore.amazonaws.com/)** `v1.41.2` - Low-level AWS service client

### Payment Processing
- **[dodopayments](https://dodopayments.com/)** `v1.61.5` - Payment gateway integration with webhook support

### Email Services
- **[Brevo](https://www.brevo.com/)** (formerly Sendinblue) - Transactional email service via REST API


### Monitoring & Logging
- **[logfire](https://pydantic.dev/logfire)** `v4.15.1` - Observability platform with FastAPI, SQLAlchemy, and system metrics instrumentation

### Rate Limiting & Middleware
- **[slowapi](https://slowapi.readthedocs.io/)** `v0.1.9` - Rate limiting for FastAPI

### Development Tools
- **[pytest](https://pytest.org/)** `v9.0.1` - Testing framework
- **[pytest-asyncio](https://pytest-asyncio.readthedocs.io/)** `v1.3.0` - Async test support
- **[coverage](https://coverage.readthedocs.io/)** `v7.12.0` - Code coverage measurement
- **[pre-commit](https://pre-commit.com/)** `v4.4.0` - Git hooks for code quality

---

## 📋 Environment Variables

| Environment Variable | Required | Default | Description |
|---------------------|----------|---------|-------------|
| **Database** |
| `DATABASE_URL` | ✅ | `sqlite:///./app/instance/test.db` | PostgreSQL connection string (e.g., `postgresql://user:pass@localhost/dbname`) |
| **Server** |
| `PORT` | ❌ | `8000` | Server port number |
| `ENV` | ❌ | `dev` | Environment mode (`dev` or `prod`) |
| **Authentication** |
| `SECRET_KEY` | ✅ | `your-secret` | Secret key for JWT access tokens (change in production!) |
| `REFRESH_SECRET_KEY` | ✅ | `your-refresh-secret` | Secret key for JWT refresh tokens (change in production!) |
| `ALGORITHM` | ❌ | `HS256` | JWT signing algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | ❌ | `10` | Access token expiration time in minutes |
| `REFRESH_TOKEN_EXPIRE_MINUTES` | ❌ | `10080` | Refresh token expiration time (7 days) |
| **Google OAuth** |
| `GOOGLE_CLIENT_ID` | ✅ | - | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | ✅ | - | Google OAuth client secret |
| `REDIRECT_URL` | ✅ | - | OAuth callback URL (e.g., `http://localhost:8000/api/v1/auth/google/callback`) |
| `FRONTEND_URL` | ✅ | - | Frontend application URL for redirects |
| **AWS S3 Storage** |
| `AWS_ACCESS_KEY_ID` | ✅ | - | AWS access key for S3 |
| `AWS_SECRET_ACCESS_KEY` | ✅ | - | AWS secret access key |
| `AWS_REGION` | ❌ | `ap-south-1` | AWS region for S3 bucket |
| `BUCKET_NAME` | ❌ | `hairtry` | S3 bucket name for image storage |
| `UPLOADS_FOLDER` | ❌ | `uploads/` | S3 folder for user uploads |
| `GENERATED_IMAGES_FOLDER` | ❌ | `generated/` | S3 folder for AI-generated images |
| `PROFILE_PICS_FOLDER` | ❌ | `profilepic/` | S3 folder for profile pictures |
| **Image Processing** |
| `MAX_IMAGE_SIZE_MB` | ❌ | `10` | Maximum allowed image size in MB |
| `ALLOWED_IMAGE_TYPES` | ❌ | `["image/jpeg", "image/png", "image/gif"]` | Allowed image MIME types |
| **AI Services** |
| `REPLICATE_API_TOKEN` | ✅ | - | Replicate API token for AI image generation |
| **Email** |
| `MAIL_FROM_NAME` | ✅ | - | Sender name for emails |
| `MAIL_FROM` | ✅ | - | Sender email address |
| `BREVO_API_KEY` | ✅ | - | Brevo (formerly Sendinblue) API key for email delivery |
| **Admin Panel** |
| `ADMIN_USERNAME` | ❌ | `admin` | Admin panel username |
| `ADMIN_PASSWORD` | ❌ | `12345678` | Admin panel password (change in production!) |
| **Payment** |
| `DODO_PAYMENTS_API_KEY` | ✅ | - | Dodo Payments API key |
| `DODO_PAYMENTS_MODE` | ❌ | `test_mode` | Payment mode (`test_mode` or `live_mode`) |
| `DODO_PAYMENTS_PRODUCT_ID` | ✅ | - | Product ID for payment processing |
| `DODO_PAYMENTS_WEBHOOK_SECRET` | ✅ | - | Webhook secret for payment verification |
| **Credits** |
| `FREE_USER_CREDITS` | ❌ | `3` | Number of free credits for new users |
| **Monitoring** |
| `LOGFIRE_TOKEN` | ❌ | - | Logfire token for observability (optional) |

---

## 🔧 Setup Instructions

### Prerequisites
- Python 3.13 or higher
- PostgreSQL database (or SQLite for development)
- AWS S3 bucket
- Replicate API account
- Google OAuth credentials
- Dodo Payments account
- Brevo email service account

### Installation Steps

<details>
<summary><strong>1. Clone the Repository</strong></summary>

```bash
git clone <repository-url>
cd hairtryon/backend
```
</details>

<details>
<summary><strong>2. Set Up Python Environment</strong></summary>

Using `uv` (recommended):
```bash
# Install uv if not already installed
pip install uv

# Create virtual environment and install dependencies
uv sync
```

Using traditional `pip`:
```bash
# Create virtual environment
python -m venv .venv

# Activate virtual environment
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```
</details>

<details>
<summary><strong>3. Configure Environment Variables</strong></summary>

Create a `.env` file in the backend root directory:

```bash
cp sample.env .env
```

Edit `.env` and fill in all required values. See the **Environment Variables** section above for details.

**Important:** Never commit `.env` to version control!
</details>

<details>
<summary><strong>4. Set Up Database</strong></summary>

#### Option A: PostgreSQL (Production)

1. Create a PostgreSQL database:
```sql
CREATE DATABASE hairtryon;
CREATE USER hairtryon_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE hairtryon TO hairtryon_user;
```

2. Update `DATABASE_URL` in `.env`:
```env
DATABASE_URL=postgresql://hairtryon_user:your_password@localhost:5432/hairtryon
```

#### Option B: SQLite (Development)

The default SQLite database will be created automatically at `app/instance/test.db`.

#### Run Migrations

```bash
# Initialize Alembic (if not already done)
alembic init alembic

# Create initial migration
alembic revision --autogenerate -m "Initial migration"

# Apply migrations
alembic upgrade head
```
</details>

<details>
<summary><strong>5. Obtain Google OAuth Credentials</strong></summary>

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Set application type to **Web application**
6. Add authorized redirect URIs:
   - Development: `http://localhost:8000/api/v1/auth/google/callback`
   - Production: `https://yourdomain.com/api/v1/auth/google/callback`
7. Copy **Client ID** and **Client Secret** to `.env`
</details>

<details>
<summary><strong>6. Set Up AWS S3 Bucket</strong></summary>

1. Create an S3 bucket in AWS Console
2. Create an IAM user with S3 access
3. Generate access keys for the IAM user
4. Configure bucket CORS policy:
```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": []
    }
]
```
5. Add credentials to `.env`:
```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
BUCKET_NAME=your_bucket_name
AWS_REGION=your_region
```
</details>

<details>
<summary><strong>7. Get Replicate API Token</strong></summary>

1. Sign up at [Replicate](https://replicate.com/)
2. Go to [Account Settings](https://replicate.com/account/api-tokens)
3. Create a new API token
4. Add to `.env`:
```env
REPLICATE_API_TOKEN=your_token_here
```

The app uses the **ByteDance SeeDream-4** model for hairstyle generation.
</details>

<details>
<summary><strong>8. Configure Brevo Email Service</strong></summary>

1. Sign up at [Brevo](https://www.brevo.com/) (formerly Sendinblue)
2. Go to **SMTP & API** → **API Keys**
3. Create a new API key
4. Add to `.env`:
```env
BREVO_API_KEY=your_api_key
MAIL_FROM=noreply@yourdomain.com
MAIL_FROM_NAME=Hair Try-On
```
</details>

<details>
<summary><strong>9. Set Up Dodo Payments</strong></summary>

1. Sign up at [Dodo Payments](https://dodopayments.com/)
2. Create a product in the dashboard
3. Get API credentials and webhook secret
4. Add to `.env`:
```env
DODO_PAYMENTS_API_KEY=your_api_key
DODO_PAYMENTS_PRODUCT_ID=your_product_id
DODO_PAYMENTS_WEBHOOK_SECRET=your_webhook_secret
DODO_PAYMENTS_MODE=test_mode  # or live_mode for production
```
</details>

<details>
<summary><strong>10. Run the Application</strong></summary>

#### Development Mode (with auto-reload):
```bash
# Using the run script
python run.py --reload

# Or using uvicorn directly
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

#### Production Mode:
```bash
# Using Docker Compose
docker-compose up -d

# Or using uvicorn with multiple workers
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

The API will be available at:
- **API Base URL:** `http://localhost:8000`
- **API Documentation:** `http://localhost:8000/docs` (dev only)
- **Admin Panel:** `http://localhost:8000/admin`
</details>

---

## 📁 File Structure

```
backend/
├── app/                          # Main application directory
│   ├── __init__.py
│   ├── main.py                   # FastAPI application entry point
│   ├── db.py                     # Database configuration and session management
│   ├── admin.py                  # Admin panel configuration
│   │
│   ├── api/                      # API routes
│   │   ├── __init__.py
│   │   ├── router.py             # Main API router
│   │   └── v1/                   # API version 1
│   │       ├── __init__.py
│   │       ├── auth/             # Authentication endpoints
│   │       │   ├── login.py      # Login/register
│   │       │   ├── google.py     # Google OAuth
│   │       │   ├── refresh.py    # Token refresh
│   │       │   ├── logout.py     # Logout
│   │       │   └── verify.py     # Email verification
│   │       ├── files_upload.py   # File upload endpoints
│   │       ├── image.py          # Image generation endpoints
│   │       ├── payment.py        # Payment processing endpoints
│   │       └── user.py           # User management endpoints
│   │
│   ├── core/                     # Core application components
│   │   ├── __init__.py
│   │   ├── config.py             # Pydantic settings configuration
│   │   ├── dependencies.py       # FastAPI dependencies (auth, DB)
│   │   ├── exceptions.py         # Custom exception handlers
│   │   ├── lifespan.py           # Application lifespan events
│   │   ├── logging.py            # Logging configuration
│   │   ├── middleware.py         # CORS and other middleware
│   │   ├── ratelimiting.py       # Rate limiting setup
│   │   └── telementry.py         # Logfire telemetry setup
│   │
│   ├── models/                   # SQLAlchemy ORM models
│   │   ├── __init__.py
│   │   ├── user.py               # User model
│   │   ├── generated_images.py   # Generated images model
│   │   ├── style.py              # Hairstyle model
│   │   ├── transactions.py       # Payment transactions model
│   │   └── blacklist_tokens.py   # Blacklisted JWT tokens model
│   │
│   ├── schemas/                  # Pydantic schemas for validation
│   │   ├── __init__.py
│   │   ├── auth.py               # Authentication schemas
│   │   ├── image.py              # Image generation schemas
│   │   ├── payment.py            # Payment schemas
│   │   └── user.py               # User schemas
│   │
│   ├── repository/               # Database repository layer
│   │   ├── __init__.py
│   │   ├── user.py               # User CRUD operations
│   │   ├── generated_images.py   # Generated images CRUD
│   │   ├── style.py              # Style CRUD operations
│   │   └── transactions.py       # Transaction CRUD operations
│   │
│   ├── services/                 # Business logic layer
│   │   ├── __init__.py
│   │   ├── auth.py               # Authentication service
│   │   ├── google_auth.py        # Google OAuth service
│   │   ├── image_gen.py          # Image generation service
│   │   ├── image_upload.py       # Image upload to S3 service
│   │   ├── payment.py            # Payment processing service
│   │   ├── mail_service.py       # Email sending service
│   │   └── blacklist_token.py    # Token blacklist service
│   │
│   ├── utils/                    # Utility functions
│   │   ├── __init__.py
│   │   ├── file_utils.py         # File handling utilities
│   │   ├── image_utils.py        # Image processing utilities
│   │   └── token_utils.py        # JWT token utilities
│   │
│   ├── enums/                    # Enumerations
│   │   ├── __init__.py
│   │   ├── image_status.py       # Image generation status enum
│   │   └── user_role.py          # User role enum
│   │
│   ├── templates/                # Email templates (Jinja2)
│   │   ├── verification.html     # Email verification template
│   │   └── welcome.html          # Welcome email template
│   │
│   ├── alembic/                  # Database migrations
│   │   ├── versions/             # Migration scripts
│   │   └── env.py                # Alembic environment
│   │
│   └── instance/                 # Instance-specific files (SQLite DB)
│
├── log/                          # Application logs
├── .venv/                        # Virtual environment
├── .env                          # Environment variables (not in git)
├── sample.env                    # Sample environment file
├── prod.env                      # Production environment (not in git)
├── requirements.txt              # Python dependencies
├── pyproject.toml                # Project metadata and dependencies
├── uv.lock                       # UV lock file
├── run.py                        # Development server entry point
├── Dockerfile                    # Docker container definition
├── docker-compose.yml            # Docker Compose configuration
├── start.sh                      # Startup script
├── alembic.ini                   # Alembic configuration
├── mypy.ini                      # MyPy type checking config
├── .flake8                       # Flake8 linting config
├── .gitignore                    # Git ignore rules
├── .python-version               # Python version specification
├── README.md                     # This file
└── ARCHITECTURE.md               # Architecture documentation
```

---

## 🧪 Testing

Run tests using pytest:

```bash
# Run all tests
pytest

# Run with coverage
coverage run -m pytest
coverage report
coverage html  # Generate HTML report
```

---

## 🚢 Deployment

### Using Docker

```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Deployment

1. Set `ENV=prod` in your environment
2. Update production environment variables
3. Run database migrations: `alembic upgrade head`
4. Start with production server:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

---

## 📚 API Documentation

When running in development mode (`ENV=dev`), interactive API documentation is available at:

- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`

### Main Endpoints

- **Authentication:** `/api/v1/auth/*`
  - `POST /auth/register` - User registration
  - `POST /auth/login` - User login
  - `GET /auth/google` - Google OAuth login
  - `POST /auth/refresh` - Refresh access token
  - `POST /auth/logout` - User logout

- **Image Generation:** `/api/v1/image/*`
  - `POST /image/generate` - Generate hairstyle
  - `POST /image/view-generate` - Generate side views
  - `GET /image/status/{image_id}` - Check generation status
  - `GET /image/styles` - List available styles

- **User Management:** `/api/v1/user/*`
  - `GET /user/me` - Get current user
  - `GET /user/images` - Get user's generated images
  - `PUT /user/profile` - Update profile

- **Payment:** `/api/v1/payment/*`
  - `POST /payment/create-checkout` - Create payment session
  - `POST /payment/webhook` - Payment webhook handler

---

## 🔒 Security Notes

- Change default `SECRET_KEY` and `REFRESH_SECRET_KEY` in production
- Change default `ADMIN_USERNAME` and `ADMIN_PASSWORD`
- Use HTTPS in production
- Keep `.env` files out of version control
- Regularly rotate API keys and secrets
- Use strong passwords for database and admin panel


---

## 📧 Support

For issues and questions, please contact [jesikamaraj@gmail.com](mailto:jesikamaraj@gmail.com)
