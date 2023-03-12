/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    darkMode: 'class',
    theme: {
        extend: {
            maxHeight: {
                'fit-screen': 'calc(100vh - 80px)',
            },
            minHeight: {
                'fit-screen': 'clamp(calc(100vh - 80px), 90vh, 100vh)',
            },
        },
    },
    plugins: [require('@tailwindcss/typography')],
};
