export interface ExperienceProfile {
	name: string;
	preferredName: string;
	displayHeadline: string;
	supportingHeadline: string;
	location: string;
	personalNote: string;
	links: {
		website: string;
		github: string;
		linkedin: string;
	};
	resumeSkills: {
		languages: string[];
		frontend: string[];
		backendAi: string[];
		infrastructureIot: string[];
		databasesTools: string[];
	};
}

export interface WorkExperience {
	id: string;
	company: string;
	brandName?: string;
	legalName?: string;
	legalNameDisplay?: 'tooltip';
	parentCompany?: string;
	role: string;
	employmentType?: string;
	locationType?: string | null;
	location?: string;
	startDate: string;
	endDate: string | null;
	current?: boolean;
	companyUrl?: string | null;
	showInPrimaryTimeline?: boolean;
	shortDescription?: string;
	achievementBullets?: string[];
	technologies?: string[];
}

export interface ShowcaseProject {
	id: string;
	name: string;
	alternateName?: string;
	group: string;
	status: string;
	statusDisplay?: {
		show: boolean;
		style: string;
	};
	description: string;
	tech: string[];
	url: string;
	tags?: string[];
}

export interface ShowcaseProjectGroup {
	id: string;
	label: string;
}

export interface ExperienceData {
	profile: ExperienceProfile;
	experience: WorkExperience[];
	showcaseProjects: ShowcaseProject[];
	showcaseProjectGroups: ShowcaseProjectGroup[];
}
