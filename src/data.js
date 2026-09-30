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

// Each project also has a detail page at /projects/<slug>.
// Details come from each project's README.
export const projects = [
  {
    slug: "job-portal",
    name: "Job Portal",
    image: "/jobportal.png",
    description:
      "Recruiters post jobs and review applicants; candidates search, filter and apply with a resume. JWT auth, role-based access, resumes stored in MongoDB GridFS.",
    summary:
      "A job board where recruiters post roles and manage applicants, and candidates search, apply and track their applications.",
    tags: ["React", "Node.js", "Express", "MongoDB"],
    github: "https://github.com/rashmitha-j/job-portal",
    demo: "https://job-portal-zeta-indol.vercel.app",
    overview: [
      "Job Portal connects two kinds of users. Recruiters set up a company profile, post jobs and move applicants through a hiring pipeline. Candidates browse and filter openings without an account, then build a profile, upload a PDF resume and apply in one click.",
      "It's built for small teams that want a simple, secure hiring flow, with every permission checked on the server rather than trusted from the browser.",
    ],
    features: [
      "Public job search with keyword search, filters for location, job type, work mode and experience, and pagination. Filters live in the URL, so results can be shared.",
      "Recruiter tools: a company profile, creating and editing jobs, and an applicants page per job with status filters and live counts.",
      "A hiring pipeline (Applied → Shortlisted → Interview → Selected, or Rejected at any open stage) with transitions enforced by the API.",
      "Candidate dashboard with profile completion, saved jobs and colour-coded application statuses.",
      "Private PDF resume upload up to 5 MB, and one application per job, enforced in the UI, the API and a unique database index.",
      "JWT authentication with bcrypt-hashed passwords and role-based route guards in both the API and the React app.",
    ],
    stack: ["React", "React Router", "Axios", "Node.js", "Express", "MongoDB", "Mongoose", "GridFS", "JWT", "bcrypt", "Multer"],
    challenges: [
      {
        title: "Keeping resumes private and persistent",
        detail:
          "Render's free tier loses files on every redeploy, and resumes shouldn't be public. I store them in MongoDB GridFS behind a pluggable storage driver (local disk in development) and serve them only through an authenticated endpoint: to the candidate, recruiters who received the application, or admins. Everyone else gets a 404, so file keys can't be probed. Uploads are checked by extension, MIME type and the file's actual PDF signature.",
      },
      {
        title: "Resumes that don't change after applying",
        detail:
          "Each application keeps a snapshot of the resume it was submitted with, so replacing a profile resume later doesn't change what recruiters already received. Old files are deleted only when nothing references them.",
      },
      {
        title: "Trusting the database, not the token",
        detail:
          "Every protected request reloads the user from MongoDB, so the role comes from the database rather than the client, and ownership checks make sure recruiters only ever see applicants for their own jobs.",
      },
    ],
  },
  {
    slug: "shopease",
    name: "ShopEase",
    image: "/shopease.png",
    description:
      "E-commerce store with search and filters, cart, Razorpay and cash-on-delivery checkout, stock reserved with MongoDB transactions, and an admin dashboard.",
    summary:
      "An online store with search and filters, a cart, Razorpay or cash-on-delivery checkout, and an admin dashboard.",
    tags: ["React", "Tailwind", "Node.js", "Express", "MongoDB", "Razorpay"],
    github: "https://github.com/rashmitha-j/shopease",
    demo: "https://shopease-three-mu.vercel.app",
    overview: [
      "ShopEase is a complete store for electronics, fashion, home, books, sports and beauty products. Shoppers search and filter the catalogue, keep a cart, check out with Razorpay or cash on delivery, and follow their orders. Admins manage products, orders and reviews from a dashboard.",
      "The focus is on getting money and stock right: prices always come from the database, stock is reserved safely, and every payment is verified on the server.",
    ],
    features: [
      "Product catalogue with search, category, brand, price and rating filters, an in-stock filter, sorting and pagination.",
      "A cart saved in the browser and synced across tabs, which re-checks prices and stock every time it opens.",
      "Checkout with Razorpay (signature-verified) or cash on delivery, with free shipping from ₹999.",
      "Order history and details. Unpaid online orders are cancelled after 30 minutes and their stock is released.",
      "Reviews limited to verified purchases, meaning customers with a delivered order for that product.",
      "Admin dashboard with store stats, product management, order status updates and review moderation.",
    ],
    stack: ["React", "Vite", "Tailwind CSS", "React Router", "Node.js", "Express", "MongoDB", "Mongoose", "Razorpay", "JWT"],
    challenges: [
      {
        title: "Two customers, one item left",
        detail:
          "Stock is reserved in a MongoDB transaction when an order is placed: either every item is reserved or none is, so two buyers can't both get the last unit. The API tests race two buyers for the last item against an in-memory replica set.",
      },
      {
        title: "Payments that arrive late or twice",
        detail:
          "If a customer pays and closes the tab, a signed Razorpay webhook still confirms the order. Its signature is checked against the raw request body with a timing-safe comparison. The browser's verification and the webhook share one code path, so whichever arrives first confirms the order and any duplicate does nothing.",
      },
      {
        title: "Secure sessions without third-party cookies",
        detail:
          "Short-lived access tokens live in memory and refresh tokens in an httpOnly cookie with rotation and reuse detection. Vercel forwards /api to Render so the cookie stays first-party, and parallel refreshes share a single request so rotation never logs a user out by mistake.",
      },
    ],
  },
  {
    slug: "learnhub",
    name: "LearnHub LMS",
    image: "/learnhub.png",
    description:
      "Instructors build courses with video lessons and quizzes; students enroll, track progress and take auto-graded quizzes. Role-based access for students, instructors and admins.",
    summary:
      "A learning platform where instructors build courses with video lessons and quizzes, and students enroll and track their progress.",
    tags: ["React", "Node.js", "Express", "MongoDB", "JWT"],
    github: "https://github.com/rashmitha-j/learnhub-lms",
    demo: "https://learnhub-lms-three.vercel.app",
    overview: [
      "LearnHub is a learning management system with three roles. Instructors create courses with sections, video lessons and quizzes, then publish them. Students browse the catalogue, enroll for free, learn lesson by lesson and take auto-graded quizzes. A small admin area oversees users and courses.",
      "Business rules such as progress and quiz scores are enforced on the backend and never trusted from the client.",
    ],
    features: [
      "Course catalogue with search, category and level filters, sorting and pagination.",
      "One-click enrollment and a learning page with an embedded YouTube or Vimeo player, a lesson sidebar and previous/next navigation.",
      "Progress tracking that resumes at the first unfinished lesson and records a completion date.",
      "Auto-graded multiple-choice quizzes with pass/fail, full answer review, attempt history and retakes.",
      "Instructor course builder for sections, lessons and quizzes, with reordering and publish/unpublish.",
      "Role-based dashboards for students, instructors and admins.",
    ],
    stack: ["React", "React Router", "Axios", "Node.js", "Express", "MongoDB", "Mongoose", "JWT", "express-validator", "Supertest"],
    challenges: [
      {
        title: "Progress the client can't fake",
        detail:
          "Progress is calculated on the server from completed lessons using an idempotent $addToSet, and any progress value sent by the client is ignored. Adding or deleting lessons recalculates every enrollment, so percentages stay correct as courses change.",
      },
      {
        title: "Quizzes that don't leak answers",
        detail:
          "Correct answers are never sent to students before they submit. The server scores each attempt and stores a snapshot of the questions, so past results stay accurate even if the instructor edits the quiz later.",
      },
      {
        title: "One set of access rules",
        detail:
          "Ownership checks live in a shared access service that every controller uses, and each request reloads the user's role from the database. 77 integration tests (node:test and Supertest) cover roles, ownership, progress and quiz scoring.",
      },
    ],
  },
];

export const about = {
  paragraphs: [
    "Hello! I'm a third-year Information Science Engineering student at Don Bosco Institute of Technology, Bengaluru, with a strong background in MERN stack development and a deep understanding of DSA in C++. My problem-solving skills enable me to write efficient, optimized code for complex challenges.",
    "I've solved 300+ questions on platforms like LeetCode and consistently participate in weekly contests to sharpen my skills further. Right now, I'm immersed in MERN stack projects, contributing to every stage of the development lifecycle — from planning to deployment.",
  ],
  facts: [
    { label: "Experience", value: "SIH Participant 2026", detail: "Frontend Developer" },
    { label: "Education", value: "B.E. Information Science & Engineering", detail: "2024 – 2028 · DBIT" },
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
