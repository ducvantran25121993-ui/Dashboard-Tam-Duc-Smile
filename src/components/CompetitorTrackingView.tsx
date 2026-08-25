import React from 'react';
import { CompetitorWebDiffScanner } from './CompetitorWebDiffScanner';

export const CompetitorTrackingView: React.FC = () => {
  return (
    <div className="space-y-6">
      <CompetitorWebDiffScanner />
    </div>
  );
};
