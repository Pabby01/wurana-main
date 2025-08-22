const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/wurana',
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  
  // Solana configuration
  solana: {
    network: process.env.SOLANA_NETWORK || 'devnet',
    rpcEndpoint: process.env.SOLANA_RPC_ENDPOINT || 'https://api.devnet.solana.com',
    escrowProgramId: process.env.SOLANA_ESCROW_PROGRAM_ID,
    treasuryWallet: process.env.SOLANA_TREASURY_WALLET,
  },

  // PAJ Cash API configuration
  pajCash: {
    apiKey: process.env.PAJ_CASH_API_KEY,
    apiSecret: process.env.PAJ_CASH_API_SECRET,
    baseUrl: process.env.PAJ_CASH_API_URL || 'https://api.pajcash.com',
  },

  // AWS S3 configuration for file uploads
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'us-east-1',
    bucketName: process.env.AWS_BUCKET_NAME,
  },

  // Rate limiting configuration
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },

  // CORS configuration
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  },

  // Socket.IO configuration
  socket: {
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
      credentials: true,
    },
  },

  // NFT configuration
  nft: {
    mintAuthority: process.env.NFT_MINT_AUTHORITY,
    metadataProgram: process.env.NFT_METADATA_PROGRAM,
    collectionMint: process.env.NFT_COLLECTION_MINT,
  },
};

module.exports = config;