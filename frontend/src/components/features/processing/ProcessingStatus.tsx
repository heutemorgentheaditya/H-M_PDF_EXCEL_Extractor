'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface ProcessingStep {
  id: string;
  label: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

interface ProcessingStatusProps {
  steps: ProcessingStep[];
  currentStep: string;
}

export default function ProcessingStatus({ steps, currentStep }: ProcessingStatusProps) {
  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow">
      <div className="space-y-4">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex items-center space-x-3 ${
              step.status === 'completed' ? 'text-green-600' : 
              step.status === 'error' ? 'text-red-600' : 
              step.id === currentStep ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            {step.status === 'processing' ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : step.status === 'completed' ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : step.status === 'error' ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <div className="h-5 w-5 rounded-full border-2 border-current" />
            )}
            <span className="text-sm font-medium">{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}