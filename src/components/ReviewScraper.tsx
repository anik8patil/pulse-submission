import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar, Download, Search, Star, Settings } from "lucide-react";
import { ReviewScrapingService, type ScrapeParams, type Review } from "@/services/ReviewScrapingService";
import { ApiKeyManager } from "@/components/ApiKeyManager";

interface ScrapeFormData {
  companyName: string;
  startDate: string;
  endDate: string;
  source: string;
}

export const ReviewScraper = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ScrapeFormData>({
    companyName: '',
    startDate: '',
    endDate: '',
    source: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showApiConfig, setShowApiConfig] = useState(false);

  const handleInputChange = (field: keyof ScrapeFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.companyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a company name",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.startDate || !formData.endDate) {
      toast({
        title: "Error", 
        description: "Please select both start and end dates",
        variant: "destructive",
      });
      return false;
    }
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      toast({
        title: "Error",
        description: "Start date must be before end date",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.source) {
      toast({
        title: "Error",
        description: "Please select a review source",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const simulateScraping = async () => {
    try {
      const params: ScrapeParams = {
        companyName: formData.companyName,
        startDate: formData.startDate,
        endDate: formData.endDate,
        source: formData.source as 'g2' | 'capterra' | 'trustpilot'
      };

      const result = await ReviewScrapingService.scrapeReviews(params);
      
      if (result.success) {
        setReviews(result.reviews);
      } else {
        throw new Error(result.error || 'Failed to scrape reviews');
      }
    } catch (error) {
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setProgress(0);
    setReviews([]);

    try {
      // Simulate progress
      const intervals = [20, 40, 60, 80, 100];
      for (let i = 0; i < intervals.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setProgress(intervals[i]);
      }

      await simulateScraping();

      toast({
        title: "Success",
        description: `Found ${reviews.length} reviews for ${formData.companyName}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to scrape reviews. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setProgress(100);
    }
  };

  const exportToJSON = () => {
    const data = {
      company: formData.companyName,
      source: formData.source,
      dateRange: {
        start: formData.startDate,
        end: formData.endDate
      },
      totalReviews: reviews.length,
      reviews: reviews
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.companyName}-reviews-${formData.source}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-accent fill-accent' : 'text-muted-foreground'}`}
      />
    ));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Review Scraper</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Extract and analyze product reviews from G2, Capterra, and TrustPilot to gain valuable insights
        </p>
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            onClick={() => setShowApiConfig(!showApiConfig)}
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            API Configuration
          </Button>
        </div>
      </div>

      {showApiConfig && (
        <div className="max-w-2xl mx-auto">
          <ApiKeyManager />
        </div>
      )}

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Scraping Configuration
          </CardTitle>
          <CardDescription>
            Configure your review scraping parameters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="Enter company name"
                  className="transition-all duration-200"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="source">Review Source</Label>
                <Select value={formData.source} onValueChange={(value) => handleInputChange('source', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select review source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="g2">G2</SelectItem>
                    <SelectItem value="capterra">Capterra</SelectItem>
                    <SelectItem value="trustpilot">TrustPilot</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className="transition-all duration-200"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className="transition-all duration-200"
                />
              </div>
            </div>

            {isLoading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Scraping in progress...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto shadow-card hover:shadow-card-hover transition-all duration-200"
            >
              {isLoading ? "Scraping Reviews..." : "Start Scraping"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {reviews.length > 0 && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Scraped Reviews ({reviews.length})</h2>
            <Button onClick={exportToJSON} variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export JSON
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {reviews.map((review, index) => (
              <Card key={index} className="shadow-card hover:shadow-card-hover transition-all duration-200">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-foreground">{review.title}</h3>
                      <Badge variant="secondary" className="ml-4">
                        {review.source}
                      </Badge>
                    </div>
                    
                    {review.rating && (
                      <div className="flex items-center gap-2">
                        <div className="flex">{renderStars(review.rating)}</div>
                        <span className="text-sm text-muted-foreground">({review.rating}/5)</span>
                      </div>
                    )}
                    
                    <p className="text-muted-foreground leading-relaxed">{review.description}</p>
                    
                    <div className="flex justify-between items-center pt-4 border-t">
                      <span className="text-sm text-muted-foreground">
                        {review.reviewer && `By ${review.reviewer}`}
                      </span>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {new Date(review.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};