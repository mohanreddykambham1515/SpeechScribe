import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, Square, Pause, Play } from "lucide-react";
import { useState, useEffect } from "react";

interface SpeechRecorderProps {
  isRecording: boolean;
  isPaused: boolean;
  elapsedTime: number;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onPauseRecording: () => void;
  disabled?: boolean;
}

export function SpeechRecorder({
  isRecording,
  isPaused,
  elapsedTime,
  onStartRecording,
  onStopRecording,
  onPauseRecording,
  disabled = false,
}: SpeechRecorderProps) {
  const [displayTime, setDisplayTime] = useState("00:00:00");

  useEffect(() => {
    const hours = Math.floor(elapsedTime / 3600);
    const minutes = Math.floor((elapsedTime % 3600) / 60);
    const seconds = elapsedTime % 60;
    setDisplayTime(
      `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    );
  }, [elapsedTime]);

  const getRecordingStatus = () => {
    if (isRecording && isPaused) return "Paused";
    if (isRecording) return "Recording...";
    return "Ready to record";
  };

  const getIndicatorColor = () => {
    if (isRecording && !isPaused) return "bg-red-500 animate-pulse";
    if (isPaused) return "bg-yellow-500";
    return "bg-gray-300";
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recording Status</h2>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${getIndicatorColor()}`} />
            <span className="text-sm text-gray-600">{getRecordingStatus()}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          {/* Main Record Button */}
          <Button
            onClick={isRecording ? onStopRecording : onStartRecording}
            disabled={disabled}
            className={`group relative w-20 h-20 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
              isRecording
                ? "bg-red-500 hover:bg-red-600"
                : "bg-orange-500 hover:bg-orange-600"
            }`}
          >
            {isRecording ? (
              <Square className="w-6 h-6 text-white" />
            ) : (
              <Mic className="w-6 h-6 text-white" />
            )}
            <div className="absolute inset-0 rounded-full bg-current opacity-0 group-hover:opacity-20 animate-pulse" />
          </Button>

          {/* Secondary Controls */}
          <div className="flex space-x-3">
            <Button
              onClick={onPauseRecording}
              disabled={!isRecording}
              variant="outline"
              size="icon"
              className="p-3 bg-yellow-500 text-white hover:bg-yellow-600 disabled:opacity-50"
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Recording Timer */}
        <div className="text-center mt-4">
          <div className="text-2xl font-mono font-medium text-gray-900">
            {displayTime}
          </div>
          <div className="text-sm text-gray-500 mt-1">Recording time</div>
        </div>
      </CardContent>
    </Card>
  );
}
