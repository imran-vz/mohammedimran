export interface Project {
	name: string;
	description: string;
	tech: string[];
	url: string;
}

export const allProjects: Project[] = [
	{
		name: 'DBUNK',
		description:
			"Open-source native macOS database workspace built with Rust and GPUI (Zed's UI framework) for browsing data, running SQL, and inspecting and changing schemas.",
		tech: ['Rust', 'GPUI', 'PostgreSQL', 'MySQL', 'SQLite'],
		url: 'https://github.com/imran-vz/dbunk',
	},
	{
		name: 'SEER',
		description:
			'Tauri desktop media toolkit for file browsing, codec and stream inspection, bitrate analysis, ffprobe metadata, and SQLite-backed caching.',
		tech: ['Tauri', 'React', 'TypeScript', 'Rust', 'FFmpeg'],
		url: 'https://github.com/imran-vz/seer',
	},
	{
		name: 'GOSQLIT',
		description:
			'Terminal SQL client for PostgreSQL with encrypted credentials, schema browsing, a multi-line query editor, query cancellation, and paginated results.',
		tech: ['Go', 'Bubble Tea', 'PostgreSQL', 'pgx'],
		url: 'https://github.com/imran-vz/gosqlit',
	},
	{
		name: 'Cocoa Comaa',
		description:
			'Live ordering site for a Bengaluru dessert brand with custom cakes, postal brownies, paid baking workshops, online courses, and admin and manager panels.',
		tech: ['Next.js', 'React', 'TypeScript', 'PostgreSQL', 'Drizzle ORM', 'Razorpay'],
		url: 'https://cocoacomaa.com',
	},
	{
		name: 'Cocoa Comaa Store',
		description:
			'Full-stack store operations app for ordering, inventory, manager workflows, admin reporting, and precomputed analytics with IST business-day rules.',
		tech: ['Next.js', 'React', 'TypeScript', 'PostgreSQL', 'Drizzle ORM'],
		url: 'https://github.com/imran-vz/cocoacomaastore',
	},
	{
		name: 'pi-observability',
		description:
			'Pi coding-agent extension with a live footer and /obs TUI dashboard for context usage, token counts, cost, TPS, runtime, and git stats.',
		tech: ['TypeScript', 'Pi Extension', 'TUI', 'Agent Tooling'],
		url: 'https://github.com/imran-vz/pi-observability',
	},
	{
		name: 'Vegam',
		description:
			'Tauri desktop app for direct file transfer between macOS, Windows, and Linux computers using Iroh P2P networking with relay fallback and no cloud storage.',
		tech: ['Tauri', 'Rust', 'React', 'TypeScript', 'Iroh'],
		url: 'https://github.com/imran-vz/vegam',
	},
	{
		name: 'Prompter',
		description:
			'Native SwiftUI macOS teleprompter with real-time speech-to-text auto-scrolling, transcript alignment, themes, and keyboard shortcuts.',
		tech: ['Swift', 'SwiftUI', 'Apple Speech', 'WhisperKit'],
		url: 'https://github.com/imran-vz/prompter',
	},
	{
		name: 'pi-context-breakup',
		description:
			'Pi extension that breaks a session context window into system prompt, rules, tools, MCP, skills, user context, and messages with token percentages.',
		tech: ['TypeScript', 'Pi Extension', 'Token Analysis'],
		url: 'https://github.com/imran-vz/pi-context-breakup',
	},
];
