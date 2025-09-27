import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Key, CheckCircle, AlertCircle } from "lucide-react";
import { ReviewScrapingService } from "@/services/ReviewScrapingService";

export const ApiKeyManager = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [keyStatus, setKeyStatus] = useState<'none' | 'valid' | 'invalid'>('none');
  const existingKey = ReviewScrapingService.getApiKey();

  const handleSaveKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter an API key",
        variant: "destructive",
      });
      return;
    }

    setIsTestingKey(true);
    
    try {
      const isValid = await ReviewScrapingService.testApiKey(apiKey);
      
      if (isValid) {
        ReviewScrapingService.saveApiKey(apiKey);
        setKeyStatus('valid');
        toast({
          title: "Success",
          description: "API key saved and validated successfully",
        });
        setApiKey('');
      } else {
        setKeyStatus('invalid');
        toast({
          title: "Error",
          description: "Invalid API key. Please check and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to validate API key",
        variant: "destructive",
      });
    } finally {
      setIsTestingKey(false);
    }
  };

  const getStatusBadge = () => {
    if (!existingKey) {
      return <Badge variant="outline">No API Key</Badge>;
    }
    
    switch (keyStatus) {
      case 'valid':
        return (
          <Badge className="bg-accent text-accent-foreground">
            <CheckCircle className="w-3 h-3 mr-1" />
            Valid
          </Badge>
        );
      case 'invalid':
        return (
          <Badge variant="destructive">
            <AlertCircle className="w-3 h-3 mr-1" />
            Invalid
          </Badge>
        );
      default:
        return <Badge variant="secondary">Configured</Badge>;
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="w-5 h-5" />
          API Configuration
        </CardTitle>
        <CardDescription>
          Configure your scraping API key for enhanced functionality. Currently using demo data.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Current Status:</span>
          {getStatusBadge()}
        </div>
        
        <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <Input
              id="api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key..."
              className="transition-all duration-200"
            />
          </div>
          
          <Button
            onClick={handleSaveKey}
            disabled={isTestingKey || !apiKey.trim()}
            className="w-full"
          >
            {isTestingKey ? "Validating..." : "Save & Validate Key"}
          </Button>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>Note:</strong> This demo uses mock data for review scraping.</p>
          <p>For production use, integrate with services like:</p>
          <ul className="list-disc list-inside ml-2">
            <li>Firecrawl API for web scraping</li>
            <li>Puppeteer/Playwright for custom scrapers</li>
            <li>Official APIs where available</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};