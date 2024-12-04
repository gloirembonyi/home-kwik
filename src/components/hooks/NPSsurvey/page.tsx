// components/NPSsurvey.tsx
import React, { useState } from 'react';
import { useAnalytics } from '..//useAnalytics';

export const NPSSurvey = () => {
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const { trackNPS } = useAnalytics();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (score !== null) {
      trackNPS(score, feedback);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">
        How likely are you to recommend Kwik Ride?
      </h3>
      <div className="flex gap-2 mb-4">
        {[...Array(11)].map((_, i) => (
          <button
            key={i}
            className={`px-3 py-2 rounded ${
              score === i ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }`}
            onClick={() => setScore(i)}
          >
            {i}
          </button>
        ))}
      </div>
      <textarea
        className="w-full p-2 border rounded"
        placeholder="What's the main reason for your score?"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      />
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={handleSubmit}
      >
        Submit Feedback
      </button>
    </div>
  );
};