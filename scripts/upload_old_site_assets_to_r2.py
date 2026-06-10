"""One-shot script: upload the static-mirror assets the new React site
references into the Cloudflare R2 bucket so they actually serve.

Source:  C:\\My Web Sites\\itmgoi\\www.itmgoi.in\\
Target:  R2 bucket itm-goi-bucket, paths mirrored 1:1.

After running, find/replace `https://www.itmgoi.in/` -> public R2 URL
in frontend/src/** to point the React app at the new location.
"""
from __future__ import annotations
import mimetypes
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

import boto3
from botocore.client import Config

SOURCE_ROOT = Path(r"C:\My Web Sites\itmgoi\www.itmgoi.in")
BUCKET = "itm-goi-bucket"
ENDPOINT = "https://e4dc1479765bf3f438c97824a1752b72.r2.cloudflarestorage.com"
ACCESS_KEY = "9ffcde3a0fa5b0bf6e5c0b7f30ac7fb5"
SECRET_KEY = "40f387dda5f4326be6ba3b43c82bbed43dcd16b199b9671aa87e872878d84a0b"
PUBLIC_BASE = "https://pub-127dc462e0864e8981d24768d4ba7822.r2.dev"


# Folders to upload wholesale (every file in the folder, non-recursive)
WHOLE_FOLDERS = [
    "assets2/images",
    "include/gallery/NSS_19to23/NSS",
    "include/gallery/WEC",
    "include/gallery/fdp_Pics",
    "include/gallery/IIC_TEAM",
    "include/gallery/Best_practice1",
    "include/gallery/Research_gallery",
    "include/gallery/Book_Cover",
    "include/gallery/Book_Cover/Research",
    "include/gallery/Sport_Cell_Achivements_photo",
    "include/gallery/PAC_pics",
]

# Specific files from big folders we only need a few of
SPECIFIC_FILES = [
    # ─── GalleryPages.jsx — cultural ────────────────────────────
    *[f"include/gallery/cultural_gallery/cultural_events/_DSC{n}.jpg" for n in
      ("0963","0983","1015","1045","1955","2067","2435","2552","2797","3248","3255","3977")],
    # experts
    *[f"include/gallery/Experts_from_industry_and_academia/experts_from_industry_and_academia/_DSC{n}.jpg" for n in
      ("0583","0704","1443","1697","1708","1728","1795","2185")],
    # infrastructure
    *[f"include/gallery/infrastructure/infrastructure/DSC_{n}.jpg" for n in
      ("0161","0164","0258","0291","0317","0322","0522","2290")],
    # sports
    *[f"include/gallery/Sports/Sports/_DSC{n}.jpg" for n in
      ("0929","0978","1062","1075","1089","8842","8940","9015")],
    # students
    *[f"include/gallery/Student_photos/Student_photos/_DSC{n}.jpg" for n in
      ("1151","1175","1207","1209","1212","1242","1274","1289")],
    # ─── SportsPage.jsx — Club_photos Sp7..Sp20 ────────────────
    *[f"include/gallery/Club_photos/Sp{i}.jpg" for i in range(7, 21)],
    # ─── ResearchConference.jsx — Conference_Pics ───────────────
    *[f"include/gallery/Conference_Pics/{name}" for name in (
        "111A8808.JPG","111A8838.JPG","111A8847.JPG","111A8857.JPG",
        "111A8872.JPG","111A8907.JPG","111A8914.JPG","111A8920.JPG",
        "111A8958.JPG","111A8963.JPG","111A8974.JPG","111A9014.JPG",
        "111A9033.JPG","111A9041.JPG","111A9049.JPG",
    )],
    # ─── PDF docs ───────────────────────────────────────────────
    "IQAC/Conf_FDP/Brochure_International_Conference.pdf",
    "IQAC/Conf_FDP/National_FDP_ITM.pdf",
    "IQAC/Conf_FDP/Fdp.jpg",
    "IQAC/docs/DocswithoutDigi/Book_2023-2024.pdf",
    "IQAC/docs/DocswithoutDigi/Book_2022-2023.pdf",
    "IQAC/docs/DocswithoutDigi/Book_2021-2022.pdf",
    "IQAC/docs/DocswithoutDigi/Book_2019-2020.pdf",
    "IQAC/docs/DocswithoutDigi/Research_Grants.pdf",
    "IQAC/docs/DocswithoutDigi/List_of_IPR_2019-2024.pdf",
    "IQAC/docs/Website_UpdateDec2024/MoU_2023-2024.pdf",
    "IQAC/docs/Website_UpdateDec2024/MoU_2022-2023.pdf",
    "IQAC/docs/Website_UpdateDec2024/MoU_2021-2022.pdf",
    "IQAC/docs/Website_UpdateDec2024/MoU_2020-2021.pdf",
    "IQAC/docs/Website_UpdateDec2024/MoU_2019-2020.pdf",
    "NAAC/docs/policies/Research Promotion Policy.pdf",
]


def build_client():
    return boto3.client(
        "s3",
        endpoint_url=ENDPOINT,
        aws_access_key_id=ACCESS_KEY,
        aws_secret_access_key=SECRET_KEY,
        region_name="auto",
        config=Config(signature_version="s3v4"),
    )


def collect_files() -> list[tuple[Path, str]]:
    """Return [(local_path, r2_key)] pairs to upload."""
    tasks: list[tuple[Path, str]] = []
    seen: set[str] = set()

    for folder in WHOLE_FOLDERS:
        local = SOURCE_ROOT / folder.replace("/", "\\")
        if not local.is_dir():
            print(f"  ! missing folder: {local}", file=sys.stderr)
            continue
        for entry in sorted(local.iterdir()):
            if entry.is_file():
                key = f"{folder}/{entry.name}"
                if key in seen:
                    continue
                seen.add(key)
                tasks.append((entry, key))

    for rel in SPECIFIC_FILES:
        local = SOURCE_ROOT / rel.replace("/", "\\")
        if not local.is_file():
            print(f"  ! missing file: {local}", file=sys.stderr)
            continue
        if rel in seen:
            continue
        seen.add(rel)
        tasks.append((local, rel))

    return tasks


def upload_one(client, local: Path, key: str) -> tuple[str, bool, str]:
    ctype, _ = mimetypes.guess_type(local.name)
    extra = {"ContentType": ctype or "application/octet-stream"}
    # PUBLIC bucket -> default permission. R2 public-access is bucket-level,
    # so we don't need per-object ACLs.
    try:
        client.upload_file(str(local), BUCKET, key, ExtraArgs=extra)
        return key, True, ""
    except Exception as e:  # pragma: no cover
        return key, False, str(e)


def main() -> int:
    client = build_client()
    tasks = collect_files()
    print(f"Planning to upload {len(tasks)} objects to bucket '{BUCKET}'")
    total_bytes = sum(p.stat().st_size for p, _ in tasks)
    print(f"Total size: {total_bytes / (1024 * 1024):.1f} MB")

    ok = 0
    fail = 0
    with ThreadPoolExecutor(max_workers=8) as pool:
        futures = [pool.submit(upload_one, client, p, k) for p, k in tasks]
        for i, fut in enumerate(as_completed(futures), 1):
            key, success, err = fut.result()
            if success:
                ok += 1
                if i % 25 == 0 or i == len(tasks):
                    print(f"  [{i}/{len(tasks)}] OK  {key}")
            else:
                fail += 1
                print(f"  [{i}/{len(tasks)}] FAIL {key}: {err}", file=sys.stderr)

    print(f"\nDone. {ok} ok, {fail} failed.")
    print(f"Sample URL: {PUBLIC_BASE}/assets2/images/CSE_Lab1.jpg")
    return 0 if fail == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
