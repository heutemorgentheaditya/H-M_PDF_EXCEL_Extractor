# backend/src/services/excel_service.py
import pandas as pd
from typing import List, Dict
from tempfile import NamedTemporaryFile
import os

class ExcelService:
    @staticmethod
    async def create_excel(tables: List[Dict], mappings: Dict) -> str:
        try:
            temp_file = NamedTemporaryFile(delete=False, suffix='.xlsx')
            
            with pd.ExcelWriter(temp_file.name, engine='openpyxl') as writer:
                for idx, table in enumerate(tables):
                    # Create DataFrame from table data
                    df = pd.DataFrame(table['data'])
                    
                    # Apply column mappings if available
                    if table.get('table_id') in mappings:
                        table_mappings = mappings[table['table_id']]
                        df = df.rename(columns=table_mappings)
                    
                    # Write to Excel
                    sheet_name = f"Table_{idx + 1}"
                    df.to_excel(writer, sheet_name=sheet_name, index=False)
            
            return temp_file.name
        except Exception as e:
            print(f"Excel creation error: {str(e)}")
            raise Exception(f"Failed to create Excel file: {str(e)}")