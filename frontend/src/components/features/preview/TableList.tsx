'use client';

import React, { useState } from 'react';
import { TableData, ColumnMapping } from '@/types/pdf';
import { exportToExcel } from '@/services/api';

interface TableListProps {
  tables: TableData[];
  onColumnMap?: (tableId: string, mapping: ColumnMapping) => void;
}

export default function TableList({ tables, onColumnMap }: TableListProps) {
  const [mappings, setMappings] = useState<Record<string, ColumnMapping>>({});
  const [isExporting, setIsExporting] = useState(false);

  const columnOptions = [
    { value: '', label: 'Select mapping...' },
    { value: 'exam_form', label: 'Exam Form' },
    { value: 'enrollment_no', label: 'Enrollment No.' },
    { value: 'roll_no', label: 'Roll Number' },
    { value: 'college_name', label: 'College Name' },
    { value: 'course_class', label: 'Course/Class' },
    { value: 'student_type', label: 'Student Type' },
    { value: 'category', label: 'Category' }
  ];

  const handleColumnMap = (tableId: string, originalColumn: string, mappedColumn: string) => {
    const newMapping = {
      ...mappings[tableId],
      [originalColumn]: mappedColumn,
    };
    setMappings(prevMappings => ({
      ...prevMappings,
      [tableId]: newMapping,
    }));
    onColumnMap?.(tableId, newMapping);
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      // Filter out empty mappings
      const validMappings = Object.fromEntries(
        Object.entries(mappings).filter(([_, value]) => 
          Object.keys(value).length > 0
        )
      );
      
      // Prepare tables with table_id
      const tablesWithIds = tables.map((table, index) => ({
        ...table,
        table_id: `table_${index}`
      }));
      
      console.log('Exporting with data:', { 
        tables: tablesWithIds, 
        mappings: validMappings 
      });
      
      await exportToExcel(tablesWithIds, validMappings);
      alert('Export successful!');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-8">
      {tables.map((table, tableIndex) => (
        <div key={tableIndex} className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Table from page {table.page}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  {table.columns.map((column) => (
                    <th key={column} className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                      <div className="space-y-2">
                        <div className="text-sm font-semibold text-gray-900">
                          {column}
                        </div>
                        <select
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md 
                                   shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                   bg-white"
                          value={mappings[`table_${tableIndex}`]?.[column] || ''}
                          onChange={(e) => handleColumnMap(`table_${tableIndex}`, column, e.target.value)}
                        >
                          {columnOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {table.data.map((row, rowIndex) => (
                  <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {table.columns.map((column) => (
                      <td
                        key={`${rowIndex}-${column}`}
                        className="px-6 py-4 text-sm text-gray-900 whitespace-normal break-words"
                      >
                        {row[column]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {table.data.length > 5 && (
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Showing {Math.min(5, table.data.length)} of {table.data.length} rows
              </p>
            </div>
          )}
        </div>
      ))}

      <div className="flex justify-end space-x-4">
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="px-6 py-2 bg-blue-500 text-white text-sm font-medium rounded-md 
                   hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 
                   focus:ring-offset-2 disabled:opacity-50"
        >
          {isExporting ? 'Exporting...' : 'Export to Excel'}
        </button>
      </div>
    </div>
  );
}