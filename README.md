# SaaS Review Scraper

A professional-grade web application for extracting and analyzing product reviews from G2, Capterra, and TrustPilot. Built with React, TypeScript, and modern web technologies.

## Features

- **Multi-Source Support**: Scrape reviews from G2, Capterra, and TrustPilot
- **Date Range Filtering**: Extract reviews within specific time periods
- **Professional UI**: Clean, dashboard-style interface with real-time progress tracking
- **JSON Export**: Export scraped data in structured JSON format
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Error Handling**: Robust validation and graceful error management

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pulse-submission
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:8080`

## Usage

### Basic Scraping

1. **Enter Company Name**: Input the name of the company whose reviews you want to scrape
2. **Select Date Range**: Choose start and end dates for the review period
3. **Choose Source**: Select from G2, Capterra, or TrustPilot
4. **Start Scraping**: Click "Start Scraping" to begin the process

### Input Parameters

| Parameter | Description | Required | Format |
|-----------|-------------|----------|---------|
| Company Name | Name of the target company | Yes | String |
| Start Date | Beginning of review period | Yes | YYYY-MM-DD |
| End Date | End of review period | Yes | YYYY-MM-DD |
| Source | Review platform | Yes | g2, capterra, trustpilot |

### Output Format

The scraper outputs a JSON file with the following structure:

```json
{
  "company": "Example Company",
  "source": "g2",
  "dateRange": {
    "start": "2024-01-01",
    "end": "2024-03-31"
  },
  "totalReviews": 25,
  "reviews": [
    {
      "title": "Great product with excellent support",
      "description": "Detailed review content...",
      "date": "2024-02-15",
      "rating": 5,
      "reviewer": "John Smith",
      "source": "g2"
    }
  ]
}
```

## API Integration

### Firecrawl Setup (Optional)

For real web scraping capabilities, you can integrate with Firecrawl:

1. Sign up at [Firecrawl](https://firecrawl.dev)
2. Get your API key
3. The application will prompt for your API key when needed

**Note**: The current implementation uses mock data for demonstration. To enable real scraping, update the `ReviewScrapingService` with proper Firecrawl integration.

## Architecture

### Core Components

- **ReviewScraper**: Main component handling the scraping workflow
- **ReviewScrapingService**: Service layer for data extraction logic
- **UI Components**: Reusable components built with shadcn/ui

### Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **UI Library**: shadcn/ui components
- **Build Tool**: Vite
- **Scraping**: Firecrawl integration (optional)
- **State Management**: React hooks

## Supported Sources

### Primary Sources

1. **G2** (`g2`)
   - Business software reviews
   - Enterprise-focused feedback
   - Detailed feature ratings

2. **Capterra** (`capterra`)
   - Software marketplace reviews
   - SMB and enterprise reviews
   - Comprehensive product comparisons

3. **TrustPilot** (`trustpilot`) - Bonus Source
   - Consumer and business reviews
   - Trust and reliability scores
   - Verified purchase reviews

## Development

### Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   └── ReviewScraper.tsx # Main scraping component
├── services/
│   └── ReviewScrapingService.ts # Scraping logic
├── assets/              # Static assets
├── pages/              # Route components
└── lib/                # Utility functions
```

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

### Adding New Sources

To add a new review source:

1. Update the `ScrapeParams` interface in `ReviewScrapingService.ts`
2. Add URL building logic in `buildSearchUrl()`
3. Implement parsing logic (e.g., `parseNewSourceReviews()`)
4. Update the source selector in `ReviewScraper.tsx`

## Error Handling

The application includes comprehensive error handling:

- **Input Validation**: Client-side validation for all form inputs
- **Date Validation**: Ensures logical date ranges
- **API Error Handling**: Graceful handling of scraping failures
- **Network Issues**: Retry logic and user-friendly error messages

## Performance Considerations

- **Lazy Loading**: Images and components loaded on demand
- **Efficient Rendering**: Optimized React rendering with proper keys
- **Memory Management**: Proper cleanup of resources and timeouts
- **Progress Tracking**: Real-time feedback during long operations

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-source`
3. Make your changes and add tests
4. Commit your changes: `git commit -am 'Add new review source'`
5. Push to the branch: `git push origin feature/new-source`
6. Submit a pull request

## Security Considerations

- **Input Sanitization**: All user inputs are validated and sanitized
- **API Key Security**: Secure storage and handling of API credentials
- **Rate Limiting**: Respectful scraping with appropriate delays
- **CORS Handling**: Proper cross-origin request management

## Troubleshooting

### Common Issues

1. **Build Errors**: Ensure all dependencies are installed correctly
2. **TypeScript Errors**: Check for proper type definitions
3. **Scraping Failures**: Verify API keys and network connectivity
4. **Export Issues**: Check browser compatibility for file downloads

### Debug Mode

Enable debug mode by setting `DEBUG=true` in your environment:

```bash
DEBUG=true npm run dev
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)
- Scraping powered by [Firecrawl](https://firecrawl.dev)

---
