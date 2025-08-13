import OfflineLanguages from './OfflineLanguages.svelte';

export const totalLanguageSize = 0;
export const languages = [];

const formatter = new Intl.NumberFormat('en-IN', {
	maximumFractionDigits: 2,
	minimumFractionDigits: 2,
	style: 'percent',
});
