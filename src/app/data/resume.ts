/**
 * Single source of truth for portfolio content, derived from
 * Aditya Pathak's resume.
 */

export interface SocialLinks {
  email: string;
  linkedin: string;
  github: string;
  resume: string;
  location: string;
}

export interface Role {
  company: string;
  /** company website; the company label renders as a link when present */
  url?: string;
  title: string;
  location: string;
  period: string;
  from: string;
  to: string;
  scope: string;        // git-log style subject line
  stack: string[];
  points: string[];
}

export interface Project {
  id: string;
  name: string;
  kind: string;
  blurb: string;
  points: string[];
  tags: string[];
  featured?: boolean;
}

export type SkillKind =
  | 'method' | 'class' | 'field' | 'variable' | 'interface' | 'event' | 'snippet';

export interface Skill { name: string; meta: string; note: string; }
/** `short` is the compact label used by the skills chips and the SQL console. */
export interface SkillGroup { group: string; short: string; kind: SkillKind; items: Skill[]; }

/** A milestone worth verifying — an award, a rank, a named contribution. */
export interface Achievement {
  title: string;
  org: string;
  when: string;
  /** optional external proof; the row renders as plain text when omitted */
  link?: string;
}

export const LINKS: SocialLinks = {
  email: 'adityapathak63635@gmail.com',
  linkedin: 'https://www.linkedin.com/in/adityapathak-nitrr/',
  github: 'https://github.com/paditya99',
  resume: 'media/Aditya_Pathak_Resume.pdf',
  location: 'Delhi NCR, India',
};

export interface Profile {
  name: string;
  role: string;
  locationShort: string;
  timezone: string;
  /** used in the contact terminal ("open to …") */
  availability: string;
  /** where I'll work from — shown in the contact terminal */
  workMode: string;
  /** how I work with others — shown in the contact terminal */
  collaboration: string;
  /** the `pitch` command in the contact terminal — evidence, not adjectives */
  pitch: string[];
  /** used in the hero code comment ("available for …") */
  availabilityComment: string;
  /** the small link caption under the hero photo */
  ctaCaption: string;
  /** rotating phrases for the hero typewriter */
  typewriter: string[];
}

/** Single source of truth for identity/availability copy reused across sections. */
export const PROFILE: Profile = {
  name: 'Aditya Pathak',
  role: 'Software Engineer',
  locationShort: 'Delhi NCR, IN',
  timezone: 'UTC+5:30',
  availability: 'open to backend and applied-AI roles — Node.js, NestJS, and LLM systems',
  workMode: 'happy on-site, hybrid or remote — whatever the team runs on',
  collaboration: 'work across front-end, QA, DevOps and design — clear updates, no surprises',
  /* One string per paragraph, never per line — the terminal reflows these to
     whatever width it has. Hard-wrapping here produced orphaned words. */
  pitch: [
    'Right now I build the backend of a mortgage lending and brokerage platform — REST APIs across its loan origination and back-office services, in NestJS and TypeScript inside a large multi-tenant monorepo. In practice that is endpoints, DTO validation, guards and authorisation, transactions and audit logging, over PostgreSQL, MongoDB, Redis and RabbitMQ. I integrate platform flows end to end, fix production defects raised through Jira, and bring latency down on APIs that have gone slow.',
    '',
    'On the same platform I work the applied-AI side: guideline extraction on AWS Bedrock with schema-forced tool calls, and a RAG assistant where I worked on retrieval quality, prompt caching and streamed answers that cite their source.',
    '',
    'Before this, two years in Java and Spring Boot on a bank loan disbursement platform — owning severity-1 defects under SLA and closing SQL injection and XSS findings before release. That is where I learned what production actually costs when it goes wrong.',
    '',
    'So you would be hiring someone who ships features, keeps production standing, and can follow a request from the endpoint through to a model call without handing it off. That is why you should hire me.',
  ],
  availabilityComment: 'backend, full-stack and applied AI, in production',
  ctaCaption: "let's build something",
  typewriter: [
    'Full Stack Software Engineer',
    'Node.js · NestJS · TypeScript',
    'AWS Bedrock · RAG · LLM tooling',
    'I connect systems',
    'Love to dive in backend'
  ],
};

export const SUMMARY =
  'Software Engineer with 2.5+ years building backend services in Node.js, NestJS, Java ' +
  'and Spring Boot inside large microservice systems. Day to day I ship features and REST ' +
  'APIs across a mortgage lending and brokerage platform — extending existing services, ' +
  'integrating new flows, fixing production bugs and bringing latency down — and I also ' +
  'work on the applied-AI side of it, on Bedrock-backed extraction and retrieval.';

export const STATS = [
  { value: '2.5+', label: 'years shipping backend', hint: 'Node.js & Java, since Jan 2024' },
  { value: '2', label: 'LLM systems in production', hint: 'extraction pipeline + RAG assistant' },
  { value: '30+', label: 'lenders supported', hint: 'guideline coverage' },
  { value: '350+', label: 'DSA problems solved', hint: 'across platforms' },
];

export const ROLES: Role[] = [
  {
    company: 'Wizni (ARIVE)',
    url: 'https://www.arive.com/',
    title: 'Software Engineer',
    location: 'India',
    period: 'Dec 2025 — Present',
    from: '2025-12',
    to: '2026-08',
    scope: 'feat(los): ship backend features across the lending platform — APIs, integrations, AI',
    stack: ['NestJS', 'TypeScript', 'PostgreSQL', 'MongoDB', 'RabbitMQ', 'Redis', 'AWS Bedrock'],
    points: [
      'Build and extend REST APIs across the loan origination and back-office services of a mortgage lending and brokerage platform — NestJS/TypeScript microservices in a large multi-tenant monorepo.',
      'Deliver features end to end: new endpoints, DTO validation, guards and authorisation, transactions and audit logging, over PostgreSQL, MongoDB and Redis.',
      'Integrate platform flows — document management and generation, e-signature, third-party data orders and back-office administration — against shared internal libraries.',
      'Fix production defects raised through Jira, optimise slow APIs to bring latency down, and move inter-service work onto asynchronous messaging.',
      'Contributed to the Product Pricing Engine behind automated loan eligibility and pricing.',
      'Shipped guideline extraction on AWS Bedrock (Claude): lender PDFs become structured underwriting rules through schema-forced tool calls, covering 30+ lenders.',
      'Worked across the RAG guideline assistant — retrieval scoping and quality, prompt caching, intent routing and streamed answers that cite their source.',
    ],
  },
  {
    company: 'Intellect Design Arena',
    url: 'https://www.intellectdesign.com/',
    title: 'Software Developer',
    location: 'India',
    period: 'Jan 2024 — Dec 2025',
    from: '2024-01',
    to: '2025-12',
    scope: 'feat(uob): build the loan disbursement platform, then harden it for production',
    stack: ['Java', 'Spring Boot', 'Hibernate/JPA', 'React', 'Node.js', 'Burp Suite'],
    points: [
      'Built the Loan Disbursement System for United Overseas Bank (Singapore) — Java/Spring Boot microservices with REST APIs and Hibernate/JPA persistence.',
      'Developed MERN modules for the Trade AI platform, wiring React front-ends to Node/Express services.',
      'Owned Severity 1 and 2 production defects for UOB — root cause and fix inside SLA, tracked in Jira.',
      'Closed VAPT and DAST findings (Burp Suite, Veracode, SONAR), including SQL injection and XSS.',
      'Ran releases through SIT, UAT and production, with the documentation that goes with it.',
    ],
  },
];

export const PROJECTS: Project[] = [
  {
    id: 'los-ppe',
    name: 'Loan Origination & Pricing Backend',
    kind: 'Microservices · NestJS · TypeScript',
    blurb:
      'The transactional core of a mortgage lending and brokerage platform — the ' +
      'system of record behind point of sale, underwriting and closing, plus the ' +
      'pricing engine that decides eligibility. Most of my day sits here.',
    points: [
      'REST APIs and feature work across loan origination and back-office services, in a multi-tenant Nx monorepo over PostgreSQL, MongoDB and Redis.',
      'Platform flows integrated end to end — document management and generation, e-signature, third-party data orders and milestone tracking.',
      'Auth and role/ACL guards, DTO validation at the boundary, explicit transactions, pagination and audit logging as cross-cutting concerns.',
      'Production bug fixes from Jira, API latency work, asynchronous inter-service messaging, and unit tests alongside the features.',
    ],
    tags: ['NestJS', 'PostgreSQL', 'MongoDB', 'RabbitMQ', 'Redis', 'Sequelize'],
    featured: true,
  },
  {
    id: 'guideline-ai',
    name: 'AI Guideline Extraction Pipeline',
    kind: 'AWS Bedrock · in production',
    blurb:
      'Lender guideline documents run hundreds of pages and no two are written alike. ' +
      'This pipeline reads them with an LLM and emits one uniform, machine-executable ' +
      'rule set — the same shape every time, for every lender.',
    points: [
      'AWS Bedrock (Claude) extraction where the model must answer through a schema-forced tool call, so the output shape cannot drift between documents.',
      'RAG retrieval alongside direct document parsing, with each guide pre-sliced into per-field units that fit inside model input limits.',
      'A content-hash gate skips unchanged documents entirely — a re-run costs nothing for guides nobody touched.',
      'Deterministic validation against a fixed vocabulary, plus a rule-code ledger that keeps rule identities stable across re-extractions, so human review only ever sees real changes.',
    ],
    tags: ['AWS Bedrock', 'Claude', 'RAG', 'Tool use', 'TypeScript'],
    featured: true,
  },
  {
    id: 'guideline-assistant',
    name: 'RAG Guideline Assistant',
    kind: 'NestJS · streaming RAG service',
    blurb:
      'A team-built chat assistant that answers mortgage guideline questions for loan ' +
      'officers and shows its work — every claim links back to the page it came from. ' +
      'I worked on the service around it and on making its answers better.',
    points: [
      'Contributed to retrieval quality — scoping results by lender and program, and tuning what actually reaches the model.',
      'Worked on intent routing and prompt caching so the right path is taken per question and repeat context is not paid for twice.',
      'Backend service work: streamed responses over long-lived connections, conversation and feedback persistence, and per-model token and latency logging.',
    ],
    tags: ['NestJS', 'AWS Bedrock', 'RAG', 'Vector search', 'Streaming'],
  },
  {
    id: 'admin-console',
    name: 'Back-office Administration APIs',
    kind: 'Internal tooling · NestJS',
    blurb:
      'The service behind the operations console — the tooling support teams use to ' +
      'administer tenants, inspect what happened, and fix things without a deploy.',
    points: [
      'User and organisation administration, partner-portal management, reporting and billing support, exposed as a separate service from the customer-facing core.',
      'Audit and interaction-log inspection surfaces, including review of AI assistant conversations for quality and cost.',
      'Route-level authorisation drawn from a shared ACL layer, MongoDB aggregation for reporting reads, and inter-service clients into the core domain API.',
    ],
    tags: ['NestJS', 'MongoDB', 'Mongoose', 'RBAC', 'Reporting'],
  },
  {
    id: 'uob-disbursement',
    name: 'Loan Disbursement System',
    kind: 'Java · Spring Boot · banking',
    blurb:
      'A disbursement platform for United Overseas Bank (Singapore), built and then ' +
      'kept alive through production severity-1 traffic.',
    points: [
      'Spring Boot microservices with REST APIs and Hibernate/JPA persistence.',
      'Security hardening against SQL injection and XSS, verified by VAPT, DAST and SONAR scans.',
    ],
    tags: ['Java', 'Spring Boot', 'Hibernate/JPA', 'Security'],
  },
  {
    id: 'ecocart',
    name: 'EcoCart — E-commerce Platform',
    kind: 'MERN · academic project',
    blurb:
      'A full storefront built end to end: registration and login, catalogue with ' +
      'category and price filters, cart, and checkout.',
    points: [
      'MongoDB, Express, React and Node.js, built as one scalable, dynamic application.',
      'Fully responsive UI, tuned to read well from desktop down to mobile.',
    ],
    tags: ['MongoDB', 'Express', 'React', 'Node.js'],
  },
];

export const SKILLS: SkillGroup[] = [
  {
    group: 'Backend & APIs',
    short: 'Backend',
    kind: 'class',
    items: [
      { name: 'Node.js', meta: 'primary', note: 'The runtime behind every service I build and maintain.' },
      { name: 'NestJS', meta: 'daily', note: 'Modules, providers, guards, interceptors, DTO validation and streaming controllers across a microservice monorepo.' },
      { name: 'TypeScript', meta: 'default', note: 'Typed end to end — the contract is the type, not the comment.' },
      { name: 'RestApis', meta: 'design', note: 'Designing, extending and optimising APIs consumed across service boundaries.' },
      { name: 'Microservices', meta: 'architecture', note: 'Service boundaries, shared library layers and asynchronous contracts in a large multi-tenant system.' },
      { name: 'Streaming', meta: 'long-lived', note: 'Token-by-token responses over long-lived HTTP, with keep-alive and cancellation on client disconnect.' },
      { name: 'AuthZ', meta: 'JWT · RBAC', note: 'JWT auth with role, ACL and resource-access guards, and tenant scoping applied at the data-access layer.' },
      { name: 'Transactions', meta: 'consistency', note: 'Explicit transactions and distributed locks where two workers must not both act.' },
      { name: 'SpringBoot', meta: 'Java', note: 'Backend microservices and REST APIs for a bank loan disbursement platform.' },
      { name: 'Hibernate.JPA', meta: 'ORM', note: 'Relational data access and CRUD for Java services.' },
      { name: 'Sequelize', meta: 'ORM', note: 'Typed models, migrations and queries against PostgreSQL from Node.' },
      { name: 'OpenAPI', meta: 'contracts', note: 'Documented request/response contracts so consumers are not guessing.' },
    ],
  },
  {
    group: 'Applied AI & LLM Engineering',
    short: 'AI/LLM',
    kind: 'field',
    items: [
      { name: 'Aws.Bedrock', meta: 'production', note: 'The model layer behind the extraction pipeline and the retrieval assistant on our platform.' },
      { name: 'RAG', meta: 'hands-on', note: 'Retrieval, filtering and grounded answers — worked across the pipeline rather than owning all of it.' },
      { name: 'VectorSearch', meta: 'worked with', note: 'Metadata-scoped retrieval over a vector knowledge base; tuned scoping and filters.' },
      { name: 'Reranking', meta: 'contributed', note: 'Tuned what reaches the model after retrieval, so the useful passages win over the merely similar.' },
      { name: 'ToolUse', meta: 'schema-forced', note: 'Making the model answer through a JSON tool schema so the output shape never drifts.' },
      { name: 'Citations', meta: 'traceability', note: 'Answers mapped back to the passage they came from, so a claim can be checked.' },
      { name: 'Guardrails', meta: 'integrated', note: 'Input screening wired in ahead of inference, with a safe path when it intervenes.' },
      { name: 'PromptCaching', meta: 'applied', note: 'Stable prefixes behind cache points — the difference between viable and expensive at volume.' },
      { name: 'ModelRouting', meta: 'worked on', note: 'Cheap, fast model first; escalate to a larger one only when confidence is low.' },
      { name: 'IntentRouting', meta: 'worked on', note: 'Classifying the turn before retrieving, so each kind of question takes the right path.' },
      { name: 'TokenTelemetry', meta: 'observability', note: 'Per-model input, output and cache token accounting so spend is measured, not guessed.' },
      { name: 'Claude', meta: 'primary model', note: 'Extraction, intent classification and answer synthesis.' },
      { name: 'Gemini', meta: 'evaluated', note: 'Second provider used for comparison and evaluation.' },
      { name: 'CursorAI', meta: 'daily', note: 'AI-assisted development as part of the normal loop.' },
    ],
  },
  {
    group: 'Data & Messaging',
    short: 'Data',
    kind: 'interface',
    items: [
      { name: 'PostgreSQL', meta: 'primary', note: 'Relational store behind lender, product and pricing data.' },
      { name: 'MongoDB', meta: 'documents', note: 'Conversation history, message logs, reporting aggregations and usage telemetry.' },
      { name: 'Redis', meta: 'cache · locks', note: 'Caching in front of hot paths, and distributed locking for exclusive work.' },
      { name: 'RabbitMQ', meta: 'async', note: 'Asynchronous inter-service communication and background work.' },
      { name: 'SQL', meta: 'core', note: 'Query writing, schema design and tuning against relational stores.' },
      { name: 'SchemaDesign', meta: 'modelling', note: 'Designing the shape of the data before writing the service around it.' },
      { name: 'Migrations', meta: 'versioned', note: 'Schema change as reviewable, repeatable steps rather than manual edits.' },
    ],
  },
  {
    group: 'Languages',
    short: 'Languages',
    kind: 'method',
    items: [
      { name: 'TypeScript', meta: 'primary', note: 'Every backend service and front-end I ship day to day, including this site.' },
      { name: 'JavaScript', meta: 'stable', note: 'Node runtimes and browser code since the first MERN build.' },
      { name: 'Java', meta: '2 yrs', note: 'Spring Boot microservices for banking systems at Intellect Design Arena.' },
      { name: 'Python', meta: 'working', note: 'Scripting, data wrangling and quick prototypes.' },
      { name: 'CPlusPlus', meta: 'fundamentals', note: 'The language I learned data structures and algorithms in.' },
      { name: 'HtmlCss', meta: 'craft', note: 'Hand-built responsive, accessible UI — no template.' },
    ],
  },
  {
    group: 'Security & Quality',
    short: 'Security',
    kind: 'event',
    items: [
      { name: 'Vapt.Dast', meta: 'testing', note: 'Vulnerability assessment and dynamic testing as part of release readiness.' },
      { name: 'BurpSuite', meta: 'tooling', note: 'Probing running applications for exploitable behaviour.' },
      { name: 'Veracode', meta: 'scanning', note: 'Static analysis findings triaged and fixed before release.' },
      { name: 'SonarScans', meta: 'code quality', note: 'Keeping code-quality and security gates green.' },
      { name: 'SqlInjection', meta: 'remediated', note: 'Found and fixed injection paths — parameterise, never concatenate.' },
      { name: 'XssHardening', meta: 'remediated', note: 'Closed cross-site scripting vectors in a production banking application.' },
      { name: 'AuditLogging', meta: 'traceability', note: 'Recording who changed what, as a cross-cutting concern rather than an afterthought.' },
      { name: 'UnitTesting', meta: 'Jest', note: 'Tests alongside feature work — the cheapest way to keep a service honest.' },
    ],
  },
  {
    group: 'Frontend',
    short: 'Frontend',
    kind: 'variable',
    items: [
      { name: 'React', meta: 'MERN', note: 'Modules for a trade AI platform, and my own projects.' },
      { name: 'Redux', meta: 'state', note: 'Predictable client state for larger React surfaces.' },
      { name: 'Angular', meta: 'v19', note: 'This portfolio — standalone components and signals throughout.' },
      { name: 'Bootstrap', meta: 'layout', note: 'Fast, responsive layout when the design does not need to be bespoke.' },
    ],
  },
  {
    group: 'Tools & Practices',
    short: 'Practices',
    kind: 'snippet',
    items: [
      { name: 'Docker', meta: 'containers', note: 'Local parity and deployable services.' },
      { name: 'Git', meta: 'daily', note: 'Branching, review and release hygiene (plus SVN on legacy systems).' },
      { name: 'Postman', meta: 'APIs', note: 'Contract checking and debugging while an API is still moving.' },
      { name: 'Jira', meta: 'delivery', note: 'Defect triage and ticket closure under SLA, with Confluence for the written record.' },
      { name: 'Agile.Scrum', meta: 'process', note: 'Delivering in iterations with business analysts and QA in the loop.' },
      { name: 'CrossFunctional', meta: 'collaboration', note: 'Day-to-day work with front-end, QA, DevOps and UI/UX — I keep people updated and unblock quickly.' },
      { name: 'ReleaseMgmt', meta: 'SIT · UAT · prod', note: 'Promoting builds through environments and owning what happens next.' },
      { name: 'DSA', meta: '350+ solved', note: 'Data structures and algorithms as everyday problem-solving fundamentals.' },
      { name: 'Troubleshooting', meta: 'severity 1', note: 'Root-causing production incidents for a bank, under a clock.' },
    ],
  },
];

/**
 * Official-documentation links for technologies named across the site.
 * Keyed by a normalised term so one entry serves every spelling used in
 * `SKILLS` (`Aws.Bedrock`), project `tags` (`AWS Bedrock`) and role
 * `stack` chips — see `techLink()`. Terms with no canonical doc are
 * deliberately absent and render as plain text.
 */
const TECH_LINKS: Record<string, string> = {
  nodejs: 'https://nodejs.org/en/docs',
  nestjs: 'https://docs.nestjs.com/',
  typescript: 'https://www.typescriptlang.org/docs/',
  javascript: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
  java: 'https://docs.oracle.com/en/java/',
  python: 'https://docs.python.org/3/',
  cplusplus: 'https://en.cppreference.com/w/',
  htmlcss: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
  sql: 'https://www.postgresql.org/docs/current/sql.html',

  awsbedrock: 'https://docs.aws.amazon.com/bedrock/',
  claude: 'https://docs.anthropic.com/en/docs/about-claude/models',
  gemini: 'https://ai.google.dev/gemini-api/docs',
  cursorai: 'https://docs.cursor.com/',
  rag: 'https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base.html',
  vectorsearch: 'https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base-build.html',
  reranking: 'https://docs.aws.amazon.com/bedrock/latest/userguide/rerank.html',
  tooluse: 'https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/overview',
  guardrails: 'https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html',
  promptcaching: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching',
  citations: 'https://docs.anthropic.com/en/docs/build-with-claude/citations',

  postgresql: 'https://www.postgresql.org/docs/',
  mongodb: 'https://www.mongodb.com/docs/',
  mongoose: 'https://mongoosejs.com/docs/',
  redis: 'https://redis.io/docs/latest/',
  rabbitmq: 'https://www.rabbitmq.com/docs',
  sequelize: 'https://sequelize.org/docs/v6/',
  springboot: 'https://docs.spring.io/spring-boot/index.html',
  hibernatejpa: 'https://hibernate.org/orm/documentation/',
  openapi: 'https://swagger.io/specification/',

  react: 'https://react.dev/',
  redux: 'https://redux.js.org/',
  angular: 'https://angular.dev/',
  bootstrap: 'https://getbootstrap.com/docs/',

  docker: 'https://docs.docker.com/',
  git: 'https://git-scm.com/doc',
  postman: 'https://learning.postman.com/docs/',
  jira: 'https://support.atlassian.com/jira-software-cloud/',
  jest: 'https://jestjs.io/docs/getting-started',
  unittesting: 'https://jestjs.io/docs/getting-started',
  burpsuite: 'https://portswigger.net/burp/documentation',
  veracode: 'https://docs.veracode.com/',
  sonarscans: 'https://docs.sonarsource.com/',
  sqlinjection: 'https://owasp.org/www-community/attacks/SQL_Injection',
  xsshardening: 'https://owasp.org/www-community/attacks/xss/',
  vaptdast: 'https://owasp.org/www-project-web-security-testing-guide/',
  security: 'https://owasp.org/www-project-top-ten/',
  pdfparsing: 'https://docs.aws.amazon.com/bedrock/latest/userguide/kb-chunking-parsing.html',
};

/** `Aws.Bedrock`, `AWS Bedrock` and `aws-bedrock` all collapse to one key. */
const normaliseTerm = (term: string): string => term.toLowerCase().replace(/[^a-z0-9]/g, '');

/** Official docs for a technology term, or `undefined` when it has no canonical home. */
export function techLink(term: string): string | undefined {
  return TECH_LINKS[normaliseTerm(term)];
}

export const EDUCATION = [
  {
    school: 'NIT Raipur',
    detail: 'Master of Computer Applications (MCA)',
    score: 'CGPA 9.23 / 10',
    year: '2024',
  },
  {
    school: 'SSCBS, University of Delhi',
    detail: 'B.Sc. (Hons.) Computer Science',
    score: 'CGPA 8.95 / 10',
    year: '2021',
  },
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    title: 'All India Rank 687 — NIMCET',
    org: 'National Institute of Technology MCA Common Entrance Test',
    when: '2021',
  },
  {
    title: '350+ coding problems solved',
    org: 'Across competitive programming platforms',
    when: 'ongoing',
    link: 'https://github.com/paditya99',
  },
  {
    title: "Core member — Crescendo'20",
    org: 'Annual cultural fest, SSCBS (University of Delhi)',
    when: '2020',
  },
];

/**
 * Signature-build architecture, modelled as two selectable request flows through
 * the two AI systems shipped for ARIVE's mortgage platform:
 *   1. `extraction` — the batch pipeline that turns guideline PDFs into rules.
 *   2. `assistant`  — the authenticated chat path that answers questions with citations.
 * Deliberately kept at the same level of detail as the résumé: no internal service
 * names, endpoints, queue/table names, prompt logic or lender names.
 * The diagram component renders one flow at a time and steps a caption through
 * `steps`, lighting the referenced nodes so the "how it works" reads on its own.
 */
export type ArchKind =
  | 'edge' | 'cdn' | 'api' | 'auth' | 'compute' | 'data' | 'ai' | 'secret' | 'storage';

/**
 * `x`/`y` are percentages of the diagram canvas (0–100).
 * `detail` is the 2–3 line explanation shown when the node is opened. Kept at
 * the same altitude as everything else here: what the piece is for and the
 * standard technique behind it, never internal naming or business rules.
 */
export interface ArchNode {
  id: string; label: string; sub: string;
  x: number; y: number; kind: ArchKind;
  detail: string;
}
/** `bidir` draws a read/write (two-way) relationship. */
export interface ArchEdge { from: string; to: string; bidir?: boolean; }
/** One narration beat: `at` node ids light up while `text` is shown. */
export interface ArchStep { at: string[]; text: string; }
export interface ArchFlow {
  id: string;
  name: string;      // tab label
  tagline: string;   // one-line summary under the tabs
  nodes: ArchNode[];
  edges: ArchEdge[];
  steps: ArchStep[];
}

export const ARCH_FLOWS: ArchFlow[] = [
  {
    id: 'platform',
    name: 'Loan origination',
    tagline: 'A loan from application to funding — and the NestJS services, data stores and workers underneath each stage',
    nodes: [
      { id: 'borrower', label: 'Borrower',          sub: 'POS · portal',            x: 3,  y: 32, kind: 'edge',
        detail:
          'The borrower-facing point of sale. Applicants start an application, upload documents and track progress from a browser, without ever seeing the internal workspace.' },
      { id: 'officer',  label: 'Loan Officer',      sub: 'LOS workspace',           x: 3,  y: 68, kind: 'edge',
        detail:
          'The workspace loan officers and processors live in all day. Same platform, same APIs as the borrower portal — a different role, and therefore a different set of permissions.' },
      { id: 'api',      label: 'Core API',          sub: 'NestJS · guards · ACL',   x: 21, y: 50, kind: 'api',
        detail:
          'A NestJS REST layer that every client goes through. Request bodies are validated against typed DTOs before a handler runs, so a malformed payload is rejected at the edge rather than deep in a service.' },
      { id: 'app',      label: 'Application',       sub: '1003 · loan data',        x: 39, y: 14, kind: 'compute',
        detail:
          'The loan application record: borrower details, the property, and the terms being requested. Validated field by field as it is filled in, because almost everything downstream depends on it being correct.' },
      { id: 'svc',      label: 'Domain Services',   sub: 'rules · transactions',    x: 39, y: 50, kind: 'compute',
        detail:
          'Where the business rules live. Each service composes the work, then commits it inside a database transaction so a partly-applied change never survives an error halfway through.' },
      { id: 'docs',     label: 'Documents',         sub: 'upload · generate',       x: 39, y: 86, kind: 'storage',
        detail:
          'Document handling both ways — files uploaded by the borrower, and documents generated from templates by the platform. Stored in object storage with the record pointing at them rather than holding them.' },
      { id: 'credit',   label: 'Credit & Verify',   sub: 'bureau · income', x: 57, y: 14, kind: 'compute',
        detail:
          'Credit and verification pulled from third-party providers. These calls are slow and metered, so results are persisted against the loan instead of being re-fetched every time a screen loads.' },
      { id: 'ppe',      label: 'Pricing Engine',    sub: 'eligibility · rates', x: 57, y: 50, kind: 'compute',
        detail:
          'The pricing engine: given a scenario, it returns the products the borrower qualifies for and what they would cost, through to locking a rate. Eligibility rules feed it from the extraction pipeline.' },
      { id: 'esign',    label: 'Disclosures',       sub: 'e-sign · delivery',       x: 57, y: 86, kind: 'storage',
        detail:
          'Disclosures packaged, delivered and signed electronically. Regulated documents run on a clock, so delivery and signature timestamps matter as much as the documents themselves.' },
      { id: 'uw',       label: 'Underwriting',      sub: 'AUS · conditions',        x: 75, y: 14, kind: 'compute',
        detail:
          'Underwriting — the automated decision plus the conditions attached to it, tracked until each one is cleared. This is the stage that decides whether the loan proceeds.' },
      { id: 'data',     label: 'Data Layer',        sub: 'PG · Mongo · Redis', x: 75, y: 50, kind: 'data',
        detail:
          'Three stores, each doing what it is good at: PostgreSQL as the relational system of record, MongoDB for documents, activity and audit history, and Redis for cached reads and distributed locks.' },
      { id: 'queue',    label: 'Async Workers',     sub: 'queues · jobs', x: 75, y: 86, kind: 'compute',
        detail:
          'Anything too slow to hold a request open runs here — queued jobs and scheduled work. The API answers immediately and the worker finishes the job out of band.' },
      { id: 'close',    label: 'Closing & Funding', sub: 'closing · funding',  x: 93, y: 14, kind: 'compute',
        detail:
          'Closing documents produced and the loan funded. The end of the journey, and the point at which everything captured earlier has to reconcile.' },
      { id: 'admin',    label: 'Back-office',       sub: 'admin · reporting',       x: 93, y: 50, kind: 'api',
        detail:
          'Internal tooling for support and operations: administering organisations and users, reporting, and reading the audit trail. A separate service from the customer-facing core, over the same data.' },
      { id: 'vendors',  label: 'Integrations',      sub: 'bureau · e-sign', x: 93, y: 86, kind: 'storage',
        detail:
          'The third-party edge — credit bureaus, e-signature, document services, agency delivery. Each one is an external system with its own latency and failure modes, so calls are isolated behind workers.' },
    ],
    edges: [
      { from: 'borrower', to: 'api' },
      { from: 'officer',  to: 'api' },
      { from: 'api',      to: 'app' },
      { from: 'api',      to: 'svc' },
      { from: 'api',      to: 'docs' },
      { from: 'app',      to: 'credit' },
      { from: 'svc',      to: 'ppe' },
      { from: 'docs',     to: 'esign' },
      { from: 'credit',   to: 'uw' },
      { from: 'ppe',      to: 'uw' },
      { from: 'ppe',      to: 'data',  bidir: true },
      { from: 'ppe',      to: 'queue' },
      { from: 'esign',    to: 'queue' },
      { from: 'uw',       to: 'close' },
      { from: 'data',     to: 'admin', bidir: true },
      { from: 'queue',    to: 'vendors' },
    ],
    steps: [
      { at: ['borrower', 'officer'], text: 'A borrower starts an application in the point-of-sale portal, or a loan officer opens one in the LOS workspace' },
      { at: ['api'],                 text: 'Every surface goes through one NestJS API — guards resolve role, permission and tenant before a handler runs' },
      { at: ['app'],                 text: 'The application itself: borrower, property and loan terms captured and validated field by field' },
      { at: ['credit'],              text: 'Credit is pulled, and income and asset documentation verified through third-party providers' },
      { at: ['svc'],                 text: 'Domain services carry the business rules, writing every change inside a transaction' },
      { at: ['ppe'],                 text: 'The pricing engine returns eligible products and rates for the scenario, through to rate lock' },
      { at: ['docs', 'esign'],       text: 'Documents are uploaded and generated from templates; disclosures go out for e-signature on a compliance clock' },
      { at: ['uw'],                  text: 'Underwriting runs the automated decision and tracks conditions through to clearing' },
      { at: ['close'],               text: 'Cleared to close — closing documents are produced and the loan is funded' },
      { at: ['ppe', 'data'],         text: 'Postgres is the system of record; Mongo holds documents, activity and audit; Redis caches and locks' },
      { at: ['queue', 'vendors'],    text: 'Slow work leaves the request path onto queues, where workers drive the external integrations' },
      { at: ['admin'],               text: 'The back office runs on the same core — tenant administration, reporting and the audit trail' },
    ],
  },
  {
    id: 'extraction',
    name: 'Guideline extraction',
    tagline: 'Batch pipeline · guideline PDFs → schema-forced rules, deterministic and re-runnable',
    nodes: [
      { id: 'pdfs',     label: 'Guideline PDFs',  sub: 'lender · agency',      x: 4,  y: 50, kind: 'edge',
        detail:
          'Lender and agency guideline documents, often several hundred pages each. Every lender writes them differently, which is exactly why they cannot simply be parsed with rules.' },
      { id: 'slice',    label: 'PDF Slicer',      sub: 'per-field units',      x: 21, y: 50, kind: 'compute',
        detail:
          'Each guide is cut into smaller, per-field units before the model sees it. That keeps every request inside the model\'s input limit and makes a failure affect one slice rather than a whole document.' },
      { id: 'gate',     label: 'Change Gate',     sub: 'content hash · skip',  x: 39, y: 14, kind: 'secret',
        detail:
          'A content hash recorded per document. If the hash has not moved since the last run, the document is skipped entirely — re-running the pipeline costs nothing for guides nobody edited.' },
      { id: 'extract',  label: 'Extraction',      sub: 'Claude · forced tool', x: 39, y: 50, kind: 'ai',
        detail:
          'Claude on AWS Bedrock reads each slice, but must answer through a forced tool schema. Because the model can only reply in that shape, the output cannot drift between documents or between runs.' },
      { id: 'kb',       label: 'Knowledge Base',  sub: 'RAG retrieval',        x: 58, y: 86, kind: 'data',
        detail:
          'A vector knowledge base used to retrieve context a single attached slice does not contain. Retrieval fills the gaps rather than replacing the direct read.' },
      { id: 'validate', label: 'Validate',        sub: 'repair · vocabulary',  x: 58, y: 50, kind: 'compute',
        detail:
          'Model output is checked against a fixed vocabulary and repaired deterministically. Anything the model invents that is not a permitted value gets corrected here, before it can reach a downstream system.' },
      { id: 'ledger',   label: 'Code Ledger',     sub: 'stable rule ids',      x: 76, y: 50, kind: 'data',
        detail:
          'A ledger of rule codes carried across runs, so the same rule keeps the same identity. Without it every re-extraction would look like a wholesale rewrite and no one could review the difference.' },
      { id: 'rules',    label: 'Rule JSON',       sub: 'canonical output',     x: 92, y: 16, kind: 'storage',
        detail:
          'The canonical output: one uniform, machine-readable rule set with the same shape for every lender, whatever the source document looked like.' },
      { id: 'pricing',  label: 'Pricing Engine',  sub: 'eligibility inputs',   x: 92, y: 50, kind: 'data',
        detail:
          'The extracted rules become the eligibility inputs the pricing engine runs on — this is where the pipeline stops being a document exercise and starts affecting what a borrower is offered.' },
      { id: 'qa',       label: 'QA Workbook',     sub: 'what changed',         x: 92, y: 84, kind: 'storage',
        detail:
          'A workbook of exactly what changed since the previous run. Human review looks only at genuine differences instead of re-reading the entire rule set.' },
    ],
    edges: [
      { from: 'pdfs',     to: 'slice' },
      { from: 'slice',    to: 'gate' },
      { from: 'slice',    to: 'extract' },
      { from: 'extract',  to: 'kb' },
      { from: 'extract',  to: 'validate' },
      { from: 'validate', to: 'ledger' },
      { from: 'ledger',   to: 'rules' },
      { from: 'ledger',   to: 'pricing' },
      { from: 'ledger',   to: 'qa' },
    ],
    steps: [
      { at: ['pdfs'],                     text: 'Lender and agency guideline PDFs arrive — hundreds of pages each, no two written alike' },
      { at: ['slice'],                    text: 'Each guide is sliced into per-field units small enough to hand the model directly' },
      { at: ['gate'],                     text: 'A content hash gates the run — an unchanged document is skipped, never paid for twice' },
      { at: ['extract'],                  text: 'Claude reads each slice and must answer through a forced tool schema — the shape cannot drift' },
      { at: ['extract', 'kb'],            text: 'Retrieval fills in what a single attached slice cannot cover' },
      { at: ['validate'],                 text: 'Every rule is validated and repaired deterministically against a fixed vocabulary' },
      { at: ['ledger'],                   text: 'A code ledger reconciles against the last run so rule ids stay stable across releases' },
      { at: ['ledger', 'pricing'],        text: 'Accepted rules become the eligibility inputs the pricing engine runs on' },
      { at: ['ledger', 'rules', 'qa'],    text: 'Canonical JSON plus a workbook of exactly what changed go out for human review' },
    ],
  },
  {
    id: 'assistant',
    name: 'RAG assistant',
    tagline: 'Authenticated · hybrid retrieval + rerank — streamed answers that cite the source page',
    nodes: [
      { id: 'officer',  label: 'Loan Officer',    sub: 'asks in-product',      x: 4,  y: 50, kind: 'edge',
        detail:
          'A loan officer asking a guideline question in the middle of real work — the point is a fast, sourced answer, not a research session.' },
      { id: 'api',      label: 'Chat API',        sub: 'NestJS · streamed',    x: 20, y: 50, kind: 'api',
        detail:
          'A NestJS endpoint that authorises the request and then holds a streaming connection open, so tokens reach the browser as they are generated instead of after a long wait.' },
      { id: 'guard',    label: 'Guardrail',       sub: 'screened first',       x: 37, y: 14, kind: 'auth',
        detail:
          'Input is screened before it reaches any model. If the guardrail intervenes the turn is answered from a safe canned path and recorded separately, so interventions are visible rather than silent.' },
      { id: 'intent',   label: 'Intent Router',   sub: 'small model first',    x: 37, y: 50, kind: 'compute',
        detail:
          'A small, fast model classifies what kind of question was asked, and a larger one takes over only when confidence is low. Most turns never need the expensive model.' },
      { id: 'retrieve', label: 'Retrieval',       sub: 'hybrid · rerank',      x: 55, y: 50, kind: 'compute',
        detail:
          'Semantic and keyword search combined, scoped by lender and program, then reranked. Over-fetching and reranking gets the passages that actually answer the question rather than the ones that merely look similar.' },
      { id: 'pg',       label: 'PostgreSQL',      sub: 'lenders · products',   x: 73, y: 14, kind: 'data',
        detail:
          'Relational lookups that resolve which lender and product the question is actually about. Getting this wrong scopes the retrieval to the wrong documents, so it happens before search.' },
      { id: 'kb',       label: 'Knowledge Base',  sub: 'vector store',         x: 73, y: 50, kind: 'data',
        detail:
          'The vector store the guideline content is indexed into. Metadata on each chunk is what allows retrieval to be narrowed to one lender and program.' },
      { id: 'answer',   label: 'Claude',          sub: 'answer + citations',   x: 73, y: 86, kind: 'ai',
        detail:
          'Claude writes the answer from the retrieved passages, streamed back token by token with numbered citations pointing at the source. Grounding is what makes the answer checkable instead of merely plausible.' },
      { id: 'mongo',    label: 'MongoDB',         sub: 'chats · token usage',  x: 91, y: 86, kind: 'data',
        detail:
          'Conversations, thumbs up/down feedback and per-model token usage are all persisted. That is what makes quality reviewable after the fact and cost a measured number rather than a guess.' },
    ],
    edges: [
      { from: 'officer',  to: 'api' },
      { from: 'api',      to: 'guard' },
      { from: 'api',      to: 'intent' },
      { from: 'intent',   to: 'retrieve' },
      { from: 'retrieve', to: 'pg' },
      { from: 'retrieve', to: 'kb' },
      { from: 'retrieve', to: 'answer' },
      { from: 'answer',   to: 'mongo' },
    ],
    steps: [
      { at: ['officer'],              text: 'A loan officer asks a guideline question from inside the platform' },
      { at: ['api'],                  text: 'The chat API authorises the request, then opens a long-lived streaming response' },
      { at: ['guard'],                text: 'Guardrails screen the message before any model sees it' },
      { at: ['intent'],               text: 'A small, fast model classifies intent — a larger one takes over only when it is unsure' },
      { at: ['retrieve', 'pg'],       text: 'Postgres resolves which lender and product the question is actually about' },
      { at: ['retrieve', 'kb'],       text: 'Hybrid semantic + lexical search pulls candidates, then reranking keeps only the passages that matter' },
      { at: ['answer'],               text: 'Claude synthesises the answer with numbered citations, streamed back token by token' },
      { at: ['answer', 'mongo'],      text: 'Conversation, feedback and per-model token usage are recorded for cost and quality review' },
    ],
  },
];
