/** Canonical hex color map for GitHub Linguist languages. */
export const LANGUAGE_COLORS: Record<string, string> = {
	TypeScript: '#3178C6',
	JavaScript: '#F7DF1E',
	Go: '#00ADD8',
	Python: '#3776AB',
	Rust: '#DEA584',
	Java: '#007396',
	C: '#555555',
	'C++': '#f34b7d',
	HTML: '#E34F26',
	CSS: '#1572B6',
	Shell: '#89e051',
	Makefile: '#427819',
	Dockerfile: '#384d54',
	Vue: '#41B883',
	Svelte: '#FF3E00',
	React: '#61DAFB',
	Unknown: '#858585',
};

/** Tailwind class map for language badges in project cards. */
export const LANGUAGE_BADGE_CLASSES: Record<string, string> = {
	TypeScript: 'bg-[#3178C6]',
	JavaScript: 'bg-[#F7DF1E] text-black',
	React: 'bg-[#61DAFB] text-black',
	Go: 'bg-[#00ADD8]',
	Python: 'bg-[#3776AB]',
	Rust: 'bg-[#DEA584]',
	Java: 'bg-[#007396]',
	HTML: 'bg-[#E34F26]',
	CSS: 'bg-[#1572B6]',
	Unknown: 'bg-gray-500',
};
