import type { Project } from './projects';
import { allProjects } from './projects';

function getProject(name: string): Project {
	const project = allProjects.find((p) => p.name === name);
	if (!project) throw new Error(`Project "${name}" not found`);
	return project;
}

export interface HirePageData {
	slug: string;
	title: string;
	metaTitle: string;
	metaDescription: string;
	headline: string;
	intro: string;
	whyHireMe: {
		title: string;
		points: { heading: string; text: string }[];
	};
	projects: Project[];
	skills: string[];
	faq: { question: string; answer: string }[];
}

export const hirePages: HirePageData[] = [
	{
		slug: 'developer-for-hire-bangalore',
		title: 'Developer for Hire in Bangalore',
		metaTitle: 'Developer for Hire in Bangalore | Full Stack React, TypeScript & Go',
		metaDescription:
			'Looking for a developer for hire in Bangalore? Imran is a senior full stack developer based in Bengaluru/Bangalore, available for React, TypeScript, Go, and product engineering contracts.',
		headline: 'Developer for Hire in Bangalore',
		intro:
			'I am a senior full stack developer for hire in Bangalore (Bengaluru), available for freelance and contract work with startups, product teams, and agencies. I build production web applications with React, TypeScript, Go, Rust, PostgreSQL, and modern deployment workflows.',
		whyHireMe: {
			title: 'Why Hire Me as Your Bangalore Developer',
			points: [
				{
					heading: 'Based in Bangalore, Remote-Friendly',
					text: 'I am based in Bengaluru/Bangalore and work comfortably with local Bangalore teams as well as remote teams across India, the US, EU, and APAC. You get local context with async-friendly engineering habits.',
				},
				{
					heading: 'Full Stack Product Delivery',
					text: 'I can own frontend, backend, database, deployment, and integrations. That is useful when you need one experienced developer to move quickly without creating handoff gaps between specialists.',
				},
				{
					heading: 'React, TypeScript, Go, and Rust',
					text: 'My core stack covers modern product engineering: React and TypeScript for user interfaces, Go for APIs and tooling, Rust/Tauri for desktop apps, and PostgreSQL for data-heavy systems.',
				},
				{
					heading: 'Practical Contract Engagements',
					text: 'I am available for focused feature builds, codebase audits, performance work, MVP development, internal tools, desktop apps, and longer contract engagements where senior execution matters.',
				},
			],
		},
		projects: [
			getProject('DBUNK'),
			getProject('Cocoa Comaa Store'),
			getProject('GOSQLIT'),
			getProject('SEER'),
			getProject('pi-observability'),
		],
		skills: [
			'Full Stack Development',
			'React & Next.js',
			'TypeScript',
			'Go / GoLang',
			'Rust & Tauri',
			'Node.js',
			'PostgreSQL',
			'API Design',
			'Performance Optimization',
			'Code Reviews & Refactoring',
		],
		faq: [
			{
				question: 'Are you available as a developer for hire in Bangalore?',
				answer:
					'Yes. I am based in Bengaluru/Bangalore and available for freelance projects, contract work, and remote collaborations. I work with Bangalore teams as well as companies outside India.',
			},
			{
				question: 'What type of development work can you take on?',
				answer:
					'I take on full-stack web applications, React and TypeScript frontends, Go backends, APIs, PostgreSQL-backed products, internal tools, desktop apps with Tauri, performance fixes, and codebase refactoring.',
			},
			{
				question: 'Can you work with startups and small teams?',
				answer:
					'Yes. I am a good fit for startups and lean teams that need a senior developer who can clarify scope, make architecture decisions, write production code, and ship without heavy process overhead.',
			},
			{
				question: 'Do you work on-site in Bangalore or remotely?',
				answer:
					'Remote is my default, but I am based in Bangalore and can discuss hybrid or local collaboration when it makes sense for the project.',
			},
			{
				question: 'How should I contact you about a project?',
				answer:
					'Email me with a short project summary, timeline, current stack, and what outcome you need. I will respond with availability and the best next step.',
			},
		],
	},
	{
		slug: 'react-developer-bengaluru',
		title: 'Hire a React Developer in Bengaluru/Bangalore',
		metaTitle: 'Hire React Developer Bengaluru/Bangalore | Imran | 5+ Years Experience',
		metaDescription:
			'Looking to hire a React developer in Bengaluru or Bangalore? Imran is a Senior Full Stack Developer with 5+ years of React experience, building production-grade applications with TypeScript, Next.js, and modern frontend tooling.',
		headline: 'React Developer in Bengaluru/Bangalore',
		intro:
			'I am a Senior Full Stack Developer based in Bengaluru/Bangalore with over 5 years of hands-on experience building production React applications. I specialize in creating performant, type-safe user interfaces using React, TypeScript, and Next.js for startups and enterprises.',
		whyHireMe: {
			title: 'Why Hire Me as Your React Developer',
			points: [
				{
					heading: '5+ Years of Production React',
					text: 'I have built and shipped React applications used by real users across e-commerce, media management, and data-intensive domains. My experience covers everything from component architecture to state management, performance optimization, and testing.',
				},
				{
					heading: 'Full Stack Capability',
					text: 'Unlike frontend-only developers, I build the entire stack. I design APIs, set up databases, configure CI/CD, and deploy to production. This means fewer communication gaps and faster delivery when you hire me for your project.',
				},
				{
					heading: 'Bengaluru/Bangalore-Based, Globally Available',
					text: "Based in Bengaluru/Bangalore, India's tech capital, I work in the IST timezone with flexible hours for overlap with US, EU, and APAC teams. I have experience collaborating with distributed teams across multiple time zones.",
				},
				{
					heading: 'Modern Tooling & Best Practices',
					text: 'I use TypeScript by default, write tested code, and follow React best practices including server components, streaming SSR, and incremental static regeneration. My applications are accessible, performant, and maintainable.',
				},
			],
		},
		projects: [
			{
				...getProject('DBUNK'),
				description:
					'A Tauri desktop database workspace with a React and TypeScript frontend, Monaco-powered SQL editor, schema browser, data grids, and Rust-backed database integrations.',
			},
			{
				...getProject('Cocoa Comaa Store'),
				description:
					'A production-style Next.js and React store operations app covering POS ordering, inventory, manager workflows, admin reporting, and precomputed analytics.',
			},
			{
				...getProject('SEER'),
				description:
					'A Tauri desktop media toolkit with a React and TypeScript frontend for file browsing, codec and stream inspection, bitrate analysis, and exportable media reports.',
			},
			{
				...getProject('Vegam'),
				description:
					'A React and TypeScript Tauri app for direct macOS and Android file transfer using Iroh P2P networking and a Rust backend.',
			},
		],
		skills: [
			'React 18+ & Server Components',
			'Next.js (App Router & Pages Router)',
			'TypeScript',
			'Tailwind CSS',
			'State Management (Zustand, React Query)',
			'Testing (Vitest, React Testing Library)',
			'Performance Optimization',
			'Responsive & Accessible UI',
			'REST & GraphQL APIs',
			'CI/CD & Deployment',
		],
		faq: [
			{
				question: 'What React frameworks and libraries do you work with?',
				answer:
					'I work primarily with Next.js for full-stack React applications and plain React with Vite for SPAs. I use TypeScript on every project, Tailwind CSS for styling, Zustand or React Query for state management, and Vitest with React Testing Library for testing.',
			},
			{
				question: 'Do you work remotely or on-site in Bengaluru/Bangalore?',
				answer:
					'I am based in Bengaluru/Bangalore and available for both remote and hybrid work arrangements. I have extensive experience working with distributed teams across time zones and use asynchronous communication effectively.',
			},
			{
				question: 'What is your availability and how do you charge?',
				answer:
					'I am currently available for freelance projects and contract work. I work on both fixed-price and hourly engagements depending on the project scope. Contact me to discuss your requirements and timeline.',
			},
			{
				question: 'Can you work with an existing React codebase?',
				answer:
					'Yes. I regularly work with existing codebases — refactoring, adding features, fixing performance issues, and migrating to newer React patterns. I can audit your current React application and recommend improvements.',
			},
			{
				question: 'How long does a typical React project take?',
				answer:
					'It depends on scope. A landing page or simple SPA takes 1-2 weeks. A full-featured web application with authentication, database, and API integration typically takes 4-8 weeks. I provide detailed timelines after understanding your requirements.',
			},
		],
	},
	{
		slug: 'golang-developer',
		title: 'Hire a GoLang Developer',
		metaTitle: 'Hire GoLang Developer | Imran | Backend, CLI & Systems Programming',
		metaDescription:
			'Hire an experienced GoLang developer for backend APIs, CLI tools, and systems programming. Imran builds high-performance Go applications with clean architecture, concurrency patterns, and production-grade reliability.',
		headline: 'GoLang Developer for Hire',
		intro:
			'I am a Go developer who builds high-performance backend services, CLI tools, and systems software. With hands-on experience in Go concurrency patterns, the standard library, and terminal UI frameworks like Bubble Tea, I deliver reliable Go applications that handle real-world workloads.',
		whyHireMe: {
			title: 'Why Hire Me as Your Go Developer',
			points: [
				{
					heading: 'Real Go Projects in Production',
					text: 'I have built and open-sourced Go applications including terminal UI database clients and CLI tools. My Go code follows idiomatic patterns — proper error handling, clean interfaces, and effective use of goroutines and channels.',
				},
				{
					heading: 'CLI & Developer Tooling Expertise',
					text: 'I specialize in building developer-facing tools with Go. From terminal UI applications using Bubble Tea to command-line utilities, I know how to create tools that developers actually want to use.',
				},
				{
					heading: 'Backend API Development',
					text: 'I build REST and gRPC APIs in Go with proper middleware, authentication, database integration (PostgreSQL, Redis), and structured logging. My services are designed for horizontal scaling and observability.',
				},
				{
					heading: 'Full Stack When You Need It',
					text: 'While I build backends in Go, I also have 5+ years of frontend experience with React and TypeScript. This means I can build your entire application — API, database, and frontend — with a cohesive architecture.',
				},
			],
		},
		projects: [
			{
				...getProject('GOSQLIT'),
				description:
					'A terminal UI SQL client built with Go and Bubble Tea. Features encrypted credential storage, PostgreSQL schema browsing, a multi-line query editor, query cancellation, paginated results, and an intuitive keyboard-driven interface.',
			},
		],
		skills: [
			'Go Standard Library',
			'Concurrency (Goroutines, Channels, sync)',
			'Bubble Tea & Terminal UIs',
			'REST & gRPC APIs',
			'PostgreSQL & Database Drivers',
			'Docker & Containerization',
			'Testing & Benchmarking',
			'CLI Tool Development',
			'Structured Logging & Observability',
			'Clean Architecture Patterns',
		],
		faq: [
			{
				question: 'What types of Go projects do you build?',
				answer:
					'I build backend APIs (REST and gRPC), CLI tools, terminal UI applications, microservices, and developer tooling. My Go projects typically involve database integration, concurrent processing, and clean architecture.',
			},
			{
				question: 'Do you have experience with Go concurrency?',
				answer:
					'Yes. I use goroutines, channels, sync primitives, and context cancellation patterns in production code. My GOSQLIT project handles concurrent database connections and async query execution using Go concurrency.',
			},
			{
				question: 'Can you build microservices in Go?',
				answer:
					'Yes. I design and build Go microservices with proper service boundaries, inter-service communication (gRPC, message queues), database-per-service patterns, Docker containerization, and structured logging for observability.',
			},
			{
				question: 'What databases do you work with in Go?',
				answer:
					'I have experience with PostgreSQL, MySQL, SQLite, Redis, and MongoDB in Go. I use standard database/sql with pgx or sqlx drivers, and I am familiar with ORMs like GORM and query builders like sqlc.',
			},
			{
				question: 'Are you available for Go consulting or code reviews?',
				answer:
					'Yes. Beyond building new applications, I offer Go code reviews, performance audits, and consulting on Go architecture decisions. Contact me to discuss your needs.',
			},
		],
	},
	{
		slug: 'typescript-developer',
		title: 'Hire a TypeScript Developer',
		metaTitle: 'Hire TypeScript Developer | Imran | Full Stack, Type-Safe Applications',
		metaDescription:
			'Hire an experienced TypeScript developer for full-stack web applications. Imran has 5+ years building type-safe applications with TypeScript, React, Node.js, and modern frameworks with end-to-end type safety.',
		headline: 'TypeScript Developer for Hire',
		intro:
			'I am a Full Stack Developer with over 5 years of TypeScript experience across frontend, backend, and tooling. I build end-to-end type-safe applications where types flow from database schema to API layer to UI components, catching bugs at compile time instead of production.',
		whyHireMe: {
			title: 'Why Hire Me as Your TypeScript Developer',
			points: [
				{
					heading: 'TypeScript-First on Every Project',
					text: 'TypeScript is not an afterthought in my work — it is the foundation. Every project I build starts with TypeScript, from schema definitions to API contracts to component props. This approach eliminates entire categories of runtime errors.',
				},
				{
					heading: 'End-to-End Type Safety',
					text: 'I design systems where types propagate from the database (using Drizzle ORM or Prisma) through API routes to React components. When a database column changes, TypeScript catches every affected line of code at build time.',
				},
				{
					heading: 'Advanced TypeScript Patterns',
					text: 'I use generics, conditional types, template literal types, and discriminated unions to create APIs that are both flexible and type-safe. My TypeScript code is strict — no "any" escape hatches.',
				},
				{
					heading: 'Full Stack Delivery',
					text: 'I build complete applications — React frontends, Node.js/Next.js backends, PostgreSQL databases, and deployment pipelines. Having one developer who owns the entire TypeScript stack means faster iteration and fewer integration bugs.',
				},
			],
		},
		projects: [
			{
				...getProject('DBUNK'),
				description:
					'A type-safe React and TypeScript desktop database workspace with a Monaco SQL editor, TanStack-powered data grids, and typed Tauri IPC boundaries to a Rust backend.',
			},
			{
				...getProject('Cocoa Comaa Store'),
				description:
					'A full-stack TypeScript app using Next.js, PostgreSQL, Drizzle ORM, Better Auth, TanStack tooling, and Trigger.dev scheduled jobs for analytics.',
			},
			{
				...getProject('SEER'),
				description:
					'A Tauri desktop media toolkit built with React and TypeScript for file browsing, codec and stream inspection, bitrate analysis, and exportable media data.',
			},
			{
				...getProject('pi-observability'),
				description:
					'A TypeScript extension for the pi coding agent that renders a live observability footer and /obs TUI dashboard for tokens, cost, runtime, TPS, and git stats.',
			},
			{
				...getProject('pi-context-breakup'),
				description:
					'A small TypeScript pi extension that categorizes context-window usage into prompts, rules, tools, MCP, skills, user context, and messages.',
			},
			{
				...getProject('Vegam'),
				description:
					'A React and TypeScript Tauri app for direct macOS and Android file transfer, backed by Rust and Iroh P2P networking.',
			},
		],
		skills: [
			'TypeScript (Strict Mode)',
			'React & Next.js',
			'Node.js & Express',
			'Zod & Runtime Validation',
			'Drizzle ORM & Prisma',
			'tRPC & Type-Safe APIs',
			'Generics & Advanced Type Patterns',
			'Monorepo Tooling (Turborepo)',
			'Testing with Vitest',
			'ESLint & Biome for Code Quality',
		],
		faq: [
			{
				question: 'What TypeScript frameworks do you work with?',
				answer:
					'I work primarily with React and Next.js on the frontend, Node.js and Express on the backend, and Astro for content sites. I use Drizzle ORM or Prisma for type-safe database access, Zod for runtime validation, and tRPC for end-to-end type-safe APIs.',
			},
			{
				question: 'Can you migrate a JavaScript project to TypeScript?',
				answer:
					'Yes. I have migrated JavaScript codebases to TypeScript incrementally — starting with strict tsconfig, adding types to critical paths first, and progressively eliminating implicit any types. I can plan and execute a migration without disrupting your development workflow.',
			},
			{
				question: 'Do you write tests for TypeScript projects?',
				answer:
					'Yes. I use Vitest for unit and integration testing, React Testing Library for component tests, and Playwright for end-to-end tests. TypeScript makes testing more effective because the type system catches many bugs before tests even run.',
			},
			{
				question: 'What is your approach to TypeScript strictness?',
				answer:
					'I use strict mode on every project with no exceptions. This means strict null checks, no implicit any, and no unchecked indexed access. I use Zod at system boundaries to validate external data, and the TypeScript compiler handles internal type safety.',
			},
			{
				question: 'Are you available for full-stack TypeScript projects?',
				answer:
					'Yes. I build complete TypeScript applications — from database schema to deployed frontend. I am available for freelance projects, contract work, and consulting. Contact me to discuss your requirements.',
			},
		],
	},
];

export function getHirePage(slug: string): HirePageData | undefined {
	return hirePages.find((page) => page.slug === slug);
}
