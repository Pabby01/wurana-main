import { web3, BN } from '@project-serum/anchor';
import { expect } from 'chai';
import sinon from 'sinon';
import solanaService from '../../src/config/solana.js';

describe('Solana Service', () => {
  let sandbox;
  
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('Transaction Validation', () => {
    it('should validate transaction with valid signers', async () => {
      const transaction = new web3.Transaction();
      const signer = web3.Keypair.generate();
      
      const result = await solanaService.validateTransaction(transaction, [signer]);
      expect(result).to.be.true;
    });

    it('should reject transaction with invalid signers', async () => {
      const transaction = new web3.Transaction();
      const invalidSigner = { publicKey: null, secretKey: null };
      
      try {
        await solanaService.validateTransaction(transaction, [invalidSigner]);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.equal('Invalid signer keypair');
      }
    });

    it('should validate transaction fees within limit', async () => {
      const transaction = new web3.Transaction();
      const mockFees = { value: web3.LAMPORTS_PER_SOL * 0.01 }; // 0.01 SOL
      
      sandbox.stub(solanaService.connection, 'getFeeForMessage').resolves(mockFees);
      
      const fees = await solanaService.validateTransactionFees(transaction);
      expect(fees).to.equal(mockFees.value);
    });

    it('should reject transaction with excessive fees', async () => {
      const transaction = new web3.Transaction();
      const mockFees = { value: web3.LAMPORTS_PER_SOL * 0.2 }; // 0.2 SOL
      
      sandbox.stub(solanaService.connection, 'getFeeForMessage').resolves(mockFees);
      
      try {
        await solanaService.validateTransactionFees(transaction);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.equal('Transaction fee too high');
      }
    });
  });

  describe('NFT Minting', () => {
    const mockMetadata = {
      name: 'Test NFT',
      description: 'Test Description',
      image: 'https://test.com/image.png',
      attributes: [{ trait_type: 'Test', value: 'Value' }]
    };

    it('should successfully mint NFT', async () => {
      const recipient = web3.Keypair.generate().publicKey;
      const mockUri = 'https://arweave.net/metadata';
      const mockNft = {
        address: web3.Keypair.generate().publicKey,
        response: { signature: 'mock_signature' }
      };

      sandbox.stub(solanaService.metaplex.nfts(), 'uploadMetadata').resolves({ uri: mockUri });
      sandbox.stub(solanaService.metaplex.nfts(), 'create').resolves({ nft: mockNft });

      const result = await solanaService.mintNFT(recipient.toString(), mockMetadata);

      expect(result).to.have.property('mintAddress');
      expect(result).to.have.property('transactionHash');
      expect(result.metadata).to.have.property('uri', mockUri);
    });

    it('should verify NFT collection', async () => {
      const nftMint = web3.Keypair.generate().publicKey;
      const collectionMint = web3.Keypair.generate().publicKey;
      const mockSignature = 'mock_signature';

      sandbox.stub(solanaService.metaplex.nfts(), 'verifyCollection')
        .resolves({ response: { signature: mockSignature } });

      const signature = await solanaService.verifyNFTCollection(
        nftMint.toString(),
        collectionMint.toString()
      );

      expect(signature).to.equal(mockSignature);
    });

    it('should fetch NFT metadata', async () => {
      const mintAddress = web3.Keypair.generate().publicKey;
      const mockNftData = {
        name: 'Test NFT',
        uri: 'https://arweave.net/metadata',
        symbol: 'TEST'
      };

      sandbox.stub(solanaService.metaplex.nfts(), 'findByMint').resolves(mockNftData);

      const nftData = await solanaService.getNFTMetadata(mintAddress.toString());

      expect(nftData).to.deep.equal(mockNftData);
    });
  });

  describe('Error Handling', () => {
    it('should handle metaplex initialization error', async () => {
      solanaService.metaplex = null;
      const recipient = web3.Keypair.generate().publicKey;

      try {
        await solanaService.mintNFT(recipient.toString(), {});
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.equal('Metaplex not initialized');
      }
    });

    it('should handle transaction validation errors', async () => {
      const transaction = new web3.Transaction();
      
      try {
        await solanaService.validateTransaction(transaction, []);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.equal('Invalid transaction or signers');
      }
    });
  });
});