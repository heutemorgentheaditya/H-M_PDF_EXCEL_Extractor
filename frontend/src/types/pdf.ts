export interface TableData {
    table_id: string;
    page: number;
    data: Record<string, any>[];
    columns: string[];
  }
  
  export type ColumnMapping = Record<string, string>;