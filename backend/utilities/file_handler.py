import shutil
import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile

from control.config import settings


def save_upload(file: UploadFile, subdir: str) -> str:
    """
    Save an uploaded file under uploads/<subdir>/ with a UUID filename.
    Returns the URL path: /uploads/<subdir>/<filename>
    """
    suffix = Path(file.filename or "").suffix.lower() or ".jpg"
    if suffix not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"'{suffix}' is not allowed. Accepted: {sorted(settings.ALLOWED_EXTENSIONS)}",
        )

    dest_dir = settings.UPLOAD_DIR / subdir
    dest_dir.mkdir(parents=True, exist_ok=True)

    filename = f"{uuid.uuid4().hex}{suffix}"
    with (dest_dir / filename).open("wb") as out:
        shutil.copyfileobj(file.file, out)

    return f"/uploads/{subdir}/{filename}"


def delete_file(url: str) -> None:
    """Delete a single file given its /uploads/... URL. Silently ignores missing files."""
    relative = url.removeprefix("/uploads/")
    path = settings.UPLOAD_DIR / relative
    if path.exists():
        try:
            path.unlink()
        except OSError:
            pass


def delete_directory(url_prefix: str) -> None:
    """Recursively delete a directory given its /uploads/... URL prefix."""
    relative = url_prefix.removeprefix("/uploads/")
    path = settings.UPLOAD_DIR / relative
    if path.exists():
        shutil.rmtree(path, ignore_errors=True)
