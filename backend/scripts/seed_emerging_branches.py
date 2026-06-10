"""Seed the three emerging-branch B.Tech specialisations as Department rows.

Idempotent — re-running will UPDATE the existing rows. Lets editors/admins
manage AIML, Cyber Security and Cloud Computing through the same
/admin/departments form they use for CSE/IT/ECE/etc.

Run from backend/:
    python -m scripts.seed_emerging_branches
"""
from __future__ import annotations

from sqlalchemy import select

from app.core.database import SessionLocal
from app.models import Department


EMERGING = [
    {
        "code": "AIML",
        "name": "Artificial Intelligence & Machine Learning",
        "short_name": "AI-ML",
        "page_path": "/aiml",
        "scope_key": "dept.aiml",
        "established_year": 2020,
        "intake": 60,
        "duration": "4 Years",
        "affiliation": "RGPV Bhopal",
        "faculty_count": 8,
        "accent_from": "from-fuchsia-500",
        "accent_to": "to-indigo-700",
        "accent_solid": "#7c3aed",
        "icon": "🤖",
        "image_url": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1600&q=80",
        "badge": "Future-Ready Specialisation",
        "subtitle": "Deep Learning · Computer Vision · NLP · Robotics — under the CSE umbrella.",
        "intro_md": (
            "Artificial Intelligence and Machine Learning (AI-ML) is a sub-field of "
            "Computer Science focused on building systems that learn, reason and "
            "solve problems autonomously. At ITM, the AIML programme produces "
            "engineers ready to build intelligent agents, autonomous systems and "
            "data-driven products."
        ),
        "chips": [["🤖", "AI-ML Focused"], ["🧠", "Neural Nets"], ["⚙️", "Automation"], ["🏆", "Industry Standard"]],
        "accreditations": ["AICTE Approved", "RGPV Affiliated"],
        "specializations": ["Computer Vision", "NLP", "Reinforcement Learning", "Generative AI"],
        "features": [
            {"icon": "🧠", "title": "Neural Nets", "sub": "From perceptrons to transformers"},
            {"icon": "🤖", "title": "Robotics & Vision", "sub": "OpenCV + LiDAR integrated labs"},
            {"icon": "📊", "title": "Data Intelligence", "sub": "Spark / Hadoop / Jupyter clusters"},
            {"icon": "🏆", "title": "Industry-aligned", "sub": "NVIDIA + Microsoft AI tooling"},
        ],
        "vision": (
            "Produce world-class AI/ML engineers who build autonomous, ethical "
            "and impactful AI systems."
        ),
        "mission": [
            "Equip students with mathematical, programming and AI fundamentals.",
            "Provide hands-on exposure to industry-grade AI tooling and GPUs.",
            "Foster ethical reasoning and responsible AI practice.",
        ],
        "meta_title": "AI & ML — Emerging Branch — ITM Gwalior",
        "meta_description": "B.Tech CSE (AI & ML) at ITM Gwalior — Deep Learning, Computer Vision and Robotics",
        "is_published": True,
    },
    {
        "code": "CYBER",
        "name": "Cyber Security",
        "short_name": "Cyber",
        "page_path": "/cyber-security",
        "scope_key": "dept.cyber",
        "established_year": 2021,
        "intake": 60,
        "duration": "4 Years",
        "affiliation": "RGPV Bhopal",
        "faculty_count": 7,
        "accent_from": "from-emerald-500",
        "accent_to": "to-cyan-700",
        "accent_solid": "#059669",
        "icon": "🛡️",
        "image_url": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1600&q=80",
        "badge": "High-demand Specialisation",
        "subtitle": "Ethical Hacking · SOC Operations · Cryptography · Cloud Security.",
        "intro_md": (
            "The Cyber Security programme prepares students to defend modern "
            "digital infrastructure — network security, ethical hacking, secure "
            "software, cryptography and incident response — through a project-led "
            "curriculum aligned with NIST and OWASP industry frameworks."
        ),
        "chips": [["🛡️", "Defensive Sec"], ["🔐", "Crypto"], ["🧪", "Pen Test Labs"], ["🏆", "Industry Aligned"]],
        "accreditations": ["AICTE Approved", "RGPV Affiliated"],
        "specializations": ["Ethical Hacking", "SOC Operations", "Cryptography", "Cloud Security"],
        "features": [
            {"icon": "🔐", "title": "Cryptography", "sub": "Symmetric/asymmetric, post-quantum"},
            {"icon": "🧪", "title": "Pen Test Labs", "sub": "Kali, Metasploit, Burp Suite"},
            {"icon": "📡", "title": "Network Defence", "sub": "Firewalls, IDS, IPS, SIEM"},
            {"icon": "☁️", "title": "Cloud Security", "sub": "AWS / Azure / GCP hardening"},
        ],
        "vision": (
            "Cultivate cyber-defenders who can secure organisations against "
            "evolving threat landscapes with ethical and analytical rigour."
        ),
        "mission": [
            "Teach offensive and defensive cyber techniques with rigorous ethics.",
            "Build hands-on capability in real-world tooling and incident response.",
            "Connect students with industry CTFs, bug-bounty platforms and SOCs.",
        ],
        "meta_title": "Cyber Security — Emerging Branch — ITM Gwalior",
        "meta_description": "B.Tech CSE (Cyber Security) at ITM Gwalior — Ethical Hacking, SOC, Cryptography",
        "is_published": True,
    },
    {
        "code": "CLOUD",
        "name": "Cloud Computing",
        "short_name": "Cloud",
        "page_path": "/cloud-computing",
        "scope_key": "dept.cloud",
        "established_year": 2021,
        "intake": 60,
        "duration": "4 Years",
        "affiliation": "RGPV Bhopal",
        "faculty_count": 6,
        "accent_from": "from-sky-500",
        "accent_to": "to-blue-700",
        "accent_solid": "#0ea5e9",
        "icon": "☁️",
        "image_url": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80",
        "badge": "Industry-aligned Specialisation",
        "subtitle": "AWS · Azure · GCP · DevOps · Kubernetes · Serverless.",
        "intro_md": (
            "The Cloud Computing programme equips engineers to design, deploy and "
            "operate scalable workloads across the major cloud platforms. Students "
            "work through AWS / Azure / GCP curricula, infrastructure-as-code, "
            "container orchestration and CI/CD pipelines, graduating with "
            "production-ready cloud and DevOps skills."
        ),
        "chips": [["☁️", "Multi-Cloud"], ["🐳", "Containers"], ["⚙️", "DevOps"], ["📈", "Scalable"]],
        "accreditations": ["AICTE Approved", "RGPV Affiliated"],
        "specializations": ["AWS / Azure / GCP", "Kubernetes & Docker", "DevOps & CI/CD", "Serverless"],
        "features": [
            {"icon": "🐳", "title": "Containers", "sub": "Docker, Kubernetes, Helm"},
            {"icon": "⚙️", "title": "DevOps", "sub": "Jenkins, GitHub Actions, Argo"},
            {"icon": "📈", "title": "IaC", "sub": "Terraform, Ansible, CDK"},
            {"icon": "🛰️", "title": "Serverless", "sub": "Lambda, Cloud Functions, Workers"},
        ],
        "vision": (
            "Develop cloud-native engineers who can build resilient, scalable "
            "systems for tomorrow's businesses."
        ),
        "mission": [
            "Provide deep, hands-on exposure to AWS, Azure and GCP services.",
            "Embed DevOps and SRE practices across the curriculum.",
            "Bridge classroom learning with industry certification pathways.",
        ],
        "meta_title": "Cloud Computing — Emerging Branch — ITM Gwalior",
        "meta_description": "B.Tech CSE (Cloud Computing) at ITM Gwalior — AWS, Azure, GCP and DevOps",
        "is_published": True,
    },
]


def upsert(db, payload: dict) -> str:
    code = payload["code"]
    dept = db.scalar(select(Department).where(Department.code == code))
    if not dept:
        db.add(Department(**payload))
        return f"inserted {code}"
    for k, v in payload.items():
        setattr(dept, k, v)
    return f"updated  {code}"


def main() -> None:
    db = SessionLocal()
    try:
        for payload in EMERGING:
            print(upsert(db, payload))
        db.commit()
        print("Seed complete.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
