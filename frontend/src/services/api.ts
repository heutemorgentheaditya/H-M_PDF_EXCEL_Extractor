import { TableData, MappingData } from '@/types/pdf';

const API_BASE_URL = 'http://localhost:8000/api';

interface UploadResponse {
  tables: TableData[];
}

export const uploadPDF = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to process PDF');
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading PDF:', error);
    throw error;
  }
};


export const exportToExcel = async (tables: TableData[], mappings: MappingData): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/export-excel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
      body: JSON.stringify({ tables, mappings }),

    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || 'Failed to export Excel');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'extracted_data.xlsx';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error exporting Excel:', error);
    throw error;
  }
};