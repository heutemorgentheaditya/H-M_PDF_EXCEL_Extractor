'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Cloud, File, Loader2 } from 'lucide-react';

interface EnhancedUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

export default function EnhancedUpload({ onFileSelect, isProcessing }: EnhancedUploadProps) {
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.length > 0) {
      const file = acceptedFiles[0];
      // Validate file size (e.g., 10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size should be less than 10MB');
        return;
      }
      setFilePreview(file.name);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    disabled: isProcessing
  });

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <div
        {...getRootProps()}
        className={`
          min-h-[200px] 
          rounded-lg 
          border-2 
          border-dashed 
          transition-colors 
          duration-200
          flex 
          flex-col 
          items-center 
          justify-center 
          p-6
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400'}
          ${filePreview ? 'border-green-500 bg-green-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {isProcessing ? (
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            <p className="text-sm text-gray-600">Processing your file...</p>
          </div>
        ) : filePreview ? (
          <div className="flex flex-col items-center space-y-2">
            <File className="h-10 w-10 text-green-500" />
            <p className="text-sm font-medium text-gray-900">{filePreview}</p>
            <p className="text-xs text-gray-500">Click or drag to replace</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <Cloud className="h-10 w-10 text-gray-400" />
            <p className="text-lg font-medium text-gray-900">
              Drop your PDF here, or click to select
            </p>
            <p className="text-sm text-gray-500">PDF files only (max. 10MB)</p>
          </div>
        )}
      </div>

      {filePreview && !isProcessing && (
        <div className="flex justify-end">
          <button
            onClick={() => {
              setFilePreview(null);
              onFileSelect(null);
            }}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Remove file
          </button>
        </div>
      )}
    </div>
  );
}