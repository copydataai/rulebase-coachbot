# Rulebase CoachBot

A powerful AI-driven analytics platform for comprehensive text analysis and conversation insights. Built with Next.js, TypeScript, and Hugging Face Transformers for advanced natural language processing.

## 🚀 Features

### Multi-Dimensional Text Analysis
- **Sentiment Analysis**: Positive, negative, and neutral classification
- **Emotion Detection**: Joy, anger, fear, sadness, surprise, and neutral emotions
- **Urgency Assessment**: High, medium, and low priority classification  
- **Topic Extraction**: Customer service, technical support, billing, product feedback, and more

### Flexible Input Methods
- **File Upload**: Support for TXT, CSV, and JSON files with drag-and-drop
- **Direct Text Input**: Paste transcripts, chat logs, or conversations directly
- **Smart Format Detection**: Automatically recognizes common conversation formats

### Advanced Analytics Dashboard
- **Real-time Processing**: Live progress tracking with percentage completion  
- **Interactive Charts**: Pie charts, bar charts, and timeline visualizations
- **Detailed Tables**: Tabbed analysis views with confidence scores
- **Performance Optimization**: Processes up to 100 entries for optimal speed

## 📊 Analytics Capabilities

### Supported Text Formats

#### File Uploads
- **CSV Files**: Automatically detects text/message columns with timestamp and speaker support
- **JSON Files**: Flexible handling of various JSON structures for messages and conversations
- **TXT Files**: Line-by-line or sentence-by-sentence analysis

#### Text Input Formats
```
• Simple text (one message per line)
• Speaker: Message format
• [Timestamp] Message format  
• [Timestamp] Speaker: Message format
```

### Analysis Results Include
- **Summary Metrics**: Overall sentiment distribution, emotion counts, urgency levels
- **High-Risk Segments**: Automatic detection of negative sentiment + high urgency combinations
- **Emotion Timeline**: Temporal analysis of emotional patterns
- **Topic Distribution**: Breakdown of conversation themes and categories
- **Improvement Suggestions**: AI-generated recommendations based on analysis

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd rulebase-coachbot

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to access the application.

## 📝 Usage

### Using File Upload
1. Navigate to the Analytics page
2. Select the "Upload File" tab
3. Drag and drop or click to select your file (TXT, CSV, or JSON)
4. Click analyze to start processing
5. View comprehensive results with charts and detailed breakdowns

### Using Text Input
1. Navigate to the Analytics page  
2. Select the "Paste Text" tab
3. Paste your conversation or transcript text
4. The system automatically detects format and line count
5. Click "Analyze Text" to process (limited to first 100 lines for performance)

### Performance Notes
- **Processing Limit**: For optimal performance, analysis is limited to the first 100 entries
- **Large Files**: The system automatically alerts users when datasets exceed 100 lines
- **Real-time Progress**: Live progress tracking during analysis processing

## 🔧 Technical Stack

### Core Technologies
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Hugging Face Transformers**: Zero-shot classification with mDeBERTa-v3-base-mnli-xnli model

### UI Components  
- **Recharts**: Interactive data visualizations
- **Lucide Icons**: Modern icon system
- **Custom Components**: Card, Table, Button, Tabs, Badge components

### AI/ML Features
- **Zero-Shot Classification**: Multi-label classification without training
- **Batch Processing**: Efficient handling of multiple text entries
- **Error Handling**: Robust fallback classifications for reliability

## 📈 Analytics Examples

### Sample CSV Format
```csv
text,speaker,timestamp
"how's it going Arthur I just placed an order with you guys and I accidentally sent it to the wrong address can you please help me change this",Customer,2024-01-01 10:00
"yeah hello I'm just wondering if I can speak to someone about an order I received yesterday",Customer,2024-01-01 10:05
"hey I receive my order but it's the wrong size can I get a refund please",Customer,2024-01-01 10:10
```

### Sample JSON Format
```json
{
  "messages": [
    {
      "text": "Hi, I need help with my order",
      "speaker": "Customer", 
      "timestamp": "2024-01-01T10:00:00Z"
    },
    {
      "content": "I'm not happy with the product quality",
      "user": "John",
      "time": "2024-01-01T10:05:00Z"
    }
  ]
}
```

## 🎯 Use Cases

- **Customer Service Analysis**: Understand sentiment patterns in support conversations
- **Feedback Processing**: Analyze product reviews and user feedback
- **Communication Insights**: Evaluate team communications and meeting transcripts  
- **Content Moderation**: Identify high-priority or concerning messages
- **Training Data**: Generate labeled datasets for further ML training

## 🔮 Future Enhancements

- Model selection and configuration options
- Export capabilities for analysis results  
- Advanced filtering and search functionality
- Integration with external APIs and data sources
- Custom label sets and classification categories

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ using modern web technologies and AI/ML capabilities for comprehensive text analytics.**
