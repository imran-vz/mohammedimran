export interface Project {
	name: string;
	description: string;
	tech: string[];
	url: string;
}

export const allProjects: Project[] = [
	{
		name: 'SEER',
		description: 'Tauri desktop app for media file management, metadata editing & re-encoding',
		tech: ['Rust', 'TypeScript', 'React', 'FFmpeg'],
		url: 'https://github.com/imran-vz/seer',
	},
	{
		name: 'GOSQLIT',
		description: 'Terminal UI SQL client with encrypted credentials & multi-database support',
		tech: ['Go', 'Bubble Tea', 'PostgreSQL'],
		url: 'https://github.com/imran-vz/gosqlit',
	},
	{
		name: 'DBUNK',
		description: 'Desktop database workspace for exploring data, running SQL & editing schemas',
		tech: ['Tauri', 'React', 'TypeScript', 'Rust'],
		url: 'https://github.com/imran-vz/dbunk',
	},
];
