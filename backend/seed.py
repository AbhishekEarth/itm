"""
Seed the database with sample faculty and student data.
Run from the backend/ directory:
    python seed.py
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

import model  # noqa — registers all ORM models with Base
from control.database import Base, SessionLocal, engine
from model.faculty import Department, Faculty
from model.student import Student, Year

Base.metadata.create_all(bind=engine)
db = SessionLocal()

# ── Clear existing seed rows ────────────────────────────────────────────────
db.query(Faculty).delete()
db.query(Student).delete()
db.commit()

# ── Faculty ─────────────────────────────────────────────────────────────────
faculty_data = [
    # CS
    Faculty(name="Dr. Ramesh Gupta",      designation="Professor & HOD",      department=Department.CS,  qualification="Ph.D. (IIT Delhi)",             experience_years=22, specialization="Machine Learning & AI",             email="ramesh.gupta@itmgoi.in"),
    Faculty(name="Dr. Sunita Agarwal",    designation="Associate Professor",   department=Department.CS,  qualification="Ph.D.",                         experience_years=14, specialization="Data Structures & Algorithms",      email="sunita.agarwal@itmgoi.in"),
    Faculty(name="Mr. Abhishek Tiwari",   designation="Assistant Professor",   department=Department.CS,  qualification="M.Tech (Computer Science)",      experience_years=6,  specialization="Web Technologies & Cloud",         email="abhishek.tiwari@itmgoi.in"),

    # IT
    Faculty(name="Dr. Anita Verma",       designation="Professor & HOD",      department=Department.IT,  qualification="Ph.D. (Information Technology)", experience_years=18, specialization="Network Security & Cryptography",   email="anita.verma@itmgoi.in"),
    Faculty(name="Mr. Vikram Singh",      designation="Assistant Professor",   department=Department.IT,  qualification="M.Tech (IT)",                   experience_years=8,  specialization="Database & Big Data",              email="vikram.singh@itmgoi.in"),

    # ECE
    Faculty(name="Dr. Mahesh Tripathi",   designation="Professor & HOD",      department=Department.ECE, qualification="Ph.D. (Electronics)",            experience_years=20, specialization="Digital Signal Processing",        email="mahesh.tripathi@itmgoi.in"),
    Faculty(name="Ms. Nisha Chouhan",     designation="Assistant Professor",   department=Department.ECE, qualification="M.Tech (ECE)",                  experience_years=5,  specialization="Embedded Systems & IoT",           email="nisha.chouhan@itmgoi.in"),

    # CE
    Faculty(name="Dr. Suresh Yadav",      designation="Professor & HOD",      department=Department.CE,  qualification="Ph.D. (Civil Engineering)",      experience_years=25, specialization="Structural Engineering",            email="suresh.yadav@itmgoi.in"),
    Faculty(name="Mr. Arun Dwivedi",      designation="Assistant Professor",   department=Department.CE,  qualification="M.Tech (Structural)",            experience_years=7,  specialization="Geo-Technical Engineering",        email="arun.dwivedi@itmgoi.in"),

    # ME
    Faculty(name="Dr. Pramod Mishra",     designation="Professor & HOD",      department=Department.ME,  qualification="Ph.D. (Mechanical Engineering)", experience_years=19, specialization="Thermal Engineering & CAD/CAM",    email="pramod.mishra@itmgoi.in"),
    Faculty(name="Mr. Rajkumar Patel",    designation="Assistant Professor",   department=Department.ME,  qualification="M.Tech (Manufacturing)",         experience_years=9,  specialization="Production & Industrial Engg.",    email="rajkumar.patel@itmgoi.in"),

    # MBA
    Faculty(name="Dr. Kavita Pandey",     designation="Professor & HOD",      department=Department.MBA, qualification="Ph.D. (Management Sciences)",    experience_years=16, specialization="Marketing & Consumer Behaviour",   email="kavita.pandey@itmgoi.in"),
    Faculty(name="Dr. Ravi Saxena",       designation="Associate Professor",   department=Department.MBA, qualification="MBA + Ph.D.",                    experience_years=11, specialization="Finance & Investment Analysis",     email="ravi.saxena@itmgoi.in"),

    # ESH
    Faculty(name="Dr. Meena Srivastava",  designation="Professor & HOD",      department=Department.ESH, qualification="Ph.D. (Environmental Science)",  experience_years=20, specialization="Environmental Impact Assessment",  email="meena.srivastava@itmgoi.in"),
    Faculty(name="Ms. Priti Sharma",      designation="Assistant Professor",   department=Department.ESH, qualification="M.Sc. (Environmental Science)",  experience_years=6,  specialization="Pollution Control & Sustainability", email="priti.sharma@itmgoi.in"),
]

for f in faculty_data:
    db.add(f)

# ── Students ────────────────────────────────────────────────────────────────
student_data = [
    Student(enrollment_no="CS2021001", name="Aditya Sharma",   department="CS",  year=Year.FOURTH,  batch="2021-2025", email="aditya.sharma@student.itmgoi.in"),
    Student(enrollment_no="CS2021002", name="Priya Gupta",     department="CS",  year=Year.FOURTH,  batch="2021-2025", email="priya.gupta@student.itmgoi.in"),
    Student(enrollment_no="CS2022001", name="Rohan Verma",     department="CS",  year=Year.THIRD,   batch="2022-2026", email="rohan.verma@student.itmgoi.in"),
    Student(enrollment_no="IT2022001", name="Rahul Mishra",    department="IT",  year=Year.THIRD,   batch="2022-2026", email="rahul.mishra@student.itmgoi.in"),
    Student(enrollment_no="IT2022002", name="Sneha Verma",     department="IT",  year=Year.THIRD,   batch="2022-2026", email="sneha.verma@student.itmgoi.in"),
    Student(enrollment_no="ECE2023001",name="Rohit Tiwari",    department="ECE", year=Year.SECOND,  batch="2023-2027", email="rohit.tiwari@student.itmgoi.in"),
    Student(enrollment_no="ECE2023002",name="Anjali Singh",    department="ECE", year=Year.SECOND,  batch="2023-2027", email="anjali.singh@student.itmgoi.in"),
    Student(enrollment_no="CE2023001", name="Akash Yadav",     department="CE",  year=Year.SECOND,  batch="2023-2027", email="akash.yadav@student.itmgoi.in"),
    Student(enrollment_no="ME2024001", name="Vikas Patel",     department="ME",  year=Year.FIRST,   batch="2024-2028", email="vikas.patel@student.itmgoi.in"),
    Student(enrollment_no="ME2024002", name="Pooja Rajput",    department="ME",  year=Year.FIRST,   batch="2024-2028", email="pooja.rajput@student.itmgoi.in"),
    Student(enrollment_no="MBA2023001",name="Neha Pandey",     department="MBA", year=Year.SECOND,  batch="2023-2025", email="neha.pandey@student.itmgoi.in"),
    Student(enrollment_no="MBA2024001",name="Saurabh Jain",    department="MBA", year=Year.FIRST,   batch="2024-2026", email="saurabh.jain@student.itmgoi.in"),
    Student(enrollment_no="ESH2023001",name="Tanvi Dubey",     department="ESH", year=Year.SECOND,  batch="2023-2027", email="tanvi.dubey@student.itmgoi.in"),
]

for s in student_data:
    db.add(s)

db.commit()
db.close()

print("Seed complete.")
print(f"  Faculty : {len(faculty_data)} records")
print(f"  Students: {len(student_data)} records")
