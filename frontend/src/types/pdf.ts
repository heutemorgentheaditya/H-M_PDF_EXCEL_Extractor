
export interface TableData {
  table_id: string;
  page: number;
  data: Record<string, string>[];
  columns: string[];
}

export interface MappingData {
  [key: string]: {
    [key: string]: string;
  };
}