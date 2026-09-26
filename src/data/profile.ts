export const profile = {
  name: "Andi Muh Haikal Lukman",
  shortName: "DCCAL",
  role: "Full Stack Developer",
  tagline:
    "A dedicated Full Stack Developer with expertise in building responsive and user-friendly web applications using modern technologies across the entire development stack.",
  location: "Makassar, South Sulawesi, Indonesia",
  timezone: "Asia/Makassar",
  availability: "Open to opportunities",
  email: "andimuhhaikal79@gmail.com",
  phone: "082194718899",
  cv: "/CV_Andi_Muh_Haikal_Lukman.pdf",
  linkedin: "https://www.linkedin.com/in/andimuhhaikal",
  socials: [
    { label: "GitHub", url: "https://github.com/itsdccal", handle: "@itsdccal" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/andimuhhaikal", handle: "in/andimuhhaikal" },
  ],
  introQuotes: [
    "Clean architecture, practical solutions.",
    "Backend first, user always.",
    "Learn. Build. Inspire.",
    "Code with purpose.",
  ],
  about: [
    "I'm Haikal, a passionate Full Stack Developer based in Makassar. I specialize in building responsive and user-friendly web applications, blending modern frontend technologies with robust backend systems to deliver innovative solutions.",
    "I have a strong background in PHP, Java, Python, and JavaScript, along with a deep understanding of data structures, algorithms, and software design.",
    "Over the years, I've worked on diverse projects — from web applications and e-commerce sites to system integration — collaborating with people across technology, education, and government sectors.",
  ],
  principles: [
    "CLEAN ARCHITECTURE",
    "CONTINUOUS LEARNING",
    "BACKEND FIRST THINKING",
    "PRACTICAL SOLUTIONS",
    "COLLABORATIVE GROWTH",
    "CODE WITH PURPOSE",
  ],
  stack: [
    {
      id: "01",
      title: "Languages",
      items: ["PHP", "Java", "Python", "JavaScript", "TypeScript", "HTML5", "CSS3"],
    },
    {
      id: "02",
      title: "Frameworks & Libraries",
      items: ["Laravel", "Flask", "React", "Next.js", "Tailwind CSS", "Bootstrap", "Node.js"],
    },
    {
      id: "03",
      title: "Databases",
      items: ["MySQL", "PostgreSQL", "MongoDB"],
    },
    {
      id: "04",
      title: "Tools & Others",
      items: ["Git", "GitHub", "REST API", "Figma", "UX Design", "VS Code"],
    },
  ],
  // Shown in the skill matrix provenance strip on hover.
  skillProvenance: {
    "Next.js": ["MetrikGo", "Sekelas"],
    TypeScript: ["MetrikGo", "Sekelas"],
    Prisma: ["MetrikGo"],
    SQLite: ["MetrikGo"],
    React: ["Lab Management System"],
    Vite: ["Lab Management System"],
    Flask: ["Lab Management System"],
    MySQL: ["Lab Management System"],
    JWT: ["Lab Management System"],
    Zustand: ["Lab Management System"],
    Laravel: ["International Class"],
    "Tailwind CSS": ["MetrikGo", "Sekelas", "International Class"],
    "Alpine.js": ["International Class"],
    PHP: ["International Class"],
    "Node.js": ["Lab Management System"],
  } as Record<string, string[]>,
  projects: [
    {
      id: "01",
      category: "Web Application · HR / Recruitment",
      year: "2026",
      title: "SCM Recruitment",
      tagline: "Integrated recruitment management system with AI integration",
      description:
        "Recruitment management system built for PT Sulawesi Cahaya Mineral — an integrated platform for running the hiring process end-to-end, enhanced with AI integration to support recruitment decisions.",
      highlights: [
        "End-to-end integrated recruitment workflow",
        "AI integration for the recruitment process",
        "Built for PT Sulawesi Cahaya Mineral",
      ],
      tags: ["HRIS", "Recruitment", "AI Integration"],
      architecture: [
        { step: "Presentation", detail: "Login-gated dashboard interface for HR and recruitment staff." },
        { step: "Application", detail: "Recruitment workflow orchestration from job posting to selection." },
        { step: "Intelligence", detail: "AI-assisted capabilities supporting the recruitment process." },
      ],
      image: "/images/projects/hr.jpg",
      github: null,
      demo: null,
    },
    {
      id: "02",
      category: "Web Application · POS",
      year: "2026",
      title: "MetrikGo",
      tagline: "Point-of-sale & business operations platform",
      description:
        "Full-featured POS system covering the whole sales cycle — products, customers, pricing, cash & debt ledgers (kas/kasbon), down payments, returns, warranties, and reports — with QR scanning and an integrated print server.",
      highlights: [
        "End-to-end sales flow: DP, retur, garansi, kasbon",
        "QR scanning + integrated print server",
        "Full audit log on every transaction",
      ],
      tags: ["Next.js", "TypeScript", "Prisma", "SQLite", "Tailwind CSS"],
      architecture: [
        { step: "Presentation", detail: "Next.js App Router UI (Tailwind) — POS screens for the full sales cycle." },
        { step: "Application", detail: "Server actions & route handlers orchestrating DP, retur, garansi, and kasbon flows." },
        { step: "Data", detail: "Prisma ORM over SQLite; every transaction persisted with a full audit log." },
        { step: "Integration", detail: "QR scanning input and an integrated print server for receipts." },
      ],
      image: "/images/projects/metrik-go.jpg",
      github: "https://github.com/itsdccal/MetrikGo",
      demo: null,
    },
    {
      id: "03",
      category: "Web Application · LMS",
      year: "2025",
      title: "Lab Management System",
      tagline: "SILAB — Laboratory Information System for practicum",
      description:
        "Comprehensive laboratory operations platform: user management, classes, practicum sessions, QR-code attendance, multi-component grading, and final-score breakdown. React SPA frontend backed by a Flask REST API with JWT auth.",
      highlights: [
        "QR-code attendance for practicum sessions",
        "Multi-component grading & final-score breakdown",
        "Role-based access: Admin, Lecturer, Assistant, Student",
      ],
      tags: ["React", "Vite", "Flask", "MySQL", "JWT", "Zustand"],
      architecture: [
        { step: "Presentation", detail: "React SPA (Vite + Zustand) with role-based views: Admin, Lecturer, Assistant, Student." },
        { step: "API", detail: "Flask REST API with JWT authentication guarding every endpoint." },
        { step: "Business Logic", detail: "Grading engine: multi-component assessments computed into a final-score breakdown." },
        { step: "Data", detail: "MySQL schema for users, classes, and sessions; QR-code attendance flow." },
      ],
      image: "/images/projects/silab.jpg",
      github: "https://github.com/itsdccal/lab-management-system",
      demo: null,
    },
    {
      id: "04",
      category: "Web Platform",
      year: "2025",
      title: "Sekelas",
      tagline: "Online learning platform — landing page & web app",
      description:
        "A modern learning platform built with Next.js — from a self-contained static landing page to a full web application, focused on clean presentation, responsiveness, and fast page loads.",
      highlights: [
        "Landing page + full app architecture",
        "Mobile-first responsive design",
        "Optimized with Next.js App Router",
      ],
      tags: ["Next.js", "TypeScript", "Tailwind CSS"],
      architecture: [
        { step: "Presentation", detail: "Self-contained static landing page with zero client-side weight." },
        { step: "Application", detail: "Next.js App Router structure for the full learning platform." },
        { step: "Performance", detail: "Mobile-first responsive layout with optimized page loads." },
      ],
      image: "/images/projects/sekelas.jpg",
      github: "https://github.com/itsdccal/sekelas",
      demo: "https://sekelas-green.vercel.app",
    },
    {
      id: "05",
      category: "Web Platform · University",
      year: "2024",
      title: "International Class",
      tagline: "Program website for International Class Universitas Hasanuddin",
      description:
        "Official-style program website showcasing International Exposure activities, degree & IUP programs, news, and events — built with Laravel, Blade, Tailwind CSS, and Alpine.js with a DaisyUI component layer.",
      highlights: [
        "Degree & IUP program showcases",
        "News and event pages",
        "Laravel + Blade + Tailwind + Alpine stack",
      ],
      tags: ["Laravel", "PHP", "Tailwind CSS", "Alpine.js", "DaisyUI"],
      architecture: [
        { step: "Presentation", detail: "Blade + Tailwind/DaisyUI views with Alpine.js interactions." },
        { step: "Application", detail: "Laravel controllers and routing for program, news, and event pages." },
        { step: "Content", detail: "Structured content model for degree & IUP program showcases." },
      ],
      image: "/images/projects/international-class.jpg",
      github: "https://github.com/itsdccal/InternationalClass",
      demo: null,
    },
  ],
  // Secondary projects — fill in to activate the archive section.
  archive: [] as {
    id: string;
    title: string;
    category: string;
    year: string;
    description: string;
    tags: string[];
    github: string | null;
  }[],
  roadmap: [
    {
      id: "01",
      year: "2022",
      shortYear: "22",
      title: "The Beginning",
      description:
        "Started my Bachelor of Computer Science at Universitas Hasanuddin. Learned programming fundamentals, data structures, and object-oriented programming with Java.",
      tags: ["Java", "OOP"],
    },
    {
      id: "02",
      year: "2023",
      shortYear: "23",
      title: "Web Development Journey",
      description:
        "Dove into web development through Dicoding certifications — learning HTML, CSS, JavaScript, and Git. Built my first static and dynamic websites.",
      tags: ["HTML", "CSS", "JavaScript", "Git"],
    },
    {
      id: "03",
      year: "2024",
      shortYear: "24",
      title: "Teaching & Deepening Skills",
      description:
        "Became a Laboratory Assistant for Web Programming at Universitas Hasanuddin, mentoring students during practicum sessions while sharpening my own frontend and backend skills.",
      tags: ["PHP", "Laravel", "MySQL"],
    },
    {
      id: "04",
      year: "2025",
      shortYear: "25",
      title: "Coding Camp & Leadership",
      description:
        "Joined Coding Camp powered by DBS Foundation — an intensive program on software development best practices. Also served as OOP Lab Assistant and cohort coordinator managing 40+ assistants.",
      tags: ["JavaScript", "Node.js", "React"],
    },
    {
      id: "05",
      year: "2026",
      shortYear: "26",
      title: "Towards Graduation",
      description:
        "Continuing as Laboratory Assistant for Object-Oriented Programming and Web Programming while finishing my final year — building projects with modern stacks like Next.js and PostgreSQL.",
      tags: ["Next.js", "TypeScript", "PostgreSQL"],
    },
  ],
  trajectory: ["FUNDAMENTALS", "WEB DEV", "FULL STACK", "LEADERSHIP", "GRADUATION"],
  certifications: [
    { title: "Belajar Dasar Pemrograman Web", issuer: "Dicoding Indonesia" },
    { title: "Belajar Dasar Pemrograman JavaScript", issuer: "Dicoding Indonesia" },
    { title: "Belajar Membuat Front-End Web untuk Pemula", issuer: "Dicoding Indonesia" },
    { title: "Belajar Dasar Git dengan GitHub", issuer: "Dicoding Indonesia" },
    { title: "Belajar Pengembangan Web Intermediate", issuer: "Dicoding Indonesia" },
  ],
  faq: [
    {
      question: "Are you open for internship or full-time opportunities?",
      answer:
        "Yes — I'm open to internships, freelance projects, and full-time roles. Reach out via email or LinkedIn and I'll get back to you within a day.",
    },
    {
      question: "What stack do you work with most?",
      answer:
        "Mostly TypeScript: Next.js and React on the frontend, Laravel or Flask on the backend, and MySQL/PostgreSQL/SQLite for data — but I pick the tool that fits the problem.",
    },
    {
      question: "Can I see your code?",
      answer:
        "Almost everything I build is public on GitHub (github.com/itsdccal), including the repository for this portfolio.",
    },
  ],
};
