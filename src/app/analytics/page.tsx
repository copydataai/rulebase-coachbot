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
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
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
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

// Type definitions
interface SummaryMetrics {
  totalMessages: number;
  positive: number;
  negative: number;
  neutral: number;
}

interface HighRiskSegment {
  startTime: string;
  endTime:string;
  negativeTone: number;
  suggestedAction: string;
}

interface EmotionDataPoint {
  time: string;
  positive: number;
  negative: number;
  neutral: number;
}

interface AnalysisResult {
  summaryMetrics: SummaryMetrics;
  highRiskSegments: HighRiskSegment[];
  improvementSuggestions: string[];
  emotionTimeline: EmotionDataPoint[];
}

// Mock data
const mockResults: AnalysisResult = {
  summaryMetrics: {
    totalMessages: 158,
    positive: 68,
    negative: 22,
    neutral: 10,
  },
  highRiskSegments: [
    {
      startTime: "01:30",
      endTime: "02:10",
      negativeTone: 45,
      suggestedAction: "Offer a direct apology and solution.",
    },
    {
      startTime: "08:55",
      endTime: "09:40",
      negativeTone: 52,
      suggestedAction: "Escalate to a senior support specialist.",
    },
  ],
  improvementSuggestions: [
    "Consider rephrasing the initial greeting for a warmer tone.",
    "At 02:15, acknowledge the user's frustration before providing a solution.",
    "The closing at 10:05 could be more personalized.",
  ],
  emotionTimeline: [
    { time: "00:00", positive: 10, negative: 2, neutral: 5 },
    { time: "01:00", positive: 15, negative: 8, neutral: 3 },
    { time: "02:00", positive: 12, negative: 15, neutral: 2 },
    { time: "03:00", positive: 20, negative: 5, neutral: 6 },
    { time: "04:00", positive: 25, negative: 3, neutral: 4 },
    { time: "05:00", positive: 18, negative: 4, neutral: 7 },
    { time: "06:00", positive: 22, negative: 2, neutral: 5 },
    { time: "07:00", positive: 30, negative: 1, neutral: 3 },
    { time: "08:00", positive: 28, negative: 9, neutral: 8 },
    { time: "09:00", positive: 25, negative: 18, neutral: 6 },
    { time: "10:00", positive: 35, negative: 4, neutral: 4 },
  ]
};

const chartConfig = {
  positive: {
    label: "Positive",
    color: "hsl(var(--chart-1))",
  },
  negative: {
    label: "Negative",
    color: "hsl(var(--chart-2))",
  },
  neutral: {
    label: "Neutral",
    color: "hsl(var(--chart-3))",
  },
}

export default function Analytics() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);
    setAnalysisResult(null);

    // Simulate API call and processing
    setTimeout(() => {
      setAnalysisResult(mockResults);
      setIsProcessing(false);
    }, 2000);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setFileName('');
    setIsProcessing(false);
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
              Emotion Insights
            </h1>
          </div>
          <Button size="sm" className="bg-purple-600 text-white hover:bg-purple-700">
            Send Feedback
          </Button>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Upload or Results View */}
            {!analysisResult && !isProcessing && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-xl"><Upload className="mr-3 text-purple-600" /> Upload Transcript</CardTitle>
                  <CardDescription>Upload a CSV, JSON, or plain text file to begin analysis.</CardDescription>
                </CardHeader>
                <CardContent>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".csv,.json,.txt" />
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-purple-400 hover:bg-gray-100 transition-all duration-300"
                    onClick={triggerFileSelect}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                  >
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="font-semibold text-lg">Drag & drop a file here</p>
                    <p className="text-gray-500">or click to select a file</p>
                    <p className="text-xs text-gray-600 mt-4">Max file size: 10MB</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {isProcessing && (
              <Card className="p-8 flex flex-col items-center justify-center space-y-4">
                <h2 className="text-2xl font-semibold animate-pulse">Analyzing {fileName}...</h2>
                <p className="text-gray-500">Please wait while we process your transcript.</p>
                <div className="w-full max-w-md space-y-4 mt-4">
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
                        <p className="text-xs text-gray-500">Analysis complete</p>
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
                      <CardDescription>Positive Tone</CardDescription>
                      <CardTitle className="text-4xl text-green-500">{analysisResult.summaryMetrics.positive}%</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs text-gray-500 flex items-center"><Smile className="mr-1 h-3 w-3" /> Mostly happy</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Negative Tone</CardDescription>
                      <CardTitle className="text-4xl text-red-500">{analysisResult.summaryMetrics.negative}%</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs text-gray-500 flex items-center"><Frown className="mr-1 h-3 w-3" /> Areas to watch</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Neutral Tone</CardDescription>
                      <CardTitle className="text-4xl text-yellow-500">{analysisResult.summaryMetrics.neutral}%</CardTitle>
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
                        <ChartTooltip
                          cursor={false}
                          content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Area dataKey="positive" type="monotone" fill="var(--color-positive)" fillOpacity={0.4} stroke="var(--color-positive)" stackId="a" />
                        <Area dataKey="negative" type="monotone" fill="var(--color-negative)" fillOpacity={0.4} stroke="var(--color-negative)" stackId="a" />
                        <Area dataKey="neutral" type="monotone" fill="var(--color-neutral)" fillOpacity={0.4} stroke="var(--color-neutral)" stackId="a" />
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
              </>
            )}
          </div>

          {/* Right Column (Sidebar) */}
          <aside className="lg:col-span-1 space-y-8">
            {analysisResult && (
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="flex items-center"><Lightbulb className="mr-2 text-yellow-500" /> Improvement Suggestions</CardTitle>
                  <CardDescription>Actionable tips based on emotion data.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {analysisResult.improvementSuggestions.map((tip, index) => (
                      <li key={index} className="flex items-start p-3 bg-gray-100 rounded-lg">
                        <div className="flex-shrink-0">
                          <div className="h-2 w-2 rounded-full bg-purple-500 mt-1.5"></div>
                        </div>
                        <span className="ml-3 text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </aside>
        </main>
      </div>
    </div>
  );
}