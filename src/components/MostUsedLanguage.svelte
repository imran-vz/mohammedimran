<script lang="ts">
    import { onMount } from "svelte";
    import type { Lang, TopLangData } from "../utils/fetch-top-languages";
    import { trimTopLanguages } from "../utils/utils";

    let data: TopLangData | null = null;
    let totalLanguageSize: number = 0;
    let langs: Lang[] = [];
    onMount(async () => {
        try {
            const response = await fetch(
                new URL("/api/github-projects", window.location.href).toString()
            );
            data = await response.json();
            if (!data) return;
            const topLangs = trimTopLanguages(data, 10, [
                "Vim Script",
                "AutoHotkey",
                "Makefile",
                "Shell",
                "MDX",
            ]);
            totalLanguageSize = topLangs.totalLanguageSize;
            langs = topLangs.langs;
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    });
</script>

<div class="px-6 py-4 bg-zinc-900 bg-opacity-80 rounded-sm">
    <h4 class="text-xl font-bold mb-4">Most Used Languauge</h4>

    <div class="flex flex-wrap gap-4 max-w-6xl">
        {#each Object.values(langs) as value}
            <div
                class="flex gap-2 items-center px-4 py-2 border border-pink-600/50 rounded-sm snap-center"
            >
                <div
                    class="w-3 h-3 rounded-full"
                    style="background-color: {value.color}"
                />
                <p class="whitespace-nowrap">
                    {value.name} - {(
                        (value.size / totalLanguageSize) *
                        100
                    ).toFixed(2)} %
                </p>
            </div>
        {/each}
    </div>
</div>
