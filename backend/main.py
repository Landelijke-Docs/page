import json
import shutil
import uuid
from pathlib import Path

import pyclamd
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from typing import List

app = FastAPI()

QUARANTINE_DIR = Path("uploads/quarantine")
QUARANTINE_DIR.mkdir(parents=True, exist_ok=True)


ALLOWED_EXTENSIONS = {
    ".md",
    "pdf",
    ".doc",
    ".docx",
    ".ppt",
    ".pptx",
    ".json",
    ".csv",
    ".png",
    ".jpg"
}

@app.post("/upload")
async def upload(
    metadata: str = Form(...),
    files: List[UploadFile] = File(...)
):
    upload_id = str(uuid.uuid4())

    upload_dir = QUARANTINE_DIR / upload_id
    upload_dir.mkdir(parents=True, exist_ok=True)

    parsed_metadata = json.loads(metadata)

    for uploaded_file in files:
        relative_path = Path(uploaded_file.filename)

        safe_path = (upload_dir / relative_path).resolve()

        if not str(safe_path).startswith(str(upload_dir.resolve())):
            raise HTTPException(status_code=400, detail="Invalid path")

        safe_path.parent.mkdir(parents=True, exist_ok=True)

        with open(safe_path, "wb") as buffer:
            shutil.copyfileobj(uploaded_file.file, buffer)

    cd = pyclamd.ClamdUnixSocket()

    result = cd.scan_dir(str(upload_dir))

    if result:
        shutil.rmtree(upload_dir)
        raise HTTPException(status_code=400, detail="Virus detected")

    return {
        "status": "clean",
        "upload_id": upload_id,
        "metadata": parsed_metadata
    }