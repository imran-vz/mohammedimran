const primaryColorScheme = "";
let currentTheme = localStorage.getItem("theme");
function getPreferTheme() {
	return (
		currentTheme ||
		primaryColorScheme ||
		(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
	);
}
let themeValue = getPreferTheme();
function setPreference(themeValue) {
	localStorage.setItem("theme", themeValue), reflectPreference();
}
function reflectPreference() {
	document.firstElementChild.setAttribute("data-theme", themeValue);
	document.querySelector("#theme-btn")?.setAttribute("aria-label", themeValue);
	const body = document.body;
	if (body) {
		const backgroundColor = window.getComputedStyle(body).backgroundColor;
		document.querySelector("meta[name='theme-color']")?.setAttribute("content", backgroundColor);
	}
}
reflectPreference();

window.onload = () => {
	function swapTheme() {
		reflectPreference();
		document.querySelector("#theme-btn")?.addEventListener("click", () => {
			themeValue = themeValue === "light" ? "dark" : "light";
			setPreference(themeValue);
		});
	}

	swapTheme();
	document.addEventListener("astro:after-swap", swapTheme);
};

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", ({ matches }) => {
	themeValue = matches ? "dark" : "light";
	setPreference(themeValue);
});

