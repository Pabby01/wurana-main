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

  // NFT and Metaplex configuration
  nft: {
    mintAuthority: process.env.NFT_MINT_AUTHORITY,
    metadataProgram: process.env.NFT_METADATA_PROGRAM,
    collectionMint: process.env.NFT_COLLECTION_MINT,
    sellerFeeBasisPoints: parseInt(process.env.NFT_SELLER_FEE_BASIS_POINTS || '0'),
    symbol: process.env.NFT_SYMBOL || 'WRN',
    creators: process.env.NFT_CREATORS ? JSON.parse(process.env.NFT_CREATORS) : [],
  },
  metaplex: {
    bundlrAddress: process.env.BUNDLR_ADDRESS || 'https://node1.bundlr.network',
    storageType: process.env.STORAGE_TYPE || 'bundlr',
    uploadTimeout: parseInt(process.env.UPLOAD_TIMEOUT || '60000'),
    maxRetries: parseInt(process.env.MAX_RETRIES || '3'),
    defaultCollection: {
      name: process.env.DEFAULT_COLLECTION_NAME || 'Wurana Collection',
      symbol: process.env.DEFAULT_COLLECTION_SYMBOL || 'WRNC',
      description: process.env.DEFAULT_COLLECTION_DESCRIPTION || 'Official Wurana NFT Collection',
      sellerFeeBasisPoints: parseInt(process.env.DEFAULT_COLLECTION_FEE || '0'),
    }
  },
};

module.exports = config;