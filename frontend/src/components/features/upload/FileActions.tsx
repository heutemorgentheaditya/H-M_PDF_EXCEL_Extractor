'use client';
import React from 'react';

interface FileActionsProps {
  fileName: string;
  onProcess: () => void;
  onClear: () => void;
}

export default function FileActions({ fileName, onProcess, onClear }: FileActionsProps) {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div>
          <p className="text-sm text-gray-600">Selected file:</p>
          <p className="font-medium text-gray-900">{fileName}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClear}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Clear
          </button>
          <button
            onClick={onProcess}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Process PDF
          </button>
        </div>
      </div>
    </div>
  );
}