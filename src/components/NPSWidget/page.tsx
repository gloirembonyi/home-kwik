// src/components/NPSWidget.tsx
"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/base/button";
import { useAnalytics } from "@/hooks/useAnalytics";

export const NPSWidget = () => {
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { trackNPS } = useAnalytics();

  const handleSubmit = () => {
    if (score !== null) {
      trackNPS(score, feedback);
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return <div className="text-center p-4">Thank you for your feedback!</div>;
  }

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">How likely are you to recommend Kwik Ride?</h3>
      <div className="flex justify-between mb-4">
        {[...Array(11)].map((_, i) => (
          <Button
            key={i}
            variant={score === i ? "default" : "ghost"}
            onClick={() => setScore(i)}
            className="w-8 h-8 rounded-full p-0"
          >
            {i}
          </Button>
        ))}
      </div>
      <textarea
        className="w-full p-2 border rounded"
        placeholder="What's the main reason for your score?"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      />
      <Button
        onClick={handleSubmit}
        disabled={score === null}
        className="mt-4"
      >
        Submit Feedback
      </Button>
    </div>
  );
};