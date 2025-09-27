import { ReviewScraper } from "@/components/ReviewScraper";
import heroImage from "@/assets/hero-dashboard.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative bg-white">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium border border-blue-200">
                Professional Review Analytics Tool
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                SaaS Review
                <span className="text-blue-600"> Scraper</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Extract and analyze product reviews from G2, Capterra, and TrustPilot. 
                Get valuable customer insights with our professional-grade scraping tool.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8 bg-white min-h-screen">
        <ReviewScraper />
      </div>
    </div>
  );
};

export default Index;
