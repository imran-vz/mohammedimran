import { siteMeta } from './siteMeta';

export const primaryNavLinks = [
	{ href: '/', label: 'Home' },
	{ href: '/projects', label: 'Projects' },
	{ href: '/skills', label: 'Skills' },
	{ href: '/blog', label: 'Blog' },
	{ href: '/#contact', label: 'Contact' },
] as const;

export const landingNavLinks = [
	{ href: '/blog', label: 'Blog' },
	{ href: siteMeta.social.github, label: 'GitHub', external: true },
	{ href: siteMeta.social.linkedin, label: 'LinkedIn', external: true },
	{ href: `mailto:${siteMeta.email}`, label: 'Contact' },
] as const;

export const footerSocialLinks = [
	{ href: siteMeta.social.github, label: 'GitHub', type: 'github' },
	{ href: siteMeta.social.linkedin, label: 'LinkedIn', type: 'linkedin' },
	{ href: siteMeta.social.twitterUrl, label: 'Twitter', type: 'twitter' },
] as const;
