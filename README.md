# CallMate AI Backend API

A robust Node.js backend API for CallMate AI, featuring call management, AI analysis, and conversation processing.

## Features

- **Call Management**: CRUD operations for call records
- **AI Analysis**: Text analysis, summarization, and intent detection
- **Health Monitoring**: Comprehensive health check endpoints
- **Security**: Rate limiting, CORS, and helmet security headers
- **Error Handling**: Centralized error handling with detailed responses
- **Logging**: Structured logging for debugging and monitoring

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Access the API**:
   - Base URL: `http://localhost:3000`
   - Health check: `http://localhost:3000/api/health`

## API Endpoints

### Health
- `GET /api/health` - Basic health check
- `GET /api/health/detailed` - Detailed system information

### Calls
- `GET /api/calls` - List all calls (with pagination)
- `GET /api/calls/:id` - Get specific call
- `POST /api/calls` - Create new call
- `PUT /api/calls/:id` - Update call
- `DELETE /api/calls/:id` - Delete call

### AI Services
- `POST /api/ai/analyze` - Analyze text sentiment and topics
- `POST /api/ai/summarize` - Generate text summaries
- `POST /api/ai/intent` - Detect conversation intent
- `POST /api/ai/chat` - AI conversation endpoint

## Example Requests

### Create a Call
```bash
curl -X POST http://localhost:3000/api/calls \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+1234567890",
    "duration": 300,
    "transcript": "Customer called about product pricing..."
  }'
```

### Analyze Text
```bash
curl -X POST http://localhost:3000/api/ai/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "text": "I am very happy with your service!",
    "type": "customer_feedback"
  }'
```

### Generate Summary
```bash
curl -X POST http://localhost:3000/api/ai/summarize \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "Long conversation transcript here...",
    "maxLength": 150
  }'
```

## Project Structure

```
src/
├── server.js          # Main server file
├── routes/            # API route handlers
│   ├── calls.js       # Call management endpoints
│   ├── ai.js          # AI service endpoints
│   └── health.js      # Health check endpoints
├── middleware/        # Custom middleware
│   └── auth.js        # Authentication middleware
└── utils/             # Utility functions
    └── logger.js      # Logging utility
```

## Environment Variables

Create a `.env` file based on `.env.example`:

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `ALLOWED_ORIGINS` - CORS allowed origins
- API keys for external services (OpenAI, Anthropic, etc.)

## Development

- **Start dev server**: `npm run dev` (with auto-restart)
- **Start production**: `npm start`
- **Run tests**: `npm test` (when tests are added)

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configurable allowed origins
- **Helmet**: Security headers
- **Input Validation**: Request body validation
- **Error Handling**: Secure error responses

## Next Steps

1. **Database Integration**: Replace in-memory storage with a proper database
2. **Authentication**: Implement JWT-based authentication
3. **AI Integration**: Connect to real AI services (OpenAI, Anthropic)
4. **Testing**: Add comprehensive test suite
5. **Deployment**: Configure for production deployment
6. **Monitoring**: Add application performance monitoring

## API Documentation

For detailed API documentation, consider adding Swagger/OpenAPI documentation or use tools like Postman collections.