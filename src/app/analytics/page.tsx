"use client";

import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {classify} from "@/server/nlp/classifier"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts"
import {
  Upload,
  ArrowLeft,
  MessageSquare,
  Smile,
  Frown,
  Meh,
  AlertTriangle,
  Lightbulb,
  FileText,
  X,
  Bot,
  TrendingUp,
  Heart,
  Zap,
  Target,
  Clock,
  Users,
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Enhanced type definitions
interface SummaryMetrics {
  totalMessages: number;
  sentiment: {
    positive: number;
    negative: number;
    neutral: number;
  };
  emotions: {
    joy: number;
    anger: number;
    fear: number;
    sadness: number;
    surprise: number;
  };
  urgency: {
    high: number;
    medium: number;
    low: number;
  };
  topics: Record<string, number>;
}

interface HighRiskSegment {
  id: string;
  startTime: string;
  endTime: string;
  negativeTone: number;
  urgencyLevel: 'high' | 'medium' | 'low';
  suggestedAction: string;
  affectedTopics: string[];
}

interface EmotionDataPoint {
  time: string;
  positive: number;
  negative: number;
  neutral: number;
  joy: number;
  anger: number;
  fear: number;
  sadness: number;
}

interface EnhancedAnalysis {
  text: string;
  sentiment: {
    label: string;
    score: number;
  };
  emotion: {
    label: string;
    score: number;
  };
  urgency: {
    label: string;
    score: number;
  };
  topics: Array<{
    label: string;
    score: number;
  }>;
  index: number;
  timestamp?: string;
  speaker?: string;
}

interface AnalysisResult {
  summaryMetrics: SummaryMetrics;
  highRiskSegments: HighRiskSegment[];
  improvementSuggestions: string[];
  emotionTimeline: EmotionDataPoint[];
  enhancedAnalysis: EnhancedAnalysis[];
  fileType: string;
  processingTime: number;
}

const EMOTION_LABELS = ['joy', 'anger', 'fear', 'sadness', 'surprise', 'neutral'];
const URGENCY_LABELS = ['high', 'medium', 'low'];
const TOPIC_LABELS = ['customer service', 'technical support', 'billing', 'product feedback', 'complaint', 'compliment', 'question', 'request'];

const chartConfig = {
  positive: { label: "Positive", color: "hsl(142, 76%, 36%)" },
  negative: { label: "Negative", color: "hsl(0, 84%, 60%)" },
  neutral: { label: "Neutral", color: "hsl(215, 20%, 65%)" },
  joy: { label: "Joy", color: "hsl(45, 93%, 47%)" },
  anger: { label: "Anger", color: "hsl(0, 84%, 60%)" },
  fear: { label: "Fear", color: "hsl(271, 81%, 56%)" },
  sadness: { label: "Sadness", color: "hsl(221, 83%, 53%)" },
  surprise: { label: "Surprise", color: "hsl(142, 76%, 36%)" },
}

const EMOTION_COLORS = ['#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6', '#10b981', '#6b7280'];

export default function Analytics() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [inputMethod, setInputMethod] = useState<'file' | 'text'>('file');
  const [textInput, setTextInput] = useState('');
  const [showLimitAlert, setShowLimitAlert] = useState(false);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processCSVFile = async (file: File): Promise<EnhancedAnalysis[]> => {
    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    // Find relevant columns
    const textCol = headers.findIndex(h => h.includes('text') || h.includes('message') || h.includes('content'));
    const timeCol = headers.findIndex(h => h.includes('time') || h.includes('date') || h.includes('timestamp'));
    const speakerCol = headers.findIndex(h => h.includes('speaker') || h.includes('user') || h.includes('agent'));
    
    if (textCol === -1) {
      throw new Error('No text/message column found in CSV');
    }

    const results: EnhancedAnalysis[] = [];
    const dataLines = lines.slice(1);
    
    for (let i = 0; i < Math.min(dataLines.length, 100); i++) { // Limit to 100 entries
      const cols = dataLines[i].split(',');
      const text = cols[textCol]?.replace(/"/g, '').trim();
      
      if (!text || text.length < 3) continue;

      setProgress((i / Math.min(dataLines.length, 100)) * 100);

      // Perform multi-label classification
      const [sentimentResult, emotionResult, urgencyResult, topicResult] = await Promise.all([
        classify(text, ['positive', 'negative', 'neutral']).catch(() => ({ labels: ['neutral'], scores: [1] })),
        classify(text, EMOTION_LABELS).catch(() => ({ labels: ['neutral'], scores: [1] })),
        classify(text, URGENCY_LABELS).catch(() => ({ labels: ['low'], scores: [1] })),
        classify(text, TOPIC_LABELS).catch(() => ({ labels: ['general'], scores: [1] }))
      ]);

      results.push({
        text,
        sentiment: {
          label: sentimentResult.labels[0],
          score: sentimentResult.scores[0]
        },
        emotion: {
          label: emotionResult.labels[0],
          score: emotionResult.scores[0]
        },
        urgency: {
          label: urgencyResult.labels[0],
          score: urgencyResult.scores[0]
        },
        topics: topicResult.labels.slice(0, 3).map((label, idx) => ({
          label,
          score: topicResult.scores[idx]
        })),
        index: i,
        timestamp: timeCol !== -1 ? cols[timeCol]?.replace(/"/g, '') : undefined,
        speaker: speakerCol !== -1 ? cols[speakerCol]?.replace(/"/g, '') : undefined
      });
    }

    return results;
  };

  const processJSONFile = async (file: File): Promise<EnhancedAnalysis[]> => {
    const text = await file.text();
    const data = JSON.parse(text);
    const messages = Array.isArray(data) ? data : data.messages || data.data || [data];
    
    const results: EnhancedAnalysis[] = [];
    
    for (let i = 0; i < Math.min(messages.length, 100); i++) {
      const item = messages[i];
      const text = item.text || item.message || item.content || item.body || JSON.stringify(item);
      
      if (!text || typeof text !== 'string' || text.length < 3) continue;

      setProgress((i / Math.min(messages.length, 100)) * 100);

      const [sentimentResult, emotionResult, urgencyResult, topicResult] = await Promise.all([
        classify(text, ['positive', 'negative', 'neutral']).catch(() => ({ labels: ['neutral'], scores: [1] })),
        classify(text, EMOTION_LABELS).catch(() => ({ labels: ['neutral'], scores: [1] })),
        classify(text, URGENCY_LABELS).catch(() => ({ labels: ['low'], scores: [1] })),
        classify(text, TOPIC_LABELS).catch(() => ({ labels: ['general'], scores: [1] }))
      ]);

      results.push({
        text,
        sentiment: {
          label: sentimentResult.labels[0],
          score: sentimentResult.scores[0]
        },
        emotion: {
          label: emotionResult.labels[0],
          score: emotionResult.scores[0]
        },
        urgency: {
          label: urgencyResult.labels[0],
          score: urgencyResult.scores[0]
        },
        topics: topicResult.labels.slice(0, 3).map((label, idx) => ({
          label,
          score: topicResult.scores[idx]
        })),
        index: i,
        timestamp: item.timestamp || item.time || item.date,
        speaker: item.speaker || item.user || item.agent || item.author
      });
    }

    return results;
  };

  const processTextFile = async (file: File): Promise<EnhancedAnalysis[]> => {
    const text = await file.text();
    const sentences = text.match(/[^\.!?]+[\.!?]+/g) || [text];
    const results: EnhancedAnalysis[] = [];

    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i].trim();
      if (sentence.length < 3) continue;

      setProgress((i / sentences.length) * 100);

      const [sentimentResult, emotionResult, urgencyResult, topicResult] = await Promise.all([
        classify(sentence, ['positive', 'negative', 'neutral']).catch(() => ({ labels: ['neutral'], scores: [1] })),
        classify(sentence, EMOTION_LABELS).catch(() => ({ labels: ['neutral'], scores: [1] })),
        classify(sentence, URGENCY_LABELS).catch(() => ({ labels: ['low'], scores: [1] })),
        classify(sentence, TOPIC_LABELS).catch(() => ({ labels: ['general'], scores: [1] }))
      ]);

      results.push({
        text: sentence,
        sentiment: {
          label: sentimentResult.labels[0],
          score: sentimentResult.scores[0]
        },
        emotion: {
          label: emotionResult.labels[0],
          score: emotionResult.scores[0]
        },
        urgency: {
          label: urgencyResult.labels[0],
          score: urgencyResult.scores[0]
        },
        topics: topicResult.labels.slice(0, 3).map((label, idx) => ({
          label,
          score: topicResult.scores[idx]
        })),
        index: i
      });
    }

    return results;
  };

  const processTextInput = async (text: string) => {
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    
    // Show alert if more than 100 lines
    if (lines.length > 100) {
      setShowLimitAlert(true);
    }
    
    const limitedLines = lines.slice(0, 100);
    const enhancedAnalysis: EnhancedAnalysis[] = [];

    for (let i = 0; i < limitedLines.length; i++) {
      const line = limitedLines[i].trim();
      if (line.length > 0) {
        setProgress(((i + 1) / limitedLines.length) * 100);
        
        // Parse line to extract speaker, timestamp, and message
        let text = line;
        let speaker = undefined;
        let timestamp = undefined;
        
        // Try to detect common formats:
        // Format 1: "Speaker: Message"
        const speakerMatch = line.match(/^([^:]+):\s*(.+)$/);
        if (speakerMatch) {
          speaker = speakerMatch[1].trim();
          text = speakerMatch[2].trim();
        }
        
        // Format 2: "[Timestamp] Message" or "(Timestamp) Message"
        const timestampMatch = line.match(/^[\[\(]([^\]\)]+)[\]\)]\s*(.+)$/);
        if (timestampMatch) {
          timestamp = timestampMatch[1].trim();
          text = timestampMatch[2].trim();
        }
        
        // Format 3: "[Timestamp] Speaker: Message"
        const fullMatch = line.match(/^[\[\(]([^\]\)]+)[\]\)]\s*([^:]+):\s*(.+)$/);
        if (fullMatch) {
          timestamp = fullMatch[1].trim();
          speaker = fullMatch[2].trim();
          text = fullMatch[3].trim();
        }

        try {
          const [sentimentResult, emotionResult, urgencyResult, topicsResult] = await Promise.all([
            classify(text, ['positive', 'negative', 'neutral']),
            classify(text, EMOTION_LABELS),
            classify(text, URGENCY_LABELS),
            classify(text, TOPIC_LABELS)
          ]);

          enhancedAnalysis.push({
            text,
            sentiment: {
              label: sentimentResult.labels[0],
              score: sentimentResult.scores[0]
            },
            emotion: {
              label: emotionResult.labels[0],
              score: emotionResult.scores[0]
            },
            urgency: {
              label: urgencyResult.labels[0],
              score: urgencyResult.scores[0]
            },
            topics: topicsResult.labels.slice(0, 3).map((label, idx) => ({
              label,
              score: topicsResult.scores[idx]
            })),
            index: i,
            speaker,
            timestamp
          });
        } catch (error) {
          console.error('Classification error:', error);
          // Fallback classification
          enhancedAnalysis.push({
            text,
            sentiment: { label: 'neutral', score: 0.5 },
            emotion: { label: 'neutral', score: 0.5 },
            urgency: { label: 'medium', score: 0.5 },
            topics: [{ label: 'general', score: 0.5 }],
            index: i,
            speaker,
            timestamp
          });
        }
      }
    }

    return enhancedAnalysis;
  };

  const generateAnalysisResult = (enhancedAnalysis: EnhancedAnalysis[], processingTime: number, fileType: string): AnalysisResult => {
    const total = enhancedAnalysis.length;
    
    // Calculate metrics
    const sentimentCounts = { positive: 0, negative: 0, neutral: 0 };
    const emotionCounts = { joy: 0, anger: 0, fear: 0, sadness: 0, surprise: 0 };
    const urgencyCounts = { high: 0, medium: 0, low: 0 };
    const topicCounts: Record<string, number> = {};

    enhancedAnalysis.forEach(analysis => {
      sentimentCounts[analysis.sentiment.label as keyof typeof sentimentCounts]++;
      emotionCounts[analysis.emotion.label as keyof typeof emotionCounts] = 
        (emotionCounts[analysis.emotion.label as keyof typeof emotionCounts] || 0) + 1;
      urgencyCounts[analysis.urgency.label as keyof typeof urgencyCounts]++;
      
      analysis.topics.forEach(topic => {
        topicCounts[topic.label] = (topicCounts[topic.label] || 0) + 1;
      });
    });

    // Generate high risk segments
    const highRiskSegments: HighRiskSegment[] = [];
    const negativeItems = enhancedAnalysis.filter(a => 
      a.sentiment.label === 'negative' || 
      a.emotion.label === 'anger' || 
      a.urgency.label === 'high'
    );

    negativeItems.slice(0, 5).forEach((item, idx) => {
      highRiskSegments.push({
        id: `risk-${idx}`,
        startTime: item.timestamp || `Item ${item.index}`,
        endTime: item.timestamp || `Item ${item.index + 1}`,
        negativeTone: Math.round(item.sentiment.score * 100),
        urgencyLevel: item.urgency.label as 'high' | 'medium' | 'low',
        suggestedAction: getActionSuggestion(item),
        affectedTopics: item.topics.map(t => t.label)
      });
    });

    return {
      summaryMetrics: {
        totalMessages: total,
        sentiment: sentimentCounts,
        emotions: emotionCounts,
        urgency: urgencyCounts,
        topics: topicCounts
      },
      highRiskSegments,
      improvementSuggestions: generateImprovementSuggestions(enhancedAnalysis),
      emotionTimeline: generateEmotionTimeline(enhancedAnalysis),
      enhancedAnalysis,
      fileType,
      processingTime
    };
  };

  const getActionSuggestion = (analysis: EnhancedAnalysis): string => {
    if (analysis.urgency.label === 'high') {
      return "Immediate escalation required - high priority issue detected";
    }
    if (analysis.emotion.label === 'anger') {
      return "Acknowledge frustration and provide empathetic response";
    }
    if (analysis.sentiment.label === 'negative') {
      return "Address concerns with solutions and follow-up";
    }
    return "Monitor for potential issues";
  };

  const generateImprovementSuggestions = (analyses: EnhancedAnalysis[]): string[] => {
    const suggestions = [];
    const negativeCount = analyses.filter(a => a.sentiment.label === 'negative').length;
    const angerCount = analyses.filter(a => a.emotion.label === 'anger').length;
    const highUrgencyCount = analyses.filter(a => a.urgency.label === 'high').length;
    
    if (negativeCount > analyses.length * 0.3) {
      suggestions.push("High negative sentiment detected - consider reviewing communication approach");
    }
    if (angerCount > analyses.length * 0.2) {
      suggestions.push("Anger emotions present - implement de-escalation training");
    }
    if (highUrgencyCount > analyses.length * 0.1) {
      suggestions.push("Multiple high-priority issues - consider workflow optimization");
    }
    
    return suggestions.length > 0 ? suggestions : ["Analysis complete - overall communication quality looks good"];
  };

  const generateEmotionTimeline = (analyses: EnhancedAnalysis[]): EmotionDataPoint[] => {
    // Group by time periods or sequential chunks
    const chunkSize = Math.max(1, Math.floor(analyses.length / 10));
    const timeline: EmotionDataPoint[] = [];
    
    for (let i = 0; i < analyses.length; i += chunkSize) {
      const chunk = analyses.slice(i, i + chunkSize);
      const timePoint = chunk[0].timestamp || `${Math.floor(i / chunkSize) * 10}%`;
      
      const emotions = {
        positive: chunk.filter(a => a.sentiment.label === 'positive').length,
        negative: chunk.filter(a => a.sentiment.label === 'negative').length,
        neutral: chunk.filter(a => a.sentiment.label === 'neutral').length,
        joy: chunk.filter(a => a.emotion.label === 'joy').length,
        anger: chunk.filter(a => a.emotion.label === 'anger').length,
        fear: chunk.filter(a => a.emotion.label === 'fear').length,
        sadness: chunk.filter(a => a.emotion.label === 'sadness').length,
      };
      
      timeline.push({
        time: timePoint,
        ...emotions
      });
    }
    
    return timeline;
  };

  const handleFile = async (file: File) => {
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);
    setAnalysisResult(null);
    setProgress(0);

    const startTime = Date.now();

    try {
      let enhancedAnalysis: EnhancedAnalysis[] = [];

      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        enhancedAnalysis = await processCSVFile(file);
      } else if (file.type === 'application/json' || file.name.endsWith('.json')) {
        enhancedAnalysis = await processJSONFile(file);
      } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        enhancedAnalysis = await processTextFile(file);
      } else {
        throw new Error('Unsupported file type. Please upload a TXT, CSV, or JSON file.');
      }

      const processingTime = Date.now() - startTime;
      const result = generateAnalysisResult(enhancedAnalysis, processingTime, file.type);
      setAnalysisResult(result);
    } catch (error) {
      console.error('File processing error:', error);
      alert(`Error processing file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleTextSubmit = async () => {
    if (!textInput.trim()) return;

    setIsProcessing(true);
    setProgress(0);
    setAnalysisResult(null);
    setShowLimitAlert(false);

    const startTime = Date.now();
    
    try {
      const enhancedAnalysis = await processTextInput(textInput);
      const processingTime = Date.now() - startTime;
      
      // Generate analysis result
      const result = generateAnalysisResult(enhancedAnalysis, processingTime, 'text');
      setAnalysisResult(result);
    } catch (error) {
      console.error('Text processing error:', error);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setFileName('');
    setIsProcessing(false);
    setProgress(0);
    if(fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-screen-xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <Link href="/" className="flex items-center text-purple-600 hover:text-purple-800 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center gap-2">
            <Bot className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold tracking-tighter">
              Enhanced Analytics
            </h1>
          </div>
          <Button size="sm" className="bg-purple-600 text-white hover:bg-purple-700">
            Send Feedback
          </Button>
        </header>

        <main className="flex-1 lg:grid lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="mr-2" />
                  Data Input
                </CardTitle>
                <CardDescription>Choose your input method: upload a file or paste text directly</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={inputMethod} onValueChange={(value) => setInputMethod(value as 'file' | 'text')} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="file">Upload File</TabsTrigger>
                    <TabsTrigger value="text">Paste Text</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="file" className="mt-4">
                    {/* File Upload Section */}
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors duration-200"
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                    >
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-lg font-medium text-gray-900 mb-2">
                        Drop your file here, or{' '}
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="text-purple-600 hover:text-purple-500 underline"
                        >
                          browse
                        </button>
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        Supports TXT, CSV, and JSON files
                      </p>
                      
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".txt,.csv,.json"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      
                      {fileName && (
                        <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <FileText className="h-5 w-5 text-purple-600 mr-2" />
                              <span className="text-sm font-medium text-purple-900">{fileName}</span>
                            </div>
                            <button
                              onClick={() => {
                                setFileName('');
                                if (fileInputRef.current) fileInputRef.current.value = '';
                              }}
                              className="text-purple-600 hover:text-purple-800"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="text" className="mt-4">
                    {/* Text Input Section */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Paste your transcript or conversation
                        </label>
                        <textarea 
                          value={textInput} 
                          onChange={(e) => setTextInput(e.target.value)} 
                          className="w-full h-40 p-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-vertical" 
                          placeholder={`Paste your text here. Supported formats:
• Simple text (one message per line)
• Speaker: Message format
• [Timestamp] Message format
• [Timestamp] Speaker: Message format`}
                        />
                      </div>
                      
                      {textInput.trim() && (
                        <div className="text-sm text-gray-600">
                          <span>Lines detected: {textInput.split('\n').filter(line => line.trim().length > 0).length}</span>
                          {textInput.split('\n').filter(line => line.trim().length > 0).length > 100 && (
                            <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                              <div className="flex items-center">
                                <AlertTriangle className="h-4 w-4 text-amber-600 mr-2 flex-shrink-0" />
                                <span className="text-amber-800 text-xs">
                                  Large dataset detected. Only the first 100 lines will be analyzed for optimal performance.
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <Button 
                        onClick={handleTextSubmit} 
                        className="w-full" 
                        disabled={!textInput.trim() || isProcessing}
                      >
                        {isProcessing ? 'Analyzing...' : 'Analyze Text'}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {isProcessing && (
              <Card className="p-8 flex flex-col items-center justify-center space-y-4">
                <h2 className="text-2xl font-semibold animate-pulse">Analyzing {fileName}...</h2>
                <p className="text-gray-500">Running advanced multi-label classification analysis</p>
                <div className="w-full max-w-md space-y-4 mt-4">
                  <div className="bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-purple-600 h-2.5 rounded-full transition-all duration-500" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 text-center">{Math.round(progress)}% complete</p>
                  <Skeleton className="h-8 w-full bg-gray-200" />
                  <Skeleton className="h-8 w-3/4 bg-gray-200" />
                  <Skeleton className="h-8 w-1/2 bg-gray-200" />
                </div>
              </Card>
            )}

            {analysisResult && !isProcessing && (
              <>
                {/* File Info & Reset */}
                <Card>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-6 w-6 text-purple-600" />
                      <div>
                        <p className="font-bold">{fileName}</p>
                        <p className="text-xs text-gray-500">
                          Analysis complete • {analysisResult.processingTime}ms • {analysisResult.summaryMetrics.totalMessages} items
                        </p>
                      </div>
                    </div>
                    <Button onClick={handleReset} variant="ghost" size="icon">
                      <X className="h-5 w-5" />
                    </Button>
                  </CardContent>
                </Card>

                {/* Summary Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Total Messages</CardDescription>
                      <CardTitle className="text-4xl">{analysisResult.summaryMetrics.totalMessages}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs text-gray-500 flex items-center"><MessageSquare className="mr-1 h-3 w-3" /> In conversation</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Positive Sentiment</CardDescription>
                      <CardTitle className="text-4xl text-green-500">{analysisResult.summaryMetrics.sentiment.positive}%</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs text-gray-500 flex items-center"><Smile className="mr-1 h-3 w-3" /> Mostly happy</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Negative Sentiment</CardDescription>
                      <CardTitle className="text-4xl text-red-500">{analysisResult.summaryMetrics.sentiment.negative}%</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs text-gray-500 flex items-center"><Frown className="mr-1 h-3 w-3" /> Areas to watch</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Neutral Sentiment</CardDescription>
                      <CardTitle className="text-4xl text-yellow-500">{analysisResult.summaryMetrics.sentiment.neutral}%</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs text-gray-500 flex items-center"><Meh className="mr-1 h-3 w-3" /> Informational</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Emotion Timeline Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center"><TrendingUp className="mr-2" /> Emotion Timeline</CardTitle>
                    <CardDescription>Distribution of emotions over the conversation.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-64 w-full">
                      <AreaChart data={analysisResult.emotionTimeline} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.1)" />
                        <XAxis dataKey="time" tick={{ fill: 'black' }} tickLine={{ stroke: 'black' }} />
                        <YAxis />
                        <ChartTooltip
                          cursor={false}
                          content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Area dataKey="positive" type="monotone" fill="var(--color-positive)" fillOpacity={0.4} stroke="var(--color-positive)" stackId="a" />
                        <Area dataKey="negative" type="monotone" fill="var(--color-negative)" fillOpacity={0.4} stroke="var(--color-negative)" stackId="a" />
                        <Area dataKey="neutral" type="monotone" fill="var(--color-neutral)" fillOpacity={0.4} stroke="var(--color-neutral)" stackId="a" />
                        <Area dataKey="joy" type="monotone" fill="var(--color-joy)" fillOpacity={0.4} stroke="var(--color-joy)" stackId="b" />
                        <Area dataKey="anger" type="monotone" fill="var(--color-anger)" fillOpacity={0.4} stroke="var(--color-anger)" stackId="b" />
                        <Area dataKey="fear" type="monotone" fill="var(--color-fear)" fillOpacity={0.4} stroke="var(--color-fear)" stackId="b" />
                        <Area dataKey="sadness" type="monotone" fill="var(--color-sadness)" fillOpacity={0.4} stroke="var(--color-sadness)" stackId="b" />
                      </AreaChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* High-Risk Segments Table */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center"><AlertTriangle className="mr-2 text-red-500" /> High-Risk Segments</CardTitle>
                    <CardDescription>Conversation segments with over 40% negative tone.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Timestamp</TableHead>
                          <TableHead>% Negative</TableHead>
                          <TableHead>Suggested Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {analysisResult.highRiskSegments.map((segment, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-mono">{segment.startTime} - {segment.endTime}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-red-600">{segment.negativeTone}%</span>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${segment.negativeTone}%` }}></div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{segment.suggestedAction}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* Emotion Distribution Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center"><Heart className="mr-2" /> Emotion Distribution</CardTitle>
                    <CardDescription>Overall distribution of emotions in the conversation.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-64 w-full">
                      <PieChart>
                        <Pie
                          data={Object.keys(analysisResult.summaryMetrics.emotions).map(key => ({
                            name: key,
                            value: analysisResult.summaryMetrics.emotions[key as keyof typeof analysisResult.summaryMetrics.emotions]
                          }))}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          label={(entry) => entry.name}
                          labelLine={false}
                        >
                          {Object.keys(analysisResult.summaryMetrics.emotions).map((key, index) => (
                            <Cell key={index} fill={EMOTION_COLORS[index % EMOTION_COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Urgency Distribution Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center"><Clock className="mr-2" /> Urgency Distribution</CardTitle>
                    <CardDescription>Overall distribution of urgency levels in the conversation.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-64 w-full">
                      <BarChart data={Object.keys(analysisResult.summaryMetrics.urgency).map(key => ({
                        name: key,
                        value: analysisResult.summaryMetrics.urgency[key as keyof typeof analysisResult.summaryMetrics.urgency]
                      }))}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Bar dataKey="value" fill="#8884d8">
                          {Object.keys(analysisResult.summaryMetrics.urgency).map((key, index) => (
                            <Cell key={index} fill={index % 2 === 0 ? '#82ca9d' : '#8bc34a'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Topic Distribution Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center"><Tag className="mr-2" /> Topic Distribution</CardTitle>
                    <CardDescription>Overall distribution of topics in the conversation.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-64 w-full">
                      <BarChart data={Object.keys(analysisResult.summaryMetrics.topics).map(key => ({
                        name: key,
                        value: analysisResult.summaryMetrics.topics[key as keyof typeof analysisResult.summaryMetrics.topics]
                      }))}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Bar dataKey="value" fill="#8884d8">
                          {Object.keys(analysisResult.summaryMetrics.topics).map((key, index) => (
                            <Cell key={index} fill={index % 2 === 0 ? '#82ca9d' : '#8bc34a'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Enhanced Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center"><Lightbulb className="mr-2 text-yellow-500" /> Enhanced Analysis</CardTitle>
                    <CardDescription>Detailed multi-dimensional analysis results with scores.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="overview" className="w-full">
                      <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
                        <TabsTrigger value="emotion">Emotion</TabsTrigger>
                        <TabsTrigger value="urgency">Urgency</TabsTrigger>
                        <TabsTrigger value="topics">Topics</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="overview" className="mt-4">
                        <div className="max-h-96 overflow-y-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-1/2">Text</TableHead>
                                <TableHead>Sentiment</TableHead>
                                <TableHead>Emotion</TableHead>
                                <TableHead>Urgency</TableHead>
                                <TableHead>Top Topic</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {analysisResult.enhancedAnalysis.slice(0, 50).map((analysis, index) => (
                                <TableRow key={index}>
                                  <TableCell className="max-w-md truncate">{analysis.text}</TableCell>
                                  <TableCell>
                                    <Badge variant={analysis.sentiment.label === 'positive' ? 'default' : 
                                                 analysis.sentiment.label === 'negative' ? 'destructive' : 'secondary'}>
                                      {analysis.sentiment.label}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="outline">{analysis.emotion.label}</Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant={analysis.urgency.label === 'high' ? 'destructive' : 
                                                 analysis.urgency.label === 'medium' ? 'secondary' : 'outline'}>
                                      {analysis.urgency.label}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="outline">{analysis.topics[0]?.label || 'N/A'}</Badge>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </TabsContent>

                      <TabsContent value="sentiment" className="mt-4">
                        <div className="max-h-96 overflow-y-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-2/3">Text</TableHead>
                                <TableHead>Label</TableHead>
                                <TableHead>Confidence</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {analysisResult.enhancedAnalysis.slice(0, 50).map((analysis, index) => (
                                <TableRow key={index}>
                                  <TableCell className="max-w-md truncate">{analysis.text}</TableCell>
                                  <TableCell>
                                    <Badge variant={analysis.sentiment.label === 'positive' ? 'default' : 
                                                 analysis.sentiment.label === 'negative' ? 'destructive' : 'secondary'}>
                                      {analysis.sentiment.label}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>{(analysis.sentiment.score * 100).toFixed(1)}%</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </TabsContent>

                      <TabsContent value="emotion" className="mt-4">
                        <div className="max-h-96 overflow-y-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-2/3">Text</TableHead>
                                <TableHead>Emotion</TableHead>
                                <TableHead>Confidence</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {analysisResult.enhancedAnalysis.slice(0, 50).map((analysis, index) => (
                                <TableRow key={index}>
                                  <TableCell className="max-w-md truncate">{analysis.text}</TableCell>
                                  <TableCell>
                                    <Badge variant="outline">{analysis.emotion.label}</Badge>
                                  </TableCell>
                                  <TableCell>{(analysis.emotion.score * 100).toFixed(1)}%</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </TabsContent>

                      <TabsContent value="urgency" className="mt-4">
                        <div className="max-h-96 overflow-y-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-2/3">Text</TableHead>
                                <TableHead>Urgency Level</TableHead>
                                <TableHead>Confidence</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {analysisResult.enhancedAnalysis.slice(0, 50).map((analysis, index) => (
                                <TableRow key={index}>
                                  <TableCell className="max-w-md truncate">{analysis.text}</TableCell>
                                  <TableCell>
                                    <Badge variant={analysis.urgency.label === 'high' ? 'destructive' : 
                                                 analysis.urgency.label === 'medium' ? 'secondary' : 'outline'}>
                                      {analysis.urgency.label}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>{(analysis.urgency.score * 100).toFixed(1)}%</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </TabsContent>

                      <TabsContent value="topics" className="mt-4">
                        <div className="max-h-96 overflow-y-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-1/2">Text</TableHead>
                                <TableHead>Primary Topic</TableHead>
                                <TableHead>Secondary Topic</TableHead>
                                <TableHead>Scores</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {analysisResult.enhancedAnalysis.slice(0, 50).map((analysis, index) => (
                                <TableRow key={index}>
                                  <TableCell className="max-w-md truncate">{analysis.text}</TableCell>
                                  <TableCell>
                                    <Badge variant="outline">{analysis.topics[0]?.label || 'N/A'}</Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="secondary">{analysis.topics[1]?.label || 'N/A'}</Badge>
                                  </TableCell>
                                  <TableCell className="text-sm text-gray-600">
                                    {analysis.topics.slice(0, 2).map(t => (t.score * 100).toFixed(1) + '%').join(', ')}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Right Column (Sidebar) */}
          <div className="space-y-6">
            {/* Analysis Summary */}
            {analysisResult && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-sm">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Analysis Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-3">
                    <div className="flex justify-between">
                      <span>Processing Time:</span>
                      <span className="font-mono">{analysisResult.processingTime}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span>File Type:</span>
                      <Badge variant="outline" className="text-xs">{analysisResult.fileType}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Items Analyzed:</span>
                      <span className="font-semibold">{analysisResult.summaryMetrics.totalMessages}</span>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-xs text-gray-600 mb-2">Sentiment Distribution:</p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Positive:</span>
                          <span className="text-green-600 font-semibold">{analysisResult.summaryMetrics.sentiment.positive}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Negative:</span>
                          <span className="text-red-600 font-semibold">{analysisResult.summaryMetrics.sentiment.negative}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Neutral:</span>
                          <span className="text-gray-600 font-semibold">{analysisResult.summaryMetrics.sentiment.neutral}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-sm">
                      <Users className="mr-2 h-4 w-4" />
                      Key Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-3">
                    <div className="space-y-2">
                      <div className="p-2 bg-green-50 rounded border-l-2 border-green-200">
                        <p className="text-xs font-medium text-green-800">Most Common Emotion</p>
                        <p className="text-green-700">
                          {Object.entries(analysisResult.summaryMetrics.emotions)
                            .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}
                        </p>
                      </div>
                      <div className="p-2 bg-blue-50 rounded border-l-2 border-blue-200">
                        <p className="text-xs font-medium text-blue-800">Primary Topic</p>
                        <p className="text-blue-700">
                          {Object.entries(analysisResult.summaryMetrics.topics)
                            .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}
                        </p>
                      </div>
                      <div className="p-2 bg-orange-50 rounded border-l-2 border-orange-200">
                        <p className="text-xs font-medium text-orange-800">High Priority Items</p>
                        <p className="text-orange-700">{analysisResult.summaryMetrics.urgency.high} items</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-sm">
                      <Lightbulb className="mr-2 h-4 w-4" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button size="sm" variant="outline" className="w-full justify-start text-xs">
                      <FileText className="mr-2 h-3 w-3" />
                      Export Results
                    </Button>
                    <Button size="sm" variant="outline" className="w-full justify-start text-xs">
                      <TrendingUp className="mr-2 h-3 w-3" />
                      Generate Report
                    </Button>
                    <Button size="sm" variant="outline" className="w-full justify-start text-xs">
                      <AlertTriangle className="mr-2 h-3 w-3" />
                      Flag High Risk
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Help & Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-sm">
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Analysis Types
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-3">
                <div>
                  <p className="font-medium text-green-700 mb-1">Sentiment Analysis</p>
                  <p className="text-gray-600">Positive, negative, or neutral tone classification</p>
                </div>
                <div>
                  <p className="font-medium text-blue-700 mb-1">Emotion Detection</p>
                  <p className="text-gray-600">Joy, anger, fear, sadness, surprise identification</p>
                </div>
                <div>
                  <p className="font-medium text-orange-700 mb-1">Urgency Assessment</p>
                  <p className="text-gray-600">High, medium, low priority classification</p>
                </div>
                <div>
                  <p className="font-medium text-purple-700 mb-1">Topic Extraction</p>
                  <p className="text-gray-600">Customer service, billing, technical support, etc.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}