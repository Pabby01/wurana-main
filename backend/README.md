# Wurana Backend

A robust Node.js backend service for the Wurana platform, providing authentication, job management, real-time chat, and Web3 integration.

## Features

- **Authentication System**
  - JWT-based authentication
  - User registration and login
  - Password encryption
  - Session management

- **Web3 Integration**
  - Solana wallet integration
  - Civic identity verification
  - Secure transaction handling

- **Job Management**
  - Create and manage job listings
  - Bidding system
  - Job status tracking
  - Payment milestone management

- **Real-time Chat**
  - Socket.IO integration
  - Private messaging
  - File attachments
  - Read receipts

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager
- Solana CLI tools (optional)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment configuration:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration values

## Configuration

The application uses environment variables for configuration. Copy `.env.example` to `.env` and update the values:

- `PORT`: Server port (default: 3000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `CLIENT_URL`: Frontend application URL
- `SOLANA_NETWORK`: Solana network (mainnet, testnet, or devnet)
- `CIVIC_APP_ID`: Civic application ID

## Running the Application

### Development

```bash
npm run dev
```

This will start the server in development mode with hot reloading.

### Production

```bash
npm start
```

This will start the server in production mode.

## API Documentation

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/wallet/connect` - Connect wallet
- `POST /api/auth/civic/verify` - Verify Civic identity
- `GET /api/auth/me` - Get current user

### Jobs

- `POST /api/jobs` - Create new job
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get job by ID
- `PUT /api/jobs/:id` - Update job
- `POST /api/jobs/:id/bid` - Submit bid
- `POST /api/jobs/:jobId/bid/:bidId/accept` - Accept bid
- `POST /api/jobs/:id/complete` - Complete job

### Chat

- `POST /api/chat` - Initialize chat
- `GET /api/chat` - Get user's chats
- `GET /api/chat/:id` - Get chat by ID
- `POST /api/chat/:id/messages` - Send message
- `POST /api/chat/:id/archive` - Archive chat

## WebSocket Events

### Chat Events

- `join_room` - Join a chat room
- `leave_room` - Leave a chat room
- `send_message` - Send a message
- `receive_message` - Receive a message

## Error Handling

The API uses standard HTTP status codes and returns errors in the following format:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information (development only)"
}
```

## Security

- JWT authentication
- Request rate limiting
- Input validation
- XSS protection
- CORS configuration
- Helmet security headers

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.