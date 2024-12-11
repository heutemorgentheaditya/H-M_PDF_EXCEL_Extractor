from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from services.pdf_service import PDFService
from services.excel_service import ExcelService
from typing import Dict
import os
from tempfile import NamedTemporaryFile

router = APIRouter()

@router.get("/health")
async def health_check():
    return {"status": "ok", "message": "API is running"}

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    with NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
        content = await file.read()
        temp_file.write(content)
        temp_file.seek(0)
        
        try:
            tables = await PDFService.extract_tables(temp_file.name)
            return {"tables": tables}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
        finally:
            os.unlink(temp_file.name)

@router.post("/export-excel")
async def export_to_excel(data: dict):
    try:
        excel_file = await ExcelService.create_excel(
            tables=data.get('tables', []),
            mappings=data.get('mappings', {})
        )
        
        headers = {
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            'Content-Disposition': 'attachment; filename=extracted_data.xlsx'
        }
        
        return FileResponse(
            path=excel_file,
            filename="extracted_data.xlsx",
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers=headers
        )
    except Exception as e:
        print(f"Export error: {str(e)}")  # Debug log
        raise HTTPException(status_code=500, detail=str(e))