import experienceData from '../data/experience.json';
import type { ExperienceData, ShowcaseProject, WorkExperience } from '../types/experience';

export const experience = experienceData as ExperienceData;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatMonthYear(dateStr: string): string {
	const [year, month] = dateStr.split('-');
	if (!month) return year;
	return `${MONTHS[Number.parseInt(month, 10) - 1]} ${year}`;
}

export function formatDateRange(entry: Pick<WorkExperience, 'startDate' | 'endDate' | 'current'>): string {
	const start = formatMonthYear(entry.startDate);
	if (entry.current || !entry.endDate) return `${start} — Present`;
	return `${start} — ${formatMonthYear(entry.endDate)}`;
}

export function getDisplayCompanyName(entry: WorkExperience): string {
	return entry.brandName ?? entry.company;
}

export function getLegalNameTooltip(entry: WorkExperience): string | undefined {
	if (entry.legalNameDisplay === 'tooltip' && entry.legalName) {
		return entry.legalName;
	}
	return undefined;
}

export function getPrimaryTimeline(): WorkExperience[] {
	return experience.experience
		.filter((entry) => entry.showInPrimaryTimeline)
		.sort((a, b) => b.startDate.localeCompare(a.startDate));
}

export function getShowcaseProjectsByGroup(groupId: string): ShowcaseProject[] {
	return experience.showcaseProjects.filter((project) => project.group === groupId);
}

export function getAllResumeSkills(): string[] {
	const { resumeSkills } = experience.profile;
	return [
		...resumeSkills.languages,
		...resumeSkills.frontend,
		...resumeSkills.backendAi,
		...resumeSkills.infrastructureIot,
		...resumeSkills.databasesTools,
	];
}

export function getInitials(name: string): string {
	const words = name
		.replace(/[^a-zA-Z0-9\s-]/g, '')
		.trim()
		.split(/[\s-]+/)
		.filter(Boolean);
	if (words.length === 0) return '?';
	if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
	return (words[0][0] + words[1][0]).toUpperCase();
}

export function projectVisualHue(projectId: string): number {
	let hash = 0;
	for (const char of projectId) {
		hash = char.charCodeAt(0) + ((hash << 5) - hash);
	}
	return Math.abs(hash) % 360;
}
