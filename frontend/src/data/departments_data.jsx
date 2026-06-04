import React from 'react';

export const departmentsData = {
  // ─── COMPUTER SCIENCE & ENGINEERING ─────────────────────────────────────
  "cse": {
    id: "cse",
    name: <>Computer Science &<br /><span className="text-red-200">Engineering</span></>,
    title: "Computer Science & Engineering",
    shortName: "CSE",
    badge: "NBA Accredited 2022–2025",
    subtitle: "Est. July 1997 · B.Tech & M.Tech Programmes · Cutting-Edge Research · State-of-the-Art Laboratories",
    chips: [['🎓', 'B.Tech & M.Tech'], ['🔬', 'Research Labs'], ['💡', 'Industry Connect'], ['🏆', 'NBA Accredited']],
    menuItems: [
      { id: 'about', label: 'About Department' },
      { id: 'hod', label: 'HoD Desk' },
      { 
        id: 'emerging', 
        label: 'Emerging Branches', 
        isDropdown: true,
        children: [
          { id: 'data-science', label: 'Data Science', path: '/department/cse/data-science' },
          { id: 'aiml', label: 'AI & Machine Learning', path: '/department/cse/aiml' },
          { id: 'cyber-security', label: 'Cyber Security', path: '/department/cse/cyber-security' },
          { id: 'cloud-computing', label: 'Cloud Computing', path: '/department/cse/cloud-computing' },
        ]
      },
      { id: 'course', label: 'Course' },
      { id: 'labs', label: 'Laboratories' },
      { id: 'faculty', label: 'Faculty' },
      { id: 'placement', label: 'Placement' },
      { id: 'obe', label: 'OBE' },
    ],
    sections: {
      about: {
        title: "About Department",
        description: [
          "The Discipline of Computer Science and Engineering (CSE) was set up in July 1997. It is one of the disciplines that offers Bachelor of Technology (B.Tech) and Master of Technology (M.Tech.) programmes.",
          "The discipline adopts a modern approach to teaching wherein students are rendered in adequate academic freedom to innovate and learn in the process. Facilities, including the latest software and advanced hardware are available in various laboratories for use in both teaching and research."
        ],
        features: [
          { icon: '📅', title: 'Est. July 1997', sub: 'Over 25 years of academic excellence' },
          { icon: '🎓', title: 'B.Tech & M.Tech', sub: 'Undergraduate and postgraduate programmes' },
          { icon: '🔬', title: 'Advanced Labs', sub: 'Latest software & hardware infrastructure' },
          { icon: '👨‍🏫', title: 'Diverse Faculty', sub: 'Experts from varied streams & specializations' },
        ],
        vision: "The department envisions nurturing students to become technologically proficient, research competent and socially accountable for the welfare of the society.",
        mission: [
          'To provide high quality education through an effective teaching-learning process, emphasizing active participation of the students.',
          'To build scientifically strong engineers to cater to the needs of industry, higher studies, research and startups.',
          'To stir young minds, ingrained with professional and behavioral ethics for the betterment of the society.',
        ],
        peos: [
          'Our graduates will exhibit team-work and leadership qualities to meet stakeholders\' business objectives in their careers.',
          'Our graduates will employ capabilities of solving complex engineering problems to succeed in research and / or higher studies.',
          'Our graduates will demonstrate application of comprehensive technical knowledge for innovation and entrepreneurship.',
          'Our graduates will evolve in ethical and professional practices and enhance socio-economic contributions to the society.',
        ],
        psos: [
          'The ability to understand the principles of computer hardware and software to analyze, design and develop algorithms for complex and logical problems.',
          'Enhance programming concepts and professional competencies of students by exercising principles of software engineering to fix various computational problems.',
          'To implement emerging technologies such as internet of things, cloud computing, artificial intelligence, machine learning etc. to serve the society.',
        ]
      },
      hod: {
        title: "HoD Desk",
        name: "Dr. Rishi Soni",
        designation: "Professor & Head",
        message: [
          'I warmly welcome you to the Department of Computer Science & Engineering. We pride ourselves on providing pioneering visionaries of tomorrow, conducting cutting-edge research, and leading a wide range of initiatives that affirm the transformative power of computing and informatics.',
          'The Department has well-qualified and experienced faculty which strengthens the students to become technologically proficient, research competent, and socially accountable for the welfare of society.',
          'High-quality academic programs provide a unique combination of teaching, research, and hands-on services which strengthen problem-solving skills.'
        ],
        highlights: [
          { icon: '👨‍🏫', title: 'Expert Faculty', sub: 'Well-qualified & experienced research-active staff' },
          { icon: '🏭', title: 'Industry Connect', sub: 'Research with local industry experts & partners' },
          { icon: '🧠', title: 'Critical Thinking', sub: 'Skills valued by reputed companies & institutions' },
        ]
      },
      placement: {
        title: "Placement Highlights",
        description: "The CSE department consistently achieves high placement rates with students being recruited by global tech giants and innovative startups alike.",
        stats: [
          { label: "Highest Package", value: "45 LPA" },
          { label: "Average Package", value: "6.5 LPA" },
          { label: "Placement Rate", value: "92%" },
          { label: "Recruiters", value: "250+" }
        ],
        highlights: [
          { icon: '🚀', title: 'Top Recruiters', sub: 'Google, Microsoft, Amazon, Adobe, TCS, Infosys, Wipro' },
          { icon: '💼', title: 'Internships', sub: 'Paid internships at leading tech companies' },
          { icon: '📈', title: 'Vast Alumni Network', sub: 'Connecting students with global opportunities' }
        ]
      },
      obe: {
        peos: [
          "Our graduates will exhibit team-work and leadership qualities to meet stakeholders' business objectives in their careers.",
          "Our graduates will employ capabilities of solving complex engineering problems to succeed in research and / or higher studies.",
          "Our graduates will demonstrate application of comprehensive technical knowledge for innovation and entrepreneurship.",
          "Our graduates will evolve in ethical and professional practices and enhance socio-economic contributions to the society."
        ],
        psos: [
          "The ability to understand the principles of computer hardware and software to analyze, design and develop algorithms.",
          "Enhance programming concepts and professional competencies for computational problems.",
          "To implement emerging technologies such as IoT, Cloud, AI, and Machine Learning to serve the society."
        ]
      },
      faculty: [
        { sno: 1,  name: 'Dr. Rishi Soni',               qual: 'Ph.D',   desig: 'Professor',           exp: '28+ Years' },
        { sno: 2,  name: 'Dr. Pradeep Yadav',             qual: 'Ph.D',   desig: 'Associate Professor', exp: '26+ Years' },
        { sno: 3,  name: 'Dr. Deepak Omprakash Gupta',    qual: 'Ph.D',   desig: 'Associate Professor', exp: '2+ Years'  },
      ]
    }
  },

  // ─── INFORMATION TECHNOLOGY ─────────────────────────────────────────────
  "it": {
    id: "it",
    name: <>Information<br /><span className="text-red-200">Technology</span></>,
    title: "Information Technology",
    shortName: "IT",
    badge: "AICTE Approved",
    subtitle: "B.Tech Programme · 565 Terminals · High-Speed Wi-Fi · Advanced Application Labs",
    chips: [['💻', 'B.Tech Programme'], ['🌐', '565 Terminals'], ['☁️', 'Cloud & AI'], ['🏅', 'AICTE Approved']],
    menuItems: [
      { id: 'about', label: 'About Department' },
      { id: 'hod', label: 'HoD Desk' },
      { id: 'course', label: 'Course' },
      { id: 'labs', label: 'Laboratories' },
      { id: 'faculty', label: 'Faculty' },
      { id: 'placement', label: 'Placement' },
      { id: 'obe', label: 'OBE' },
    ],
    sections: {
      about: {
        title: "About Department",
        description: [
          "The Department of Information Technology at the Institute of Technology & Management is dedicated to nurturing professionals with the technical expertise required to drive automation in production processes."
        ],
        features: [
          { icon: '🖥️', title: '565 Terminals', sub: 'Hybrid lab configurations with Wi-Fi' },
          { icon: '📦', title: 'Advanced Labs', sub: 'Application software & compilers' },
        ],
        vision: "The Department of Information Technology envisions preparing technically competent problem solvers.",
        mission: [
          'To offer valuable education through an effective pedagogical teaching-learning process.',
          'To shape technologically strong students for industry, research & higher studies.',
        ]
      },
      hod: {
        title: "HoD Desk",
        name: "Dr. Aditya Vidyarthi",
        designation: "Professor & Head",
        message: [
          "It is with immense pride that I welcome you to the Department of Information Technology. Our department serves as a hub of cutting-edge technological innovation."
        ]
      }
    }
  },

  // ─── ELECTRONICS & COMM. ENGINEERING ─────────────────────────────────────
  "ece": {
    id: "ece",
    name: <>Electronics &<br /><span className="text-red-200">Comm. Engineering</span></>,
    title: "Electronics & Comm. Engineering",
    shortName: "ECE",
    badge: "AICTE Approved",
    subtitle: "B.Tech Programme · VLSI, Embedded Systems, Signal Processing & Wireless Communication.",
    chips: [['📻', 'VLSI & Semi'], ['📡', 'Wireless'], ['📟', 'Embedded'], ['🏅', 'AICTE Approved']],
    menuItems: [
      { id: 'about', label: 'About Department' },
      { id: 'hod', label: 'HoD Desk' },
      { id: 'course', label: 'Course' },
      { id: 'labs', label: 'Laboratories' },
      { id: 'faculty', label: 'Faculty' },
      { id: 'placement', label: 'Placement' },
      { id: 'obe', label: 'OBE' },
    ],
    sections: {
      about: {
        title: "About Department",
        description: ["The Department of Electronics and Communication Engineering (ECE) focuses on the study and application of electricity, electronics, and electromagnetism."],
        features: [
          { icon: '📻', title: 'VLSI Design', sub: 'Chip design and microelectronics' },
          { icon: '📡', title: 'Signal Processing', sub: 'Digital and analog systems' },
        ],
        vision: "To be a globally recognized center of excellence in electronics education.",
        mission: ["Nurture innovative engineers with ethical values."]
      }
    }
  },

  // ─── CIVIL ENGINEERING ──────────────────────────────────────────────────
  "civil": {
    id: "civil",
    name: <>Civil<br /><span className="text-red-200">Engineering</span></>,
    title: "Civil Engineering",
    shortName: "Civil",
    badge: "AICTE Approved · Est. 1997",
    subtitle: "B.Tech Programme · Structures, Geotechnics, Transportation & Environmental Engineering · Building the Nation's Infrastructure",
    chips: [['🏗️', 'B.Tech Programme'], ['🔬', 'Research Labs'], ['🌉', 'Field Projects'], ['🏅', 'AICTE Approved']],
    menuItems: [
      { id: 'about', label: 'About Department' },
      { id: 'hod', label: 'HoD Desk' },
      { id: 'course', label: 'Course' },
      { id: 'labs', label: 'Laboratories' },
      { id: 'faculty', label: 'Faculty' },
      { id: 'placement', label: 'Placement' },
      { id: 'infrastructure', label: 'Infrastructure' },
      { id: 'research', label: 'Research' },
      { id: 'obe', label: 'OBE' },
    ],
    sections: {
      about: {
        title: "About Department",
        description: [
          "The Department of Civil Engineering was established in 1997 and is one of the oldest and most prestigious departments of ITM Group of Institutions, Gwalior.",
          "Civil Engineering is one of the broadest engineering disciplines, dealing with the design, construction, and maintenance of the physical and naturally built environment."
        ],
        features: [
          { icon: '📅', title: 'Est. 1997', sub: 'Over 27 years of academic excellence' },
          { icon: '🎓', title: 'B.Tech Programme', sub: '4-year undergraduate programme' },
          { icon: '🔬', title: '10+ Laboratories', sub: 'State-of-the-art lab infrastructure' },
          { icon: '👨‍🏫', title: '15 Faculty Members', sub: 'Expert faculty with research experience' },
        ],
        vision: "To be a centre of excellence in civil engineering education and research, producing competent professionals who contribute to sustainable infrastructure development.",
        mission: [
          'To impart quality technical education through innovative teaching-learning methodologies to produce competent civil engineers.',
          'To foster research culture and provide exposure to emerging technologies in civil engineering for sustainable development.',
        ]
      },
      hod: {
        title: "HoD Desk",
        name: "Dr. R.K. Sharma",
        designation: "Professor & Head",
        message: [
          'I warmly welcome you to the Department of Civil Engineering at ITM Group of Institutions, Gwalior. Established in 1997, our department has been a cornerstone of engineering education in the region.',
          'The department is committed to providing a holistic learning experience that blends theoretical knowledge with practical applications.'
        ],
        highlights: [
          { icon: '👨‍🏫', title: 'Expert Faculty', sub: '15 qualified faculty with research publications' },
          { icon: '🏭', title: 'Industry Connect', sub: 'Tie-ups with L&T, Tata Projects & NHAI' },
          { icon: '🧠', title: 'GATE & IES', sub: '25+ GATE qualifiers in last 5 years' },
        ]
      }
    }
  },

  // ─── MECHANICAL ENGINEERING ─────────────────────────────────────────────
  "me": {
    id: "me",
    name: <>Mechanical<br /><span className="text-red-200">Engineering</span></>,
    title: "Mechanical Engineering",
    shortName: "ME",
    badge: "AICTE Approved · Est. 1997",
    subtitle: "B.Tech Programme · Thermodynamics, Manufacturing, Design & Robotics · Building World-Class Engineers",
    chips: [['⚙️', 'B.Tech Programme'], ['🔧', 'Design & Manufacturing'], ['🤖', 'Robotics Lab'], ['🏅', 'AICTE Approved']],
    menuItems: [
      { id: 'about', label: 'About Department' },
      { id: 'hod', label: 'HoD Desk' },
      { id: 'course', label: 'Course' },
      { id: 'labs', label: 'Laboratories' },
      { id: 'faculty', label: 'Faculty' },
      { id: 'placement', label: 'Placement' },
      { id: 'obe', label: 'OBE' },
    ],
    sections: {
      about: {
        title: "About Department",
        description: [
          "The Department of Mechanical Engineering was established in 1997 and is among the founding departments of ITM Group of Institutions, Gwalior.",
          "The department offers a comprehensive curriculum covering areas such as Thermodynamics, Manufacturing Technology, Machine Design, Fluid Mechanics, Robotics, and Automobile Engineering. Students are equipped with both theoretical knowledge and practical skills through hands-on lab work and industry projects."
        ],
        features: [
          { icon: '📅', title: 'Est. 1997', sub: 'Over 27 years of academic excellence' },
          { icon: '🎓', title: 'B.Tech Programme', sub: '4-year undergraduate programme' },
          { icon: '🔬', title: '12+ Laboratories', sub: 'Thermal, Fluid, Manufacturing & Robotics labs' },
          { icon: '👨‍🏫', title: 'Expert Faculty', sub: 'Ph.D. holders with industry experience' },
        ],
        vision: "To be a centre of excellence in mechanical engineering education and research, producing industry-ready professionals.",
        mission: [
          'To impart quality technical education through innovative teaching methodologies.',
          'To foster research culture and industry collaboration.',
          'To develop professionally competent engineers with ethical values.',
        ]
      },
      hod: {
        title: "HoD Desk",
        name: "Dr. S.K. Jain",
        designation: "Professor & Head",
        message: [
          "Welcome to the Department of Mechanical Engineering at ITM, Gwalior. Our department has been a cornerstone of engineering education since 1997.",
          "We are committed to providing a world-class learning experience through state-of-the-art laboratories, experienced faculty, and industry partnerships."
        ],
        highlights: [
          { icon: '👨‍🏫', title: 'Expert Faculty', sub: 'Experienced researchers and industry professionals' },
          { icon: '🏭', title: 'Industry Tie-ups', sub: 'Collaborations with leading manufacturing firms' },
          { icon: '🧠', title: 'GATE & Higher Studies', sub: 'Strong record of competitive exam success' },
        ]
      }
    }
  },

  // ─── MASTER OF BUSINESS ADMINISTRATION ──────────────────────────────────
  "mba": {
    id: "mba",
    name: <>Master of<br /><span className="text-red-200">Business Administration</span></>,
    title: "Master of Business Administration",
    shortName: "MBA",
    badge: "AICTE Approved",
    subtitle: "2-Year MBA Programme · Finance, Marketing, HR & Operations · Developing Future Business Leaders",
    chips: [['📊', 'MBA Programme'], ['💼', 'Industry Internships'], ['🎯', 'Placement Cell'], ['🏅', 'AICTE Approved']],
    menuItems: [
      { id: 'about', label: 'About Department' },
      { id: 'hod', label: 'HoD Desk' },
      { id: 'course', label: 'Course' },
      { id: 'faculty', label: 'Faculty' },
      { id: 'placement', label: 'Placement' },
      { id: 'obe', label: 'OBE' },
    ],
    sections: {
      about: {
        title: "About Department",
        description: [
          "The Department of Management Studies offers a 2-year full-time MBA programme approved by AICTE. The programme is designed to develop future business leaders with a strong foundation in management principles and practices.",
          "Students receive rigorous training in Finance, Marketing, Human Resource Management, and Operations & Supply Chain Management, complemented by live projects, industry internships, and guest lectures from corporate leaders."
        ],
        features: [
          { icon: '📊', title: '2-Year MBA', sub: 'Full-time AICTE approved programme' },
          { icon: '💼', title: 'Industry Internships', sub: 'Summer and live project internships' },
          { icon: '🎯', title: 'Strong Placements', sub: 'Dedicated placement cell with industry network' },
          { icon: '👨‍🏫', title: 'Expert Faculty', sub: 'Professors with corporate and research experience' },
        ],
        vision: "To develop globally competent management professionals with ethical values and entrepreneurial spirit.",
        mission: [
          'To provide quality management education through innovative pedagogy and experiential learning.',
          'To bridge the gap between academia and industry through collaborations and internships.',
          'To nurture leadership, teamwork, and ethical business practices among students.',
        ]
      },
      hod: {
        title: "HoD Desk",
        name: "Dr. P.K. Sharma",
        designation: "Professor & Head",
        message: [
          "Welcome to the Department of Management Studies at ITM, Gwalior. We are committed to shaping the next generation of business leaders.",
          "Our holistic approach combines classroom learning with real-world exposure through internships, industry visits, and management development programmes."
        ],
        highlights: [
          { icon: '👨‍🏫', title: 'Experienced Faculty', sub: 'Dedicated professors with industry background' },
          { icon: '💼', title: 'Corporate Connect', sub: 'Regular industry interaction and guest lectures' },
          { icon: '🎯', title: 'Placement Record', sub: 'Consistent placement track record with top companies' },
        ]
      }
    }
  },

  // ─── ENGINEERING SCIENCES & HUMANITIES ──────────────────────────────────
  "esh": {
    id: "esh",
    name: <>Engineering Sciences<br /><span className="text-red-200">& Humanities</span></>,
    title: "Engineering Sciences & Humanities",
    shortName: "ESH",
    badge: "Foundation Department",
    subtitle: "Mathematics, Physics, Chemistry, English & Professional Ethics · Building Strong Foundations for Engineers",
    chips: [['📐', 'Mathematics'], ['🔬', 'Physics & Chemistry'], ['📖', 'English & Communication'], ['🏅', 'Foundation Dept.']],
    menuItems: [
      { id: 'about', label: 'About Department' },
      { id: 'hod', label: 'HoD Desk' },
      { id: 'faculty', label: 'Faculty' },
      { id: 'labs', label: 'Laboratories' },
      { id: 'obe', label: 'OBE' },
    ],
    sections: {
      about: {
        title: "About Department",
        description: [
          "The Department of Engineering Sciences & Humanities (ESH) is the foundation department responsible for teaching first-year engineering students across all branches.",
          "The department covers core subjects including Mathematics, Physics, Chemistry, English, Professional Ethics, and Environmental Studies. It ensures that students develop a strong analytical and communication foundation essential for advanced engineering coursework."
        ],
        features: [
          { icon: '📐', title: 'Mathematics', sub: 'Calculus, Linear Algebra, Probability & Statistics' },
          { icon: '🔬', title: 'Science Labs', sub: 'Physics & Chemistry laboratory facilities' },
          { icon: '📖', title: 'Communication Skills', sub: 'English language and soft skills training' },
          { icon: '🧑‍🏫', title: 'Experienced Faculty', sub: 'Dedicated teachers for foundational courses' },
        ],
        vision: "To build a strong academic foundation for engineering students through comprehensive teaching of basic sciences and humanities.",
        mission: [
          'To provide quality education in fundamental sciences and humanities.',
          'To develop analytical thinking, problem-solving, and communication skills.',
          'To prepare students for advanced engineering studies and professional careers.',
        ]
      },
      hod: {
        title: "HoD Desk",
        name: "Dr. M. Gupta",
        designation: "Professor & Head",
        message: [
          "Welcome to the Department of Engineering Sciences & Humanities. We take pride in laying the groundwork for every engineer who passes through ITM, Gwalior.",
          "Our experienced faculty ensures that students receive a well-rounded education in basic sciences, mathematics, and communication skills."
        ],
        highlights: [
          { icon: '📐', title: 'Strong Foundations', sub: 'Core science and math training for all branches' },
          { icon: '📖', title: 'Communication', sub: 'English and soft skills development' },
          { icon: '🔬', title: 'Lab Facilities', sub: 'Well-equipped physics and chemistry labs' },
        ]
      }
    }
  },

  // ─── DATA SCIENCE (BRANCH) ──────────────────────────────────────────────
  "data-science": {
    id: "data-science",
    parent: "cse",
    name: <>Data<br /><span className="text-red-200">Science</span></>,
    title: "Data Science",
    shortName: "DS",
    badge: "Specialization under CSE",
    subtitle: "Master the art of extracting insights from complex data. Industry-aligned curriculum with high-performance computing.",
    chips: [['📊', 'Data Analytics'], ['🤖', 'Machine Learning'], ['💡', 'AI Integrated'], ['📅', '4 Year Program']],
    menuItems: [
      { id: 'about', label: 'About Specialization' },
      { id: 'curriculum', label: 'Curriculum' },
      { id: 'labs', label: 'Laboratories' },
      { id: 'careers', label: 'Careers' },
    ],
    sections: {
      about: {
        title: "About Specialization",
        description: [
          "Data Science is one of the most in-demand fields in the modern tech landscape. This specialization under CSE focuses on statistical modeling, data visualization, and machine learning.",
          "Our program provides hands-on experience with real-world datasets and industry-standard tools like Python, R, and SQL."
        ],
        features: [
          { icon: '📈', title: 'Predictive Modeling', sub: 'Learn to forecast trends' },
          { icon: '🔗', title: 'Big Data', sub: 'Handling massive datasets' },
        ],
        vision: "To create world-class data scientists who can solve complex problems using data-driven insights.",
        mission: [
          "To provide a strong foundation in statistics and computer science.",
          "To encourage research and innovation in data analytics."
        ]
      },
      curriculum: {
        title: "Curriculum & Schemes",
        description: "The Data Science curriculum is designed in collaboration with industry experts to cover the latest trends in Big Data, Machine Learning, and Statistical Analysis.",
        schemes: [
          { name: "B.Tech CSE (Data Science) - VII & VIII Sem", type: "Syllabus 2024", icon: "📄" },
          { name: "B.Tech CSE (Data Science) - V & VI Sem", type: "Syllabus 2023", icon: "📄" },
          { name: "B.Tech CSE (Data Science) - III & IV Sem", type: "Syllabus 2022", icon: "📄" }
        ]
      },
      labs: {
        title: "Specialized Laboratories",
        description: "High-performance computing environments dedicated to data crunching and AI modeling.",
        list: [
          { 
            name: "Data Analytics Lab", 
            description: "Equipped with high-end workstations for processing large datasets using Hadoop and Spark.",
            icon: "📊",
            equipment: ["NVIDIA RTX 3080 Nodes", "Hadoop Cluster", "Spark Framework"]
          },
          { 
            name: "Cloud Computing Lab", 
            description: "Virtualization and cloud infrastructure management lab using OpenStack and AWS connect.",
            icon: "☁️",
            equipment: ["Dell PowerEdge Servers", "Proxmox", "AWS Academy Access"]
          }
        ]
      },
      careers: {
        title: "Career Opportunities",
        description: "Data Science graduates are in high demand across sectors including Finance, Healthcare, E-commerce, and Technology.",
        roles: [
          { name: "Data Scientist", icon: "🕵️" },
          { name: "Machine Learning Engineer", icon: "🤖" },
          { name: "Data Architect", icon: "🏗️" },
          { name: "Business Intelligence Analyst", icon: "📈" }
        ]
      }
    }
  },

  "aiml": {
    id: "aiml",
    parent: "cse",
    name: <>AI &<br /><span className="text-red-200">Machine Learning</span></>,
    title: "AI & Machine Learning",
    shortName: "AI-ML",
    badge: "Specialization under CSE",
    subtitle: "Building the brains of tomorrow. Focus on Neural Networks, DL, and Generative AI.",
    chips: [['🤖', 'Neural Nets'], ['🧠', 'Deep Learning'], ['💬', 'NLP'], ['🖼️', 'Computer Vision']],
    menuItems: [
      { id: 'about', label: 'About Specialization' },
      { id: 'curriculum', label: 'Curriculum' },
      { id: 'labs', label: 'Laboratories' },
      { id: 'careers', label: 'Careers' },
    ],
    sections: {
      about: {
        title: "About Specialization",
        description: ["Artificial Intelligence and Machine Learning are transforming every industry. This program focuses on developing algorithms that can learn and make decisions."],
        features: [
          { icon: '🧠', title: 'Deep Learning', sub: 'Advanced Neural Architectures' },
          { icon: '🤖', title: 'Generative AI', sub: 'LLMs & Diffusion Models' },
        ],
        vision: "Pioneering the next generation of AI research.",
        mission: ["Foster innovation in autonomous systems."]
      }
    }
  },

  "cyber-security": {
    id: "cyber-security",
    parent: "cse",
    name: <>Cyber<br /><span className="text-red-200">Security</span></>,
    title: "Cyber Security",
    shortName: "Cyber",
    badge: "Specialization under CSE",
    subtitle: "Defending the digital frontier. Cryptography, Ethical Hacking, and Network Defense.",
    chips: [['🛡️', 'Network Defense'], ['🔐', 'Cryptography'], ['👨‍💻', 'Ethical Hacking'], ['📜', 'Forensics']],
    menuItems: [
      { id: 'about', label: 'About Specialization' },
      { id: 'curriculum', label: 'Curriculum' },
      { id: 'labs', label: 'Laboratories' },
      { id: 'careers', label: 'Careers' },
    ],
    sections: {
      about: {
        title: "About Specialization",
        description: ["In an increasingly connected world, security is paramount. This specialization trains students in identifying vulnerabilities and securing digital infrastructure."],
        features: [
          { icon: '🔐', title: 'Advanced Crypto', sub: 'Modern encryption techniques' },
          { icon: '🛡️', title: 'Threat Intel', sub: 'Proactive defense strategies' },
        ],
        vision: "Securing the future of global digital interaction.",
        mission: ["Building expert ethical hackers and security analysts."]
      }
    }
  },

  "cloud-computing": {
    id: "cloud-computing",
    parent: "cse",
    name: <>Cloud<br /><span className="text-red-200">Computing</span></>,
    title: "Cloud Computing",
    shortName: "Cloud",
    badge: "Specialization under CSE",
    subtitle: "Scaling the future. AWS, Azure, GCP, and Containerization (K8s).",
    chips: [['☁️', 'Multi-Cloud'], ['🐳', 'Docker & K8s'], ['🔄', 'Serverless'], ['🌐', 'DevOps']],
    menuItems: [
      { id: 'about', label: 'About Specialization' },
      { id: 'curriculum', label: 'Curriculum' },
      { id: 'labs', label: 'Laboratories' },
      { id: 'careers', label: 'Careers' },
    ],
    sections: {
      about: {
        title: "About Specialization",
        description: ["Cloud computing is the backbone of modern web applications. This specialization covers distributed systems, cloud architecture, and DevOps practices."],
        features: [
          { icon: '🐳', title: 'Containerization', sub: 'Docker & Kubernetes' },
          { icon: '🔄', title: 'CI/CD Pipelines', sub: 'Automating software delivery' },
        ],
        vision: "Empowering students to build scalable global infrastructure.",
        mission: ["Mastering cloud architectural patterns and tools."]
      }
    }
  },
};
