import pdfplumber
import pandas as pd
from typing import Dict, List

class PDFService:
    @staticmethod
    def make_columns_unique(columns: List[str]) -> List[str]:
        """Make column names unique by adding a suffix for duplicates."""
        seen = {}
        unique_columns = []
        
        for item in columns:
            if item in seen:
                seen[item] += 1
                unique_columns.append(f"{item}_{seen[item]}")
            else:
                seen[item] = 0
                unique_columns.append(item)
        
        return unique_columns

    @staticmethod
    async def extract_tables(file_path: str) -> List[Dict]:
        tables = []
        try:
            with pdfplumber.open(file_path) as pdf:
                for page_num, page in enumerate(pdf.pages):
                    found_tables = page.extract_tables()
                    for table_num, table in enumerate(found_tables):
                        if table and len(table) > 0:
                            # Get headers from first row
                            headers = [str(col).strip() if col else f'Column_{i}' 
                                     for i, col in enumerate(table[0])]
                            
                            # Make headers unique
                            unique_headers = PDFService.make_columns_unique(headers)
                            
                            # Create DataFrame with unique headers
                            df = pd.DataFrame(table[1:], columns=unique_headers)
                            
                            # Clean data
                            df = df.replace('', pd.NA).dropna(how='all')
                            
                            tables.append({
                                'table_id': f'table_{page_num}_{table_num}',
                                'page': page_num + 1,
                                'data': df.to_dict('records'),
                                'columns': unique_headers
                            })
        except Exception as e:
            print(f"Error processing PDF: {str(e)}")
            raise Exception(f"Failed to process PDF: {str(e)}")

        return tables