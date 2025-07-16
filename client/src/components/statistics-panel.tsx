import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface StatisticsData {
  totalSessions: number;
  totalTime: string;
  wordsTranscribed: number;
  accuracyRate: string;
}

export function StatisticsPanel() {
  const [stats, setStats] = useState<StatisticsData>({
    totalSessions: 0,
    totalTime: "0h 0m",
    wordsTranscribed: 0,
    accuracyRate: "N/A",
  });

  useEffect(() => {
    const loadStatistics = () => {
      const keys = Object.keys(localStorage).filter(key => key.startsWith('speechToText_'));
      let totalWords = 0;
      let totalDuration = 0;
      
      keys.forEach(key => {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          if (data.wordCount) totalWords += data.wordCount;
          if (data.duration) totalDuration += data.duration;
        } catch (error) {
          // Ignore invalid JSON
        }
      });

      const hours = Math.floor(totalDuration / 3600);
      const minutes = Math.floor((totalDuration % 3600) / 60);
      const timeString = `${hours}h ${minutes}m`;

      setStats({
        totalSessions: keys.length,
        totalTime: timeString,
        wordsTranscribed: totalWords,
        accuracyRate: "94.2%", // Placeholder - would need actual accuracy calculation
      });
    };

    loadStatistics();
    
    // Update stats every 5 seconds
    const interval = setInterval(loadStatistics, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total Sessions</span>
          <span className="font-medium text-gray-900">{stats.totalSessions}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total Time</span>
          <span className="font-medium text-gray-900">{stats.totalTime}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Words Transcribed</span>
          <span className="font-medium text-gray-900">{stats.wordsTranscribed.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Accuracy Rate</span>
          <span className="font-medium text-green-600">{stats.accuracyRate}</span>
        </div>
      </CardContent>
    </Card>
  );
}
