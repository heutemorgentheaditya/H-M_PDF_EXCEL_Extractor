import pdfplumber
import pandas as pd
from typing import Dict, List

class PDFService:
    @staticmethod
    async def extract_tables(file_path: str) -> List[Dict]:
        tables = []
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                found_tables = page.extract_tables()
                for table in found_tables:
                    if table:
                        df = pd.DataFrame(table[1:], columns=table[0])
                        tables.append({
                            'data': df.to_dict('records'),
                            'columns': list(df.columns)
                        })
        return tables