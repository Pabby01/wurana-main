import { Connection, clusterApiUrl, Keypair, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import { Metaplex, bundlrStorage, keypairIdentity } from '@metaplex-foundation/js';
import config from './config.js';
import { logError, logInfo } from './logger.js';

class SolanaService {
  constructor() {
    this.connection = null;
    this.provider = null;
    this.escrowProgram = null;
    this.treasuryKeypair = null;
    this.metaplex = null;
  }

  async initialize() {
    try {
      // Initialize Solana connection
      const endpoint = config.solana.rpcEndpoint || clusterApiUrl(config.solana.network);
      this.connection = new Connection(endpoint, 'confirmed');

      // Initialize treasury wallet
      if (config.solana.treasuryWallet) {
        const secretKey = Buffer.from(config.solana.treasuryWallet, 'base64');
        this.treasuryKeypair = Keypair.fromSecretKey(secretKey);
      }

      // Initialize Anchor provider
      const opts = {
        preflightCommitment: 'confirmed',
        commitment: 'confirmed',
      };

      this.provider = new AnchorProvider(
        this.connection,
        this.treasuryKeypair,
        opts
      );

      // Initialize Metaplex
      this.metaplex = Metaplex.make(this.connection)
        .use(keypairIdentity(this.treasuryKeypair))
        .use(bundlrStorage({
          address: config.solana.network === 'devnet' ? 'https://devnet.bundlr.network' : 'https://node1.bundlr.network',
          providerUrl: endpoint,
          timeout: 60000,
        }));

      // Initialize escrow program if program ID is provided
      if (config.solana.escrowProgramId) {
        this.escrowProgram = new Program(
          require('../idl/escrow.json'),
          config.solana.escrowProgramId,
          this.provider
        );
      }

      logInfo('Solana service initialized successfully');
      return true;
    } catch (error) {
      logError('Error initializing Solana service:', error);
      throw error;
    }
  }

  // Connection methods
  async getBalance(publicKey) {
    try {
      const balance = await this.connection.getBalance(new web3.PublicKey(publicKey));
      return balance / web3.LAMPORTS_PER_SOL;
    } catch (error) {
      logError('Error getting balance:', error);
      throw error;
    }
  }

  async getRecentBlockhash() {
    try {
      const { blockhash } = await this.connection.getLatestBlockhash();
      return blockhash;
    } catch (error) {
      logError('Error getting recent blockhash:', error);
      throw error;
    }
  }

  // Transaction validation and security methods
  async validateTransaction(transaction, signers) {
    if (!transaction || !signers || signers.length === 0) {
      throw new Error('Invalid transaction or signers');
    }

    // Validate all signers have valid keypairs
    signers.forEach(signer => {
      if (!signer.publicKey || !signer.secretKey) {
        throw new Error('Invalid signer keypair');
      }
    });

    // Validate transaction size
    const serializedTx = transaction.serialize();
    if (serializedTx.length > 1232) {
      throw new Error('Transaction too large');
    }

    return true;
  }

  async validateTransactionFees(transaction) {
    try {
      const fees = await this.connection.getFeeForMessage(
        transaction.compileMessage(),
        'confirmed'
      );

      // Ensure fee is within acceptable range
      if (fees.value > web3.LAMPORTS_PER_SOL * 0.1) { // Max 0.1 SOL fee
        throw new Error('Transaction fee too high');
      }

      return fees.value;
    } catch (error) {
      logError('Error validating transaction fees:', error);
      throw error;
    }
  }

  // Transaction methods
  async sendTransaction(transaction, signers) {
    try {
      // Validate transaction and signers
      await this.validateTransaction(transaction, signers);

      // Get recent blockhash and validate fees
      transaction.recentBlockhash = await this.getRecentBlockhash();
      transaction.feePayer = signers[0].publicKey;
      await this.validateTransactionFees(transaction);

      // Sign transaction
      transaction.sign(...signers);

      // Send transaction with preflight checks
      const signature = await this.connection.sendRawTransaction(
        transaction.serialize(),
        {
          skipPreflight: false,
          preflightCommitment: 'confirmed',
          maxRetries: 3,
        }
      );

      // Confirm transaction with strict commitment
      const confirmation = await this.connection.confirmTransaction({
        signature,
        blockhash: transaction.recentBlockhash,
        lastValidBlockHeight: await this.connection.getBlockHeight(),
      }, 'confirmed');

      if (confirmation.value.err) {
        throw new Error(`Transaction failed: ${confirmation.value.err}`);
      }

      // Log successful transaction
      logInfo('Transaction successful:', {
        signature,
        slot: confirmation.context.slot,
        confirmationStatus: 'confirmed',
      });

      return signature;
    } catch (error) {
      logError('Error sending transaction:', error);
      throw error;
    }
  }

  // Escrow methods
  async createEscrow(amount, buyer, seller) {
    if (!this.escrowProgram) {
      throw new Error('Escrow program not initialized');
    }

    try {
      const escrowAccount = web3.Keypair.generate();
      
      const tx = await this.escrowProgram.methods
        .initialize(new web3.BN(amount * web3.LAMPORTS_PER_SOL))
        .accounts({
          escrow: escrowAccount.publicKey,
          buyer: new web3.PublicKey(buyer),
          seller: new web3.PublicKey(seller),
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([escrowAccount])
        .rpc();

      return {
        signature: tx,
        escrowAccount: escrowAccount.publicKey.toString(),
      };
    } catch (error) {
      logError('Error creating escrow:', error);
      throw error;
    }
  }

  async releaseEscrow(escrowAccount, seller) {
    if (!this.escrowProgram) {
      throw new Error('Escrow program not initialized');
    }

    try {
      const tx = await this.escrowProgram.methods
        .release()
        .accounts({
          escrow: new web3.PublicKey(escrowAccount),
          seller: new web3.PublicKey(seller),
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      return tx;
    } catch (error) {
      logError('Error releasing escrow:', error);
      throw error;
    }
  }

  async refundEscrow(escrowAccount, buyer) {
    if (!this.escrowProgram) {
      throw new Error('Escrow program not initialized');
    }

    try {
      const tx = await this.escrowProgram.methods
        .refund()
        .accounts({
          escrow: new web3.PublicKey(escrowAccount),
          buyer: new web3.PublicKey(buyer),
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      return tx;
    } catch (error) {
      logError('Error refunding escrow:', error);
      throw error;
    }
  }

  // NFT methods
  async mintNFT(recipient, metadata) {
    try {
      if (!this.metaplex) {
        throw new Error('Metaplex not initialized');
      }

      const recipientPublicKey = new PublicKey(recipient);

      // Upload metadata to Arweave
      const { uri } = await this.metaplex.nfts().uploadMetadata({
        name: metadata.name,
        description: metadata.description,
        image: metadata.image,
        attributes: metadata.attributes,
        external_url: metadata.external_url,
        animation_url: metadata.animation_url
      });

      // Create NFT
      const { nft } = await this.metaplex.nfts().create({
        uri,
        name: metadata.name,
        sellerFeeBasisPoints: 0,
        updateAuthority: this.treasuryKeypair,
        tokenOwner: recipientPublicKey,
        collection: metadata.collectionDetails ? new PublicKey(metadata.collectionDetails.collectionMint) : null,
        uses: null,
      });

      return {
        mintAddress: nft.address.toString(),
        transactionHash: nft.response.signature,
        metadata: {
          ...metadata,
          uri
        }
      };
    } catch (error) {
      logError('Error minting NFT:', error);
      throw error;
    }
  }

  async verifyNFTCollection(nftMint, collectionMint) {
    try {
      if (!this.metaplex) {
        throw new Error('Metaplex not initialized');
      }

      const { response } = await this.metaplex.nfts().verifyCollection({
        mintAddress: new PublicKey(nftMint),
        collectionMintAddress: new PublicKey(collectionMint),
        isSizedCollection: true,
      });

      return response.signature;
    } catch (error) {
      logError('Error verifying NFT collection:', error);
      throw error;
    }
  }

  async getNFTMetadata(mintAddress) {
    try {
      if (!this.metaplex) {
        throw new Error('Metaplex not initialized');
      }

      const nft = await this.metaplex.nfts().findByMint({
        mintAddress: new PublicKey(mintAddress),
      });

      return nft;
    } catch (error) {
      logError('Error fetching NFT metadata:', error);
      throw error;
    }
  }
}

// Create and export Solana service instance
const solanaService = new SolanaService();
export default solanaService;