'use client';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadPDF } from '@/services/api';
import TableList from '@/components/features/preview/TableList';
import { TableData, ColumnMapping } from '@/types/pdf';

export default function FileUpload() {
 const [file, setFile] = useState<File | null>(null);
 const [isLoading, setIsLoading] = useState(false);
 const [error, setError] = useState<string | null>(null);
 const [processingStatus, setProcessingStatus] = useState<string | null>(null);
 const [tables, setTables] = useState<TableData[]>([]);
 const [mappings, setMappings] = useState<Record<string, ColumnMapping>>({});

 const onDrop = useCallback((acceptedFiles: File[]) => {
   if (acceptedFiles?.length > 0) {
     setFile(acceptedFiles[0]);
     setError(null);
     setTables([]);
     setProcessingStatus(null);
     setMappings({});
   }
 }, []);

 const { getRootProps, getInputProps, isDragActive } = useDropzone({
   onDrop,
   accept: {
     'application/pdf': ['.pdf']
   },
   maxFiles: 1,
   disabled: isLoading
 });

 const handleProcess = async () => {
   if (!file) return;

   try {
     setIsLoading(true);
     setError(null);
     setProcessingStatus('Uploading PDF...');

     const response = await uploadPDF(file);
     setTables(response.tables);
     setProcessingStatus('Processing complete!');
     
   } catch (err) {
     setError(err instanceof Error ? err.message : 'Failed to process PDF');
     setTables([]);
   } finally {
     setIsLoading(false);
   }
 };

 const handleClear = () => {
   setFile(null);
   setError(null);
   setTables([]);
   setProcessingStatus(null);
   setMappings({});
 };

 const handleColumnMap = (tableId: string, mapping: ColumnMapping) => {
   console.log(`Table ${tableId} mapping:`, mapping);
   setMappings(prev => ({
     ...prev,
     [tableId]: mapping
   }));
 };

 return (
   <div className="space-y-6 max-w-6xl mx-auto">
     <div className="max-w-xl mx-auto">
       <div
         {...getRootProps()}
         className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
           ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
           ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
           ${file ? 'border-green-500 bg-green-50' : ''}`}
       >
         <input {...getInputProps()} />
         <div>
           {file ? (
             <p className="text-sm text-gray-600">Selected file: {file.name}</p>
           ) : (
             <>
               <p className="text-lg font-medium text-gray-700">
                 Drop your PDF file here, or click to select
               </p>
               <p className="text-sm text-gray-500 mt-2">
                 Only PDF files are accepted
               </p>
             </>
           )}
         </div>
       </div>

       {file && (
         <div className="mt-4 flex justify-end space-x-3">
           <button
             onClick={handleClear}
             className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
             disabled={isLoading}
           >
             Clear
           </button>
           <button
             onClick={handleProcess}
             className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50"
             disabled={isLoading}
           >
             {isLoading ? 'Processing...' : 'Process PDF'}
           </button>
         </div>
       )}

       {processingStatus && (
         <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
           <p className="text-blue-700">{processingStatus}</p>
         </div>
       )}

       {error && (
         <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
           <p className="text-red-600">{error}</p>
         </div>
       )}
     </div>

     {tables.length > 0 && (
       <div className="mt-8">
         <h2 className="text-lg font-medium text-gray-900 mb-4">
           Extracted Tables
         </h2>
         <TableList 
           tables={tables} 
           onColumnMap={handleColumnMap}
         />
         {Object.keys(mappings).length > 0 && (
           <div className="mt-4 flex justify-end">
             <button
               className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600"
               onClick={() => console.log('Final mappings:', mappings)}
             >
               Export Mapped Data
             </button>
           </div>
         )}
       </div>
     )}
   </div>
 );
}