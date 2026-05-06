import { siteMeta } from './siteMeta';

export const primaryNavLinks = [
	{ href: '/projects', label: 'Projects' },
	{ href: '/skills', label: 'Skills' },
	{ href: '/blog', label: 'Blog' },
	{ href: siteMeta.social.github, label: 'GitHub', external: true },
	{ href: `mailto:${siteMeta.email}`, label: 'Contact' },
] as const;

export const footerSocialLinks = [
	{ href: siteMeta.social.github, label: 'GitHub', type: 'github' },
	{ href: siteMeta.social.linkedin, label: 'LinkedIn', type: 'linkedin' },
	{ href: siteMeta.social.twitterUrl, label: 'Twitter', type: 'twitter' },
] as const;
