// Edit this file to update the portfolio's content.

export const profile = {
  name: "Rashmitha J",
  initials: "RJ",
  tagline: "Full-stack MERN developer building scalable web applications",
  photo: "/me.jpg",
  resume: "/Rashmitha_J_Resume.pdf",
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
    slug: "nexora-ai",
    name: "Nexora AI",
    image: "/nexora.jpg",
    description:
      "AI assistant that answers questions about your own documents with cited sources. Streaming Gemini chat, RAG on PostgreSQL + pgvector, and automatic fallback across models when free quotas run out.",
    summary:
      "An AI assistant that answers questions about your own documents with cited sources, built to stay up on free-tier quotas.",
    tags: ["Python", "Chainlit", "Gemini", "pgvector", "RAG"],
    github: "https://github.com/rashmitha-j/Nexora-AI",
    demo: "https://nexora-ai-jcdz.onrender.com",
    overview: [
      "Nexora AI is a production-deployed generative-AI web app. You upload a PDF, TXT, Markdown, CSV or JSON file and ask about it, and answers stream in token by token, grounded in the most relevant passages and citing them as [1], [2].",
      "Generic chatbots can't answer from your own files, and a public AI app has to survive free-tier quotas and abuse. Nexora handles both, and it runs for ₹0 a month on Render and Neon.",
    ],
    features: [
      "Document Q&A with citations: files are chunked, embedded with Gemini and searched in pgvector with an HNSW index.",
      "Streaming chat from Google Gemini, behind a provider layer that also supports Claude, OpenAI and local Ollama models.",
      "Automatic fallback across six Gemini models when one hits its daily quota or is overloaded.",
      "Private by design: documents are isolated per user or per anonymous chat, and anonymous uploads are deleted after 24 hours.",
      "Optional sign-in with PBKDF2 password hashing, login throttling and saved chat history in PostgreSQL.",
      "A /build command that hands an idea to a MetaGPT multi-agent team running in a sandboxed FastAPI worker.",
    ],
    stack: ["Python", "Chainlit", "Google Gemini", "PostgreSQL", "pgvector", "Neon", "asyncpg", "MetaGPT", "FastAPI", "pytest", "GitHub Actions", "Render"],
    challenges: [
      {
        title: "A blank page in production",
        detail:
          "Chainlit quietly switches on its own database layer when DATABASE_URL exists, and it needed tables it never creates, so the live site returned HTTP 500. I wrote a custom data layer that creates its schema safely, works with Neon's connection pooler and keeps chat working even if the database is down.",
      },
      {
        title: "Staying up when the free quota runs out",
        detail:
          "Each Gemini model has its own daily quota, and fallbacks could be overloaded too. The provider layer skips models whose quota is used up until their reset time, moves straight past overloaded ones, and only retries errors that are truly temporary, before any text has streamed.",
      },
      {
        title: "Making a public AI endpoint hard to abuse",
        detail:
          "A free-text model field let anyone pick a costlier model, and rate limits reset with every new chat. Now the server enforces a model allow-list, per-IP and site-wide rate limits, size limits and one request at a time per chat. Retrieved text is wrapped as untrusted data to blunt prompt injection.",
      },
      {
        title: "PDFs that only failed in production",
        detail:
          "Some extracted PDF text contained NUL characters, which PostgreSQL rejects. I reproduced it locally against a real Postgres, cleaned control characters during extraction and added tests. 57 automated tests run in CI with the LLM providers mocked, so no API keys are needed.",
      },
    ],
  },
  {
    slug: "documind-ai",
    name: "DocuMind AI",
    image: "/documind.png",
    description:
      "Private PDF question answering with RAG. Upload PDFs to your own library, pick which to search, and get Gemini answers with the document, page number and exact supporting passage for every source.",
    summary:
      "A private PDF library where you ask questions and every answer shows the document, page and passage it came from.",
    tags: ["Next.js", "TypeScript", "FastAPI", "PostgreSQL", "Gemini"],
    github: "https://github.com/rashmitha-j/DocuMind-AI",
    demo: "https://docu-mind-ai-delta.vercel.app/",
    overview: [
      "DocuMind AI is a private PDF question-answering app. You sign in, upload PDFs to your own document library, choose which documents to search, and ask questions. Google Gemini answers using only passages retrieved from those documents.",
      "Every answer lists its sources with the filename, page number and the exact supporting passage, so you can check it. The Next.js frontend runs on Vercel and the FastAPI backend on Render, all on free tiers.",
    ],
    features: [
      "Accounts with Argon2id password hashing and bearer-token sessions that expire after 24 hours.",
      "A document library: upload up to 5 PDFs at once, see status, pages and size, open the original, retry failed processing and delete.",
      "Questions across one or several selected documents, with retrieval limited to exactly those documents.",
      "Labelled citations ([S1], [S2]) with filename, page number and supporting excerpt under each answer.",
      "Persistent indexes in PostgreSQL that survive restarts; re-uploading the same file reuses its index instead of embedding again.",
      "Strict upload validation (type, %PDF- signature, size, pages, encryption, extractable text) and per-action rate limits.",
    ],
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Python", "FastAPI", "SQLAlchemy", "PostgreSQL", "LlamaIndex", "Google Gemini", "pytest"],
    challenges: [
      {
        title: "Quotas that parallel uploads can't beat",
        detail:
          "Each account has document and storage limits. A cheap check rejects over-quota files before any parsing or embedding, and the authoritative check runs inside the insert transaction under a per-user lock and SELECT ... FOR UPDATE. A test fires 6 parallel uploads at a limit of 2, and exactly 2 succeed.",
      },
      {
        title: "Gemini calls that can't hang",
        detail:
          "The SDK's timeout only limits the gap between received bytes, so a slowly trickling response could run for minutes. I added wall-clock deadlines to every embedding and answer call, with one retry on a fallback model when the main one is overloaded, so a question always finishes within the frontend's wait.",
      },
      {
        title: "Rate limiting the real client IP",
        detail:
          "Behind Render's proxies, the left side of X-Forwarded-For is whatever the client sends. I measured the real proxy chain on the live service and take the right entry by hop count, with tests for missing, malformed and forged headers.",
      },
      {
        title: "Keeping every user's documents private",
        detail:
          "Every document, file, chunk and chat query is filtered by the signed-in user's ID on the backend, and another user's document returns the same 404 as a missing one. 80 offline tests with fake embeddings cover isolation, citations, validation and failure handling.",
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
