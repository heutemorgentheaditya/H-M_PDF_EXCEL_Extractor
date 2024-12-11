// src/components/features/upload/FileUpload.tsx
'use client';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import FileActions from './FileActions';

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    disabled: isProcessing
  });

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);
    // TODO: Add file processing logic
    console.log('Processing file:', file.name);
  };

  const handleClear = () => {
    setFile(null);
    setIsProcessing(false);
  };

  return (
    <div className="max-w-xl mx-auto">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${file ? 'border-green-500 bg-green-50' : ''}`}
      >
        <input {...getInputProps()} />
        {!file ? (
          <div>
            <p className="text-lg font-medium text-gray-700">
              Drop your PDF file here, or click to select
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Only PDF files are accepted
            </p>
          </div>
        ) : null}
      </div>

      {file && (
        <FileActions 
          fileName={file.name}
          onProcess={handleProcess}
          onClear={handleClear}
        />
      )}
    </div>
  );
}