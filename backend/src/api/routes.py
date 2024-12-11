from fastapi import APIRouter, UploadFile, File, HTTPException
from services.pdf_service import PDFService
import os
from tempfile import NamedTemporaryFile

router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    # Save uploaded file temporarily
    with NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
        content = await file.read()
        temp_file.write(content)
        temp_file.seek(0)
        
        try:
            # Process PDF and extract tables
            tables = await PDFService.extract_tables(temp_file.name)
            return {"tables": tables}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
        finally:
            # Clean up temporary file
            os.unlink(temp_file.name)