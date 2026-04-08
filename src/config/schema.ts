import { siteMeta } from './siteMeta';

export function buildPersonSchema(overrides?: { description?: string; imageUrl?: string }) {
	return {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: siteMeta.brandShort,
		alternateName: [
			...siteMeta.alternateNames,
			'Mohammed Imran',
			'Mohammed Imran Developer',
			'developer Imran',
			'developer Mohammed imran',
			'Mohammed Imran Developer Bengaluru',
			'bengaluru developer',
			'bengaluru developer Mohammed Imran',
			'bengaluru developer Mohammed',
			'bengaluru developer Imran',
		],
		jobTitle: 'Senior Full Stack Developer',
		description: overrides?.description ?? siteMeta.defaultDescription,
		url: siteMeta.siteUrl,
		image: overrides?.imageUrl ?? siteMeta.logoUrl,
		email: 'mohammedimran86992@gmail.com',
		sameAs: [siteMeta.social.github, siteMeta.social.linkedin],
		knowsAbout: [
			'React',
			'TypeScript',
			'Go',
			'Rust',
			'Node.js',
			'PostgreSQL',
			'Next.js',
			'Tauri',
			'Full Stack Development',
			'Web Development',
		],
		worksFor: {
			'@type': 'Organization',
			name: siteMeta.employer,
			url: 'https://www.thoughtseed.space/',
		},
		address: {
			'@type': 'PostalAddress',
			addressLocality: siteMeta.location.locality,
			addressRegion: siteMeta.location.region,
			addressCountry: siteMeta.location.country,
		},
	};
}

export function buildWebsiteSchema(overrides?: { description?: string }) {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: `${siteMeta.brandShort} - Developer Portfolio`,
		url: siteMeta.siteUrl,
		description: overrides?.description ?? siteMeta.defaultDescription,
		author: {
			'@type': 'Person',
			name: siteMeta.brandShort,
		},
	};
}

export function buildBreadcrumbSchema(items: { name: string; url: string }[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.name,
			item: item.url,
		})),
	};
}

export function buildFaqSchema(faq: { question: string; answer: string }[]) {
	if (faq.length === 0) return null;
	return {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faq.map((item) => ({
			'@type': 'Question',
			name: item.question,
			acceptedAnswer: {
				'@type': 'Answer',
				text: item.answer,
			},
		})),
	};
}

interface ArticleSchemaProps {
	title: string;
	description: string;
	datePublished: string;
	dateModified?: string;
	tags: string[];
	canonicalUrl: string;
}

export function buildArticleSchema(props: ArticleSchemaProps) {
	return {
		'@context': 'https://schema.org',
		'@type': 'TechArticle',
		headline: props.title,
		description: props.description,
		datePublished: props.datePublished,
		...(props.dateModified && { dateModified: props.dateModified }),
		author: {
			'@type': 'Person',
			name: siteMeta.brandShort,
			url: siteMeta.siteUrl,
			jobTitle: 'Senior Full Stack Developer',
		},
		publisher: {
			'@type': 'Person',
			name: siteMeta.brandShort,
			url: siteMeta.siteUrl,
		},
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': props.canonicalUrl,
		},
		keywords: props.tags.join(', '),
		url: props.canonicalUrl,
	};
}

export function buildHowToSchema(title: string, description: string) {
	return {
		'@context': 'https://schema.org',
		'@type': 'HowTo',
		name: title,
		description,
		author: {
			'@type': 'Person',
			name: siteMeta.brandShort,
		},
	};
}

interface ServiceSchemaProps {
	title: string;
	description: string;
	canonicalUrl: string;
	skills: string[];
	isLocal?: boolean;
}

export function buildServiceSchema(props: ServiceSchemaProps) {
	return {
		'@context': 'https://schema.org',
		'@type': 'ProfessionalService',
		name: `${siteMeta.brandShort} - ${props.title}`,
		description: props.description,
		url: props.canonicalUrl,
		provider: {
			'@type': 'Person',
			name: siteMeta.brandShort,
			jobTitle: 'Senior Full Stack Developer',
			url: siteMeta.siteUrl,
			address: {
				'@type': 'PostalAddress',
				addressLocality: siteMeta.location.locality,
				addressRegion: siteMeta.location.region,
				addressCountry: siteMeta.location.country,
			},
		},
		areaServed: props.isLocal
			? [
					{ '@type': 'City', name: 'Bengaluru' },
					{ '@type': 'Country', name: 'India' },
					{ '@type': 'Place', name: 'Worldwide (Remote)' },
				]
			: { '@type': 'Place', name: 'Worldwide (Remote)' },
		serviceType: props.skills.slice(0, 5),
	};
}
