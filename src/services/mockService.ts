/**
 * Mock Service
 * Provides mock implementations for development and testing
 * Easily switchable between real API and mock data
 */

import { 
  User, 
  UserProfile, 
  ServiceListing, 
  JobRequest, 
  Bid, 
  Message, 
  Conversation, 
  Review 
} from '../types';

// Mock data generators
class MockDataGenerator {
  private users: User[] = [];
  private gigs: ServiceListing[] = [];
  private jobs: JobRequest[] = [];
  private bids: Bid[] = [];
  private conversations: Conversation[] = [];
  private messages: Message[] = [];
  private reviews: Review[] = [];

  constructor() {
    this.generateMockData();
  }

  private generateMockData(): void {
    this.users = this.generateUsers();
    this.gigs = this.generateGigs();
    this.jobs = this.generateJobs();
    this.bids = this.generateBids();
    this.conversations = this.generateConversations();
    this.messages = this.generateMessages();
    this.reviews = this.generateReviews();
  }

  private generateUsers(): User[] {
    const sampleUsers = [
      {
        id: 'user-1',
        email: 'alice@example.com',
        walletAddress: 'H2K8Zx9Y3a4B5c6D7e8F9g0H1i2J3k4L5m6N7o8P9q0',
        isVerified: true,
        createdAt: new Date('2023-01-15'),
        profile: {
          displayName: 'Alice Cooper',
          avatar: 'https://i.pravatar.cc/300?img=1',
          bio: 'Professional graphic designer with 8+ years of experience in branding and digital design.',
          skills: ['Graphic Design', 'Branding', 'UI/UX', 'Adobe Creative Suite'],
          location: {
            city: 'San Francisco',
            country: 'United States',
            geohash: '9q8yy'
          },
          portfolio: [
            {
              id: 'port-1',
              title: 'Brand Identity for Tech Startup',
              description: 'Complete brand identity package including logo, colors, and guidelines.',
              imageUrl: 'https://picsum.photos/400/300?random=1',
              ipfsHash: 'QmX1Y2Z3...',
              category: 'Branding'
            }
          ],
          rating: 4.8,
          completedJobs: 127,
          badges: []
        }
      },
      {
        id: 'user-2',
        email: 'bob@example.com',
        walletAddress: 'J3L9Xa1b2C3d4E5f6G7h8I9j0K1l2M3n4O5p6Q7r8S9t',
        isVerified: true,
        createdAt: new Date('2023-02-20'),
        profile: {
          displayName: 'Bob Martinez',
          avatar: 'https://i.pravatar.cc/300?img=2',
          bio: 'Full-stack developer specializing in modern web technologies and blockchain applications.',
          skills: ['React', 'Node.js', 'Solana', 'TypeScript', 'Python'],
          location: {
            city: 'Austin',
            country: 'United States',
            geohash: '9v6k3'
          },
          portfolio: [
            {
              id: 'port-2',
              title: 'DeFi Trading Platform',
              description: 'Built a decentralized trading platform on Solana with advanced features.',
              imageUrl: 'https://picsum.photos/400/300?random=2',
              ipfsHash: 'QmA2B3C4...',
              category: 'Development'
            }
          ],
          rating: 4.9,
          completedJobs: 89,
          badges: []
        }
      },
      {
        id: 'user-3',
        email: 'carol@example.com',
        walletAddress: 'M4N0Yb2c3D4e5F6g7H8i9J0k1L2m3N4o5P6q7R8s9T0u',
        isVerified: false,
        createdAt: new Date('2023-03-10'),
        profile: {
          displayName: 'Carol Chen',
          avatar: 'https://i.pravatar.cc/300?img=3',
          bio: 'Content writer and digital marketer helping brands tell their stories effectively.',
          skills: ['Content Writing', 'SEO', 'Social Media', 'Email Marketing'],
          location: {
            city: 'Toronto',
            country: 'Canada',
            geohash: 'dpz8'
          },
          portfolio: [],
          rating: 4.6,
          completedJobs: 43,
          badges: []
        }
      }
    ];

    return sampleUsers;
  }

  private generateGigs(): ServiceListing[] {
    const categories = ['Design', 'Development', 'Writing', 'Marketing', 'Consulting'];
    const subcategories = {
      'Design': ['Logo Design', 'Web Design', 'UI/UX', 'Branding'],
      'Development': ['Web Development', 'Mobile Apps', 'Blockchain', 'API Development'],
      'Writing': ['Blog Posts', 'Copywriting', 'Technical Writing', 'Social Media'],
      'Marketing': ['SEO', 'Social Media Marketing', 'Email Marketing', 'PPC'],
      'Consulting': ['Business Strategy', 'Financial Planning', 'Legal Advice', 'Career Coaching']
    };

    const sampleGigs: ServiceListing[] = [
      {
        id: 'gig-1',
        artisanId: 'user-1',
        title: 'Professional Logo Design for Your Brand',
        description: 'I will create a unique, professional logo that perfectly represents your brand identity. Includes multiple concepts, revisions, and final files in all formats.',
        category: 'Design',
        subcategory: 'Logo Design',
        priceModel: 'fixed',
        price: 150,
        currency: 'USDC',
        deliveryTime: 5,
        location: {
          city: 'San Francisco',
          country: 'United States',
          geohash: '9q8yy'
        },
        images: [
          'https://picsum.photos/600/400?random=10',
          'https://picsum.photos/600/400?random=11'
        ],
        tags: ['logo', 'branding', 'design', 'professional'],
        isActive: true,
        createdAt: new Date('2023-04-01')
      },
      {
        id: 'gig-2',
        artisanId: 'user-2',
        title: 'Custom Solana DApp Development',
        description: 'Full-stack development of decentralized applications on Solana blockchain. From smart contracts to frontend interfaces.',
        category: 'Development',
        subcategory: 'Blockchain',
        priceModel: 'hourly',
        price: 75,
        currency: 'SOL',
        deliveryTime: 14,
        location: {
          city: 'Austin',
          country: 'United States',
          geohash: '9v6k3'
        },
        images: [
          'https://picsum.photos/600/400?random=12',
          'https://picsum.photos/600/400?random=13'
        ],
        tags: ['solana', 'blockchain', 'dapp', 'web3'],
        isActive: true,
        createdAt: new Date('2023-04-05')
      },
      {
        id: 'gig-3',
        artisanId: 'user-3',
        title: 'SEO-Optimized Blog Content Writing',
        description: 'High-quality, researched blog posts optimized for search engines. Includes keyword research and meta descriptions.',
        category: 'Writing',
        subcategory: 'Blog Posts',
        priceModel: 'fixed',
        price: 50,
        currency: 'USDC',
        deliveryTime: 3,
        location: {
          city: 'Toronto',
          country: 'Canada',
          geohash: 'dpz8'
        },
        images: [
          'https://picsum.photos/600/400?random=14'
        ],
        tags: ['seo', 'content', 'blog', 'writing'],
        isActive: true,
        createdAt: new Date('2023-04-10')
      }
    ];

    return sampleGigs;
  }

  private generateJobs(): JobRequest[] {
    const sampleJobs: JobRequest[] = [
      {
        id: 'job-1',
        clientId: 'user-1',
        title: 'E-commerce Website Development',
        description: 'Looking for an experienced developer to build a modern e-commerce website with payment integration and admin panel.',
        category: 'Development',
        budget: {
          min: 2000,
          max: 5000,
          currency: 'USDC'
        },
        deadline: new Date('2024-06-01'),
        location: {
          city: 'Remote',
          country: 'Worldwide',
          geohash: '0000'
        },
        requirements: [
          'Experience with React/Next.js',
          'Payment gateway integration',
          'Responsive design',
          'Admin dashboard'
        ],
        attachments: [],
        status: 'open',
        bids: [],
        createdAt: new Date('2023-04-20')
      },
      {
        id: 'job-2',
        clientId: 'user-2',
        title: 'Brand Identity Design Package',
        description: 'Need a complete brand identity package for my new startup including logo, business cards, letterhead, and brand guidelines.',
        category: 'Design',
        budget: {
          min: 800,
          max: 1500,
          currency: 'SOL'
        },
        deadline: new Date('2024-05-15'),
        requirements: [
          'Logo design with multiple concepts',
          'Business card design',
          'Letterhead design',
          'Brand guidelines document'
        ],
        attachments: [],
        status: 'open',
        bids: [],
        createdAt: new Date('2023-04-22')
      }
    ];

    return sampleJobs;
  }

  private generateBids(): Bid[] {
    const sampleBids: Bid[] = [
      {
        id: 'bid-1',
        artisanId: 'user-2',
        jobId: 'job-1',
        amount: 3500,
        currency: 'USDC',
        deliveryTime: 21,
        proposal: 'I have 5+ years of experience building e-commerce platforms. I can deliver a modern, responsive website with all the features you need.',
        status: 'pending',
        createdAt: new Date('2023-04-21')
      },
      {
        id: 'bid-2',
        artisanId: 'user-1',
        jobId: 'job-2',
        amount: 1200,
        currency: 'SOL',
        deliveryTime: 10,
        proposal: 'I specialize in brand identity design and have worked with many startups. I can create a cohesive brand package that will make your business stand out.',
        status: 'pending',
        createdAt: new Date('2023-04-23')
      }
    ];

    return sampleBids;
  }

  private generateConversations(): Conversation[] {
    const sampleConversations: Conversation[] = [
      {
        id: 'conv-1',
        participants: ['user-1', 'user-2'],
        lastMessage: {
          id: 'msg-1',
          conversationId: 'conv-1',
          senderId: 'user-2',
          content: 'Hi Alice! I saw your logo design gig and I\'m interested in working with you.',
          timestamp: new Date('2023-04-25T10:30:00'),
          isRead: false
        },
        updatedAt: new Date('2023-04-25T10:30:00')
      },
      {
        id: 'conv-2',
        participants: ['user-1', 'user-3'],
        lastMessage: {
          id: 'msg-3',
          conversationId: 'conv-2',
          senderId: 'user-3',
          content: 'Thanks for the quick turnaround on the content! It looks great.',
          timestamp: new Date('2023-04-24T15:45:00'),
          isRead: true
        },
        updatedAt: new Date('2023-04-24T15:45:00')
      }
    ];

    return sampleConversations;
  }

  private generateMessages(): Message[] {
    const sampleMessages: Message[] = [
      {
        id: 'msg-1',
        conversationId: 'conv-1',
        senderId: 'user-2',
        content: 'Hi Alice! I saw your logo design gig and I\'m interested in working with you.',
        timestamp: new Date('2023-04-25T10:30:00'),
        isRead: false
      },
      {
        id: 'msg-2',
        conversationId: 'conv-1',
        senderId: 'user-1',
        content: 'Hi Bob! Thanks for reaching out. I\'d be happy to help you with your logo design. Can you tell me more about your project?',
        timestamp: new Date('2023-04-25T10:45:00'),
        isRead: true
      },
      {
        id: 'msg-3',
        conversationId: 'conv-2',
        senderId: 'user-3',
        content: 'Thanks for the quick turnaround on the content! It looks great.',
        timestamp: new Date('2023-04-24T15:45:00'),
        isRead: true
      }
    ];

    return sampleMessages;
  }

  private generateReviews(): Review[] {
    const sampleReviews: Review[] = [
      {
        id: 'review-1',
        jobId: 'job-completed-1',
        reviewerId: 'user-1',
        revieweeId: 'user-2',
        rating: 5,
        comment: 'Excellent work! Bob delivered exactly what I needed and was very professional throughout the project.',
        createdAt: new Date('2023-04-20')
      },
      {
        id: 'review-2',
        jobId: 'job-completed-2',
        reviewerId: 'user-2',
        revieweeId: 'user-3',
        rating: 4,
        comment: 'Great content writing skills. Carol understood the requirements well and delivered quality work on time.',
        createdAt: new Date('2023-04-18')
      }
    ];

    return sampleReviews;
  }

  // Getter methods
  getUsers(): User[] { return [...this.users]; }
  getGigs(): ServiceListing[] { return [...this.gigs]; }
  getJobs(): JobRequest[] { return [...this.jobs]; }
  getBids(): Bid[] { return [...this.bids]; }
  getConversations(): Conversation[] { return [...this.conversations]; }
  getMessages(): Message[] { return [...this.messages]; }
  getReviews(): Review[] { return [...this.reviews]; }

  // Helper methods
  getUserById(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }

  getGigById(id: string): ServiceListing | undefined {
    return this.gigs.find(gig => gig.id === id);
  }

  getJobById(id: string): JobRequest | undefined {
    return this.jobs.find(job => job.id === id);
  }

  getBidById(id: string): Bid | undefined {
    return this.bids.find(bid => bid.id === id);
  }

  getConversationById(id: string): Conversation | undefined {
    return this.conversations.find(conv => conv.id === id);
  }

  getMessageById(id: string): Message | undefined {
    return this.messages.find(msg => msg.id === id);
  }

  getReviewById(id: string): Review | undefined {
    return this.reviews.find(review => review.id === id);
  }
}

// Mock service implementations
class MockService {
  private mockData = new MockDataGenerator();
  private isEnabled = import.meta.env.VITE_USE_MOCK_API === 'true' || false;

  /**
   * Enable/disable mock mode
   */
  setMockMode(enabled: boolean): void {
    this.isEnabled = enabled;
    console.log(`Mock service ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Check if mock mode is enabled
   */
  isMockMode(): boolean {
    return this.isEnabled;
  }

  /**
   * Simulate API delay
   */
  private async delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Simulate API response
   */
  private async mockResponse<T>(data: T, delay: number = 500): Promise<T> {
    await this.delay(delay);
    return data;
  }

  /**
   * Mock user service methods
   */
  async getCurrentUser(): Promise<User> {
    return this.mockResponse(this.mockData.getUsers()[0]);
  }

  async getUserById(userId: string): Promise<User | null> {
    const user = this.mockData.getUserById(userId);
    return this.mockResponse(user || null);
  }

  async searchUsers(filters: any): Promise<{
    users: User[];
    total: number;
    hasMore: boolean;
  }> {
    const users = this.mockData.getUsers();
    return this.mockResponse({
      users: users.slice(0, filters.limit || 10),
      total: users.length,
      hasMore: users.length > (filters.limit || 10)
    });
  }

  /**
   * Mock gig service methods
   */
  async getGigs(filters?: any): Promise<{
    gigs: ServiceListing[];
    total: number;
    hasMore: boolean;
  }> {
    const gigs = this.mockData.getGigs();
    return this.mockResponse({
      gigs: gigs.slice(0, filters?.limit || 10),
      total: gigs.length,
      hasMore: gigs.length > (filters?.limit || 10),
      filters: {
        categories: ['Design', 'Development', 'Writing'],
        priceRange: { min: 50, max: 5000 },
        locations: ['San Francisco', 'Austin', 'Toronto']
      }
    });
  }

  async getGigById(gigId: string): Promise<ServiceListing | null> {
    const gig = this.mockData.getGigById(gigId);
    return this.mockResponse(gig || null);
  }

  /**
   * Mock job service methods
   */
  async getJobs(filters?: any): Promise<{
    jobs: JobRequest[];
    total: number;
    hasMore: boolean;
  }> {
    const jobs = this.mockData.getJobs();
    return this.mockResponse({
      jobs: jobs.slice(0, filters?.limit || 10),
      total: jobs.length,
      hasMore: jobs.length > (filters?.limit || 10)
    });
  }

  async getJobById(jobId: string): Promise<JobRequest | null> {
    const job = this.mockData.getJobById(jobId);
    return this.mockResponse(job || null);
  }

  /**
   * Mock bid service methods
   */
  async getBids(filters?: any): Promise<{
    bids: Bid[];
    total: number;
    hasMore: boolean;
  }> {
    const bids = this.mockData.getBids();
    return this.mockResponse({
      bids: bids.slice(0, filters?.limit || 10),
      total: bids.length,
      hasMore: bids.length > (filters?.limit || 10)
    });
  }

  async getBidById(bidId: string): Promise<Bid | null> {
    const bid = this.mockData.getBidById(bidId);
    return this.mockResponse(bid || null);
  }

  /**
   * Mock chat service methods
   */
  async getConversations(filters?: any): Promise<{
    conversations: Conversation[];
    total: number;
    hasMore: boolean;
  }> {
    const conversations = this.mockData.getConversations();
    return this.mockResponse({
      conversations: conversations.slice(0, filters?.limit || 10),
      total: conversations.length,
      hasMore: conversations.length > (filters?.limit || 10)
    });
  }

  async getMessages(conversationId: string, filters?: any): Promise<{
    messages: Message[];
    total: number;
    hasMore: boolean;
  }> {
    const messages = this.mockData.getMessages().filter(
      msg => msg.conversationId === conversationId
    );
    return this.mockResponse({
      messages: messages.slice(0, filters?.limit || 20),
      total: messages.length,
      hasMore: messages.length > (filters?.limit || 20)
    });
  }

  /**
   * Mock review service methods
   */
  async getReviews(filters?: any): Promise<{
    reviews: Review[];
    total: number;
    hasMore: boolean;
  }> {
    const reviews = this.mockData.getReviews();
    return this.mockResponse({
      reviews: reviews.slice(0, filters?.limit || 10),
      total: reviews.length,
      hasMore: reviews.length > (filters?.limit || 10),
      statistics: {
        averageRating: 4.7,
        totalCount: reviews.length
      }
    });
  }

  /**
   * Mock wallet service methods
   */
  async getWalletInfo(): Promise<any> {
    return this.mockResponse({
      address: 'H2K8Zx9Y3a4B5c6D7e8F9g0H1i2J3k4L5m6N7o8P9q0',
      balance: {
        sol: 12.5,
        usdc: 2500.0
      },
      tokens: [
        {
          mint: 'So11111111111111111111111111111111111111112',
          symbol: 'SOL',
          name: 'Solana',
          balance: 12.5,
          decimals: 9,
          logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png'
        },
        {
          mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
          symbol: 'USDC',
          name: 'USD Coin',
          balance: 2500.0,
          decimals: 6,
          logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png'
        }
      ],
      nfts: []
    });
  }

  async getTransactionHistory(): Promise<any> {
    return this.mockResponse({
      transactions: [
        {
          signature: '5j8WTjmZXy6F4x2vK9qB3nP8wR1tS0eL7gH6mC4dA9fE',
          type: 'payment',
          amount: 150,
          currency: 'USDC',
          from: 'client-wallet',
          to: 'artist-wallet',
          status: 'confirmed',
          timestamp: '2023-04-25T09:15:00Z',
          fee: 0.000005,
          memo: 'Payment for logo design'
        }
      ],
      total: 1,
      hasMore: false
    });
  }

  /**
   * Generate random data for testing
   */
  generateRandomUser(): User {
    const id = `user-${Date.now()}-${Math.random().toString(36).substring(2)}`;
    const names = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown'];
    const skills = ['React', 'Node.js', 'Python', 'Design', 'Marketing', 'Writing'];
    const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
    
    return {
      id,
      email: `${id}@example.com`,
      walletAddress: `${Math.random().toString(36).substring(2)}...`,
      isVerified: Math.random() > 0.3,
      createdAt: new Date(),
      profile: {
        displayName: names[Math.floor(Math.random() * names.length)],
        avatar: `https://i.pravatar.cc/300?img=${Math.floor(Math.random() * 70) + 1}`,
        bio: 'Generated user for testing purposes.',
        skills: skills.slice(0, Math.floor(Math.random() * 3) + 2),
        location: {
          city: cities[Math.floor(Math.random() * cities.length)],
          country: 'United States',
          geohash: Math.random().toString(36).substring(2, 7)
        },
        portfolio: [],
        rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
        completedJobs: Math.floor(Math.random() * 100),
        badges: []
      }
    };
  }

  /**
   * Reset mock data
   */
  resetData(): void {
    this.mockData = new MockDataGenerator();
  }

  /**
   * Add custom data
   */
  addUser(user: User): void {
    this.mockData.getUsers().push(user);
  }

  addGig(gig: ServiceListing): void {
    this.mockData.getGigs().push(gig);
  }

  addJob(job: JobRequest): void {
    this.mockData.getJobs().push(job);
  }
}

// Export singleton instance
export const mockService = new MockService();

// Export mock data generator for testing
export { MockDataGenerator };
