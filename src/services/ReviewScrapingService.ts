export interface Review {
  title: string;
  description: string;
  date: string;
  rating?: number;
  reviewer?: string;
  source: string;
}

export interface ScrapeParams {
  companyName: string;
  startDate: string;
  endDate: string;
  source: 'g2' | 'capterra' | 'trustpilot';
}

export interface ScrapeResult {
  success: boolean;
  reviews: Review[];
  totalFound: number;
  error?: string;
}

export class ReviewScrapingService {
  private static API_KEY_STORAGE_KEY = 'review_scraper_api_key';

  static saveApiKey(apiKey: string): void {
    localStorage.setItem(this.API_KEY_STORAGE_KEY, apiKey);
    console.log('API key saved successfully');
  }

  static getApiKey(): string | null {
    return localStorage.getItem(this.API_KEY_STORAGE_KEY);
  }

  static async testApiKey(apiKey: string): Promise<boolean> {
    try {
      // Simulate API key validation
      await new Promise(resolve => setTimeout(resolve, 1000));
      return apiKey.length > 10; // Simple validation
    } catch (error) {
      console.error('Error testing API key:', error);
      return false;
    }
  }

  static buildSearchUrl(params: ScrapeParams): string {
    const { companyName, source } = params;
    const encodedCompany = encodeURIComponent(companyName);
    
    switch (source) {
      case 'g2':
        return `https://www.g2.com/search?query=${encodedCompany}`;
      case 'capterra':
        return `https://www.capterra.com/search/?query=${encodedCompany}`;
      case 'trustpilot':
        return `https://www.trustpilot.com/search?query=${encodedCompany}`;
      default:
        throw new Error('Invalid source specified');
    }
  }

  static parseG2Reviews(content: string): Review[] {
    // Parse G2 reviews from scraped content
    // This is a simplified parser - in real implementation, 
    // you'd use proper HTML parsing and data extraction
    const reviews: Review[] = [];
    
    // Mock implementation for demo
    const mockReviews = [
      {
        title: "Great product for enterprise needs",
        description: "We've been using this solution for over a year and it's significantly improved our workflow efficiency.",
        date: "2024-01-10",
        rating: 5,
        reviewer: "Enterprise User",
        source: "g2"
      }
    ];
    
    return mockReviews;
  }

  static parseCapterraReviews(content: string): Review[] {
    // Parse Capterra reviews from scraped content
    const mockReviews = [
      {
        title: "Solid functionality with room for improvement",
        description: "The core features work well, but the user interface could be more intuitive. Customer support is responsive.",
        date: "2024-02-05",
        rating: 4,
        reviewer: "Small Business Owner",
        source: "capterra"
      }
    ];
    
    return mockReviews;
  }

  static parseTrustPilotReviews(content: string): Review[] {
    // Parse TrustPilot reviews from scraped content
    const mockReviews = [
      {
        title: "Excellent customer service experience",
        description: "Quick response times and knowledgeable support staff. The product meets all our requirements.",
        date: "2024-01-28",
        rating: 5,
        reviewer: "Verified Customer",
        source: "trustpilot"
      }
    ];
    
    return mockReviews;
  }

  static filterReviewsByDate(reviews: Review[], startDate: string, endDate: string): Review[] {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return reviews.filter(review => {
      const reviewDate = new Date(review.date);
      return reviewDate >= start && reviewDate <= end;
    });
  }

  static async scrapeReviews(params: ScrapeParams): Promise<ScrapeResult> {
    // For demonstration purposes, use mock data
    // In production, you would integrate with the actual Firecrawl API
    return this.generateMockReviews(params);
  }

  static generateCompanySpecificReviews(companyName: string, source: string): Review[] {
    const reviewTemplates = [
      {
        title: `${companyName} has transformed our workflow`,
        description: `Since implementing ${companyName}, our team productivity has increased significantly. The integration process was smooth and the features align perfectly with our business needs.`,
        rating: 5,
        reviewer: "Sarah Chen, Operations Director"
      },
      {
        title: `Great ROI with ${companyName}`,
        description: `We've seen excellent return on investment with ${companyName}. The analytics and reporting features have given us insights we never had before.`,
        rating: 5,
        reviewer: "Michael Rodriguez, Finance Manager"
      },
      {
        title: `${companyName} - Good but has room for improvement`,
        description: `${companyName} covers most of our requirements well, but the user interface could be more intuitive. Customer support is responsive when needed.`,
        rating: 4,
        reviewer: "Jennifer Liu, Product Manager"
      },
      {
        title: `Reliable solution - ${companyName}`,
        description: `We've been using ${companyName} for several months without major issues. The stability and performance are impressive for our growing team.`,
        rating: 4,
        reviewer: "David Thompson, CTO"
      },
      {
        title: `${companyName} is feature-rich but complex`,
        description: `${companyName} offers comprehensive functionality, but it can be overwhelming for smaller teams. The learning curve is steep but worth it for larger organizations.`,
        rating: 3,
        reviewer: "Lisa Park, Small Business Owner"
      },
      {
        title: `Outstanding customer support from ${companyName}`,
        description: `What sets ${companyName} apart is their exceptional customer service. Quick response times and knowledgeable staff make all the difference.`,
        rating: 5,
        reviewer: "Robert Kim, IT Director"
      }
    ];

    // Generate random dates within the last 3 months
    const dates = ['2024-01-10', '2024-01-22', '2024-02-03', '2024-02-15', '2024-02-28', '2024-03-05'];
    
    return reviewTemplates.map((template, index) => ({
      ...template,
      date: dates[index % dates.length],
      source
    }));
  }

  // Generate mock data for demonstration
  static async generateMockReviews(params: ScrapeParams): Promise<ScrapeResult> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate different reviews based on company name
    const companySpecificReviews = this.generateCompanySpecificReviews(params.companyName, params.source);
    
    // Add some randomness to make it more realistic
    const shuffledReviews = companySpecificReviews.sort(() => Math.random() - 0.5);
    const selectedReviews = shuffledReviews.slice(0, Math.floor(Math.random() * 3) + 3); // 3-5 reviews

    // Filter by date range
    const filteredReviews = this.filterReviewsByDate(selectedReviews, params.startDate, params.endDate);

    return {
      success: true,
      reviews: filteredReviews,
      totalFound: filteredReviews.length
    };
  }
}