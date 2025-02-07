import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";

function withOpacity(variableName: string) {
    return ({ opacityValue }: Partial<{ opacityVariable: string; opacityValue: number }>) => {
        if (opacityValue !== undefined) {
            return `rgba(var(${variableName}), ${opacityValue})`;
        }
        return `rgb(var(${variableName}))`;
    };
}

const config = {
    content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
    darkMode: "class",
    theme: {
        extend: {
            textColor: {
                skin: {
                    base: withOpacity("--color-text-base") as unknown as string,
                    accent: withOpacity("--color-accent") as unknown as string,
                    inverted: withOpacity("--color-fill") as unknown as string,
                },
            },
            backgroundColor: {
                skin: {
                    fill: withOpacity("--color-fill") as unknown as string,
                    accent: withOpacity("--color-accent") as unknown as string,
                    inverted: withOpacity("--color-text-base") as unknown as string,
                    card: withOpacity("--color-card") as unknown as string,
                    "card-muted": withOpacity("--color-card-muted") as unknown as string,
                },
            },
            outlineColor: {
                skin: {
                    fill: withOpacity("--color-accent") as unknown as string,
                },
            },
            borderColor: {
                skin: {
                    line: withOpacity("--color-border") as unknown as string,
                    fill: withOpacity("--color-text-base") as unknown as string,
                    accent: withOpacity("--color-accent") as unknown as string,
                },
            },
            fill: {
                skin: {
                    base: withOpacity("--color-text-base") as unknown as string,
                    accent: withOpacity("--color-accent") as unknown as string,
                },
                transparent: "transparent",
            },
            maxHeight: {
                "fit-screen": "calc(100vh - 80px)",
            },
            minHeight: {
                "fit-screen": "clamp(calc(100vh - 80px), 90vh, 100vh)",
            },
        },
    },
    plugins: [typography],
} satisfies Config;

export default config;
