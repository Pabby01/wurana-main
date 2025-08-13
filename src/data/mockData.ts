import { JobPosting, EnhancedBid, Conversation, Message, BidProposal } from '../types';

// Mock job postings
export const mockJobPostings: JobPosting[] = [
  {
    id: '1',
    clientId: 'client-1',
    title: 'Modern E-commerce Website Development',
    description: 'We need a full-stack developer to build a modern e-commerce website with React, Node.js, and payment integration. The site should be responsive, fast, and SEO-optimized with a clean, modern design.',
    category: 'Web Development',
    subcategory: 'Full Stack',
    budget: {
      min: 15,
      max: 25,
      currency: 'SOL',
      type: 'fixed'
    },
    timeline: {
      duration: 6,
      unit: 'weeks',
      deadline: new Date(Date.now() + 6 * 7 * 24 * 60 * 60 * 1000)
    },
    location: {
      type: 'remote'
    },
    requirements: [
      'Minimum 3 years of React experience',
      'Experience with Node.js and Express',
      'Knowledge of payment gateways (Stripe, PayPal)',
      'Portfolio of similar projects'
    ],
    skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Stripe Integration'],
    qualifications: ['Bachelor\'s degree in Computer Science or related field', 'English proficiency'],
    attachments: [
      {
        id: 'att-1',
        name: 'project-wireframes.pdf',
        url: '/files/project-wireframes.pdf',
        type: 'application/pdf',
        size: 2048000,
        uploadedAt: new Date()
      }
    ],
    status: 'open',
    priority: 'high',
    visibility: 'public',
    bids: [],
    savedBy: ['freelancer-1', 'freelancer-2'],
    views: 45,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    id: '2',
    clientId: 'client-2',
    title: 'Mobile App UI/UX Design',
    description: 'Looking for a talented UI/UX designer to create a beautiful and intuitive mobile app design for iOS and Android. The app is a fitness tracker with social features.',
    category: 'Design',
    subcategory: 'Mobile Design',
    budget: {
      min: 8,
      max: 15,
      currency: 'SOL',
      type: 'fixed'
    },
    timeline: {
      duration: 4,
      unit: 'weeks',
      deadline: new Date(Date.now() + 4 * 7 * 24 * 60 * 60 * 1000)
    },
    location: {
      type: 'remote'
    },
    requirements: [
      'Experience with Figma or Sketch',
      'Mobile app design portfolio',
      'Understanding of iOS and Android design guidelines',
      'User research experience'
    ],
    skills: ['UI/UX Design', 'Figma', 'Mobile Design', 'Prototyping', 'User Research'],
    qualifications: ['Portfolio of mobile app designs', 'Strong communication skills'],
    attachments: [],
    status: 'open',
    priority: 'medium',
    visibility: 'public',
    bids: [],
    savedBy: ['freelancer-3'],
    views: 32,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
  },
  {
    id: '3',
    clientId: 'client-3',
    title: 'Blockchain Smart Contract Development',
    description: 'Need an experienced Solana developer to create smart contracts for a DeFi project. Must have experience with Rust and Anchor framework.',
    category: 'Blockchain',
    subcategory: 'Smart Contracts',
    budget: {
      min: 50,
      max: 80,
      currency: 'SOL',
      type: 'fixed'
    },
    timeline: {
      duration: 8,
      unit: 'weeks',
      deadline: new Date(Date.now() + 8 * 7 * 24 * 60 * 60 * 1000)
    },
    location: {
      type: 'remote'
    },
    requirements: [
      'Expert level Rust programming',
      'Solana development experience',
      'Anchor framework knowledge',
      'DeFi protocol understanding'
    ],
    skills: ['Rust', 'Solana', 'Anchor', 'Smart Contracts', 'DeFi'],
    qualifications: ['Minimum 2 years Solana development', 'Proven smart contract deployments'],
    attachments: [],
    status: 'open',
    priority: 'urgent',
    visibility: 'public',
    bids: [],
    savedBy: ['freelancer-4', 'freelancer-5'],
    views: 78,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
  },
  {
    id: '4',
    clientId: 'client-4',
    title: 'Content Writing for Tech Blog',
    description: 'Looking for a technical writer to create high-quality blog posts about AI, blockchain, and web development topics. Need 10 articles per month.',
    category: 'Writing',
    subcategory: 'Technical Writing',
    budget: {
      min: 5,
      max: 8,
      currency: 'SOL',
      type: 'hourly'
    },
    timeline: {
      duration: 3,
      unit: 'months',
      deadline: new Date(Date.now() + 3 * 30 * 24 * 60 * 60 * 1000)
    },
    location: {
      type: 'remote'
    },
    requirements: [
      'Technical writing experience',
      'Knowledge of AI/ML, blockchain, web dev',
      'SEO writing skills',
      'Native English speaker'
    ],
    skills: ['Technical Writing', 'SEO', 'AI/ML Knowledge', 'Blockchain', 'Content Strategy'],
    qualifications: ['Portfolio of technical articles', 'Bachelor\'s degree preferred'],
    attachments: [],
    status: 'open',
    priority: 'medium',
    visibility: 'public',
    bids: [],
    savedBy: [],
    views: 23,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  }
];

// Mock bids
export const mockBids: EnhancedBid[] = [
  {
    id: 'bid-1',
    artisanId: 'freelancer-1',
    jobId: '1',
    amount: 20,
    currency: 'SOL',
    deliveryTime: 42,
    proposal: {
      content: 'I have 5+ years of experience building e-commerce websites with React and Node.js. I can deliver a modern, responsive website with all the features you need including payment integration, product management, and user authentication.',
      timeline: {
        duration: 6,
        unit: 'weeks',
        milestones: [
          {
            id: 'm1',
            title: 'Design & Architecture',
            description: 'Complete UI/UX design and system architecture',
            amount: 5,
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            status: 'pending'
          },
          {
            id: 'm2',
            title: 'Frontend Development',
            description: 'React frontend with responsive design',
            amount: 8,
            dueDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
            status: 'pending'
          },
          {
            id: 'm3',
            title: 'Backend & Integration',
            description: 'API development and payment integration',
            amount: 7,
            dueDate: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000),
            status: 'pending'
          }
        ]
      },
      attachments: [],
      questions: ['Do you have a preferred payment gateway?', 'What hosting platform will you be using?']
    },
    freelancerProfile: {
      displayName: 'Alex Thompson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      rating: 4.9,
      completedJobs: 47,
      skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS'],
      location: 'San Francisco, USA'
    },
    status: 'pending',
    isShortlisted: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'bid-2',
    artisanId: 'freelancer-2',
    jobId: '1',
    amount: 18,
    currency: 'SOL',
    deliveryTime: 35,
    proposal: {
      content: 'Full-stack developer with expertise in React and Node.js. I can build your e-commerce site with modern technologies and best practices. Check my portfolio for similar projects.',
      timeline: {
        duration: 5,
        unit: 'weeks'
      },
      attachments: [
        {
          id: 'att-bid-1',
          name: 'portfolio-examples.pdf',
          url: '/files/portfolio-examples.pdf',
          type: 'application/pdf',
          size: 1024000,
          uploadedAt: new Date()
        }
      ]
    },
    freelancerProfile: {
      displayName: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612c495?w=150',
      rating: 4.8,
      completedJobs: 32,
      skills: ['React', 'Node.js', 'Python', 'PostgreSQL', 'Docker'],
      location: 'Toronto, Canada'
    },
    status: 'pending',
    isShortlisted: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  }
];

// Mock conversations
export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    participants: ['current-user', 'client-1'],
    type: 'project',
    projectId: '1',
    title: 'E-commerce Website Project',
    lastMessage: {
      id: 'msg-last-1',
      conversationId: 'conv-1',
      senderId: 'client-1',
      content: 'Thanks for the proposal! When can we start?',
      type: 'text',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      isRead: false
    },
    updatedAt: new Date(Date.now() - 30 * 60 * 1000),
    isArchived: false,
    isPinned: true,
    unreadCount: 2,
    metadata: {
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      description: 'Project discussion with John Smith'
    }
  },
  {
    id: 'conv-2',
    participants: ['current-user', 'freelancer-3'],
    type: 'direct',
    title: 'Design Collaboration',
    lastMessage: {
      id: 'msg-last-2',
      conversationId: 'conv-2',
      senderId: 'current-user',
      content: 'The mockups look great! 👍',
      type: 'text',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: true,
      reactions: [
        {
          emoji: '👍',
          userId: 'freelancer-3',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000)
        }
      ]
    },
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isArchived: false,
    isPinned: false,
    unreadCount: 0,
    metadata: {
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
    }
  },
  {
    id: 'conv-3',
    participants: ['current-user', 'support'],
    type: 'direct',
    title: 'Support Team',
    lastMessage: {
      id: 'msg-last-3',
      conversationId: 'conv-3',
      senderId: 'support',
      content: 'Your issue has been resolved. Is there anything else I can help you with?',
      type: 'text',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      isRead: true
    },
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    isArchived: false,
    isPinned: false,
    unreadCount: 0,
    metadata: {
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      description: 'Platform support'
    }
  }
];

// Mock messages for a conversation
export const mockMessages: Message[] = [
  {
    id: 'msg-1',
    conversationId: 'conv-1',
    senderId: 'current-user',
    content: 'Hi! I saw your job posting for the e-commerce website. I have extensive experience with React and Node.js.',
    type: 'text',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    isRead: true
  },
  {
    id: 'msg-2',
    conversationId: 'conv-1',
    senderId: 'client-1',
    content: 'Great! Could you share some examples of your previous work?',
    type: 'text',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
    isRead: true
  },
  {
    id: 'msg-3',
    conversationId: 'conv-1',
    senderId: 'current-user',
    content: 'Absolutely! Here are some of my recent e-commerce projects.',
    type: 'text',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    isRead: true,
    attachments: [
      {
        id: 'att-msg-1',
        name: 'portfolio-samples.pdf',
        url: '/files/portfolio-samples.pdf',
        type: 'application/pdf',
        size: 3072000
      },
      {
        id: 'att-msg-2',
        name: 'ecommerce-screenshot.png',
        url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300',
        type: 'image/png',
        size: 512000
      }
    ]
  },
  {
    id: 'msg-4',
    conversationId: 'conv-1',
    senderId: 'client-1',
    content: 'Impressive work! What\'s your estimated timeline for this project?',
    type: 'text',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    isRead: true
  },
  {
    id: 'msg-5',
    conversationId: 'conv-1',
    senderId: 'current-user',
    content: 'I can complete it in 6 weeks with regular updates and milestones. Would you like me to submit a formal proposal?',
    type: 'text',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
    isRead: true
  },
  {
    id: 'msg-6',
    conversationId: 'conv-1',
    senderId: 'client-1',
    content: 'Thanks for the proposal! When can we start?',
    type: 'text',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    isRead: false
  }
];

// Categories and skills for filtering
export const jobCategories = [
  'Web Development',
  'Mobile Development',
  'UI/UX Design',
  'Graphic Design',
  'Content Writing',
  'Digital Marketing',
  'SEO',
  'Video Editing',
  'Photography',
  'Translation',
  'Virtual Assistant',
  'Data Entry',
  'Social Media Management',
  'Blockchain Development',
  'AI/ML',
  'DevOps',
  'Cybersecurity',
  'Business Consulting',
  'Accounting',
  'Legal Services'
];

export const skillsList = [
  'React', 'Vue.js', 'Angular', 'Node.js', 'Python', 'JavaScript', 'TypeScript',
  'Solana', 'Ethereum', 'Rust', 'Figma', 'Adobe Creative Suite', 'WordPress',
  'Shopify', 'MongoDB', 'PostgreSQL', 'MySQL', 'AWS', 'Docker', 'Git',
  'API Development', 'Mobile App Development', 'iOS', 'Android', 'React Native',
  'Flutter', 'UI Design', 'UX Research', 'SEO Optimization', 'Content Marketing',
  'Social Media Marketing', 'Email Marketing', 'PPC Advertising', 'Analytics',
  'Photoshop', 'Illustrator', 'After Effects', 'Premiere Pro', 'Blender',
  'Unity', 'Machine Learning', 'Data Science', 'Artificial Intelligence',
  'Blockchain', 'Smart Contracts', 'DeFi', 'NFTs', 'Cybersecurity'
];

export const countries = [
  'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Spain',
  'Italy', 'Netherlands', 'Australia', 'New Zealand', 'Japan', 'South Korea',
  'Singapore', 'Hong Kong', 'India', 'Brazil', 'Mexico', 'Argentina',
  'South Africa', 'Poland', 'Czech Republic', 'Ukraine', 'Russia'
];
