// Edit this file to update the portfolio's content.

export const profile = {
  name: "Rashmitha J",
  initials: "RJ",
  tagline: "Full-stack MERN developer building scalable web applications",
  photo: "/me.jpg",
};

export const contact = {
  email: "rashmithajagadish1@gmail.com",
  phone: "+91 9066747351",
  phoneHref: "tel:+919066747351",
  links: [
    { label: "LinkedIn", url: "https://www.linkedin.com/in/rashmitha-j-987765332" },
    { label: "GitHub", url: "https://github.com/rashmitha-j" },
    { label: "LeetCode", url: "https://leetcode.com/u/codewith_14/" },
    { label: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/profile/rashmithajtkzn" },
  ],
};

export const projects = [
  {
    name: "Job Portal",
    image: "/jobportal.png",
    description:
      "Recruiters post jobs and review applicants; candidates search, filter and apply with a resume. JWT auth, role-based access, resumes stored in MongoDB GridFS.",
    tags: ["React", "Node.js", "Express", "MongoDB"],
    github: "https://github.com/rashmitha-j/job-portal",
    demo: "https://job-portal-zeta-indol.vercel.app",
  },
  {
    name: "ShopEase",
    image: "/shopease.png",
    description:
      "E-commerce store with search and filters, cart, Razorpay and cash-on-delivery checkout, stock reserved with MongoDB transactions, and an admin dashboard.",
    tags: ["React", "Tailwind", "Node.js", "Express", "MongoDB", "Razorpay"],
    github: "https://github.com/rashmitha-j/shopease",
    demo: "https://shopease-three-mu.vercel.app",
  },
  {
    name: "LearnHub LMS",
    image: "/learnhub.png",
    description:
      "Instructors build courses with video lessons and quizzes; students enroll, track progress and take auto-graded quizzes. Role-based access for students, instructors and admins.",
    tags: ["React", "Node.js", "Express", "MongoDB", "JWT"],
    github: "https://github.com/rashmitha-j/learnhub-lms",
    demo: "https://learnhub-lms-three.vercel.app",
  },
];

export const about = {
  paragraphs: [
    "Hello! I'm a third-year Information Science Engineering student at Don Bosco Institute of Technology, Bengaluru, with a strong background in MERN stack development and a deep understanding of DSA in C++. My problem-solving skills enable me to write efficient, optimized code for complex challenges.",
    "I've solved 300+ questions on platforms like LeetCode and consistently participate in weekly contests to sharpen my skills further. Right now, I'm immersed in MERN stack projects, contributing to every stage of the development lifecycle — from planning to deployment.",
  ],
  facts: [
    { label: "Experience", value: "SIH Participant 2026", detail: "Frontend Developer" },
    { label: "Education", value: "B.Tech ISE", detail: "2024 – 2028 · DBIT" },
  ],
};

export const skills = [
  { group: "Frameworks", items: ["ReactJS", "Node.js", "Express.js", "Tailwind CSS"] },
  { group: "Languages", items: ["C++", "JavaScript", "Java", "HTML/CSS", "SQL"] },
  { group: "Databases", items: ["MongoDB", "MySQL"] },
  { group: "Others", items: ["DSA", "OOPS", "DBMS", "OS", "CN", "Git & GitHub"] },
];

export const achievements = [
  { stat: "300+", title: "LeetCode problems", detail: "Solved 300+ questions on LeetCode, with regular weekly contests." },
  { stat: "SIH 2026", title: "Smart India Hackathon", detail: "Selected as an SIH 2026 participant — Frontend Developer." },
  { stat: "GSSoC 2026", title: "Open source", detail: "Active contributor in the GSSoC 2026 open-source program." },
];

export const nav = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];
