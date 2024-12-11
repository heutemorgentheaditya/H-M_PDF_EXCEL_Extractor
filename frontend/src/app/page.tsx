// src/app/page.tsx
import FileUpload from '@/components/features/upload/FileUpload';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">
        PDF Data Extractor
      </h1>
      <div className="bg-white shadow-lg rounded-lg p-8">
        <p className="text-lg text-gray-600 mb-6 text-center">
          Upload your PDF files and extract tabular data with our interactive column mapping tool.
        </p>
        <FileUpload />
      </div>
    </div>
  )
}