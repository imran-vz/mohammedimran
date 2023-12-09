<script lang="ts">
    import type { Language } from "../utils/fetch-top-languages";
    import OfflineLanguages from "./OfflineLanguages.svelte";
    export let totalLanguageSize: number = 0;
    export let langs: Language[] = [];
</script>

<div class="px-6 py-4 bg-skin-card bg-opacity-80 rounded-sm">
    <h2 class="text-xl font-bold mb-4">Most Used Language</h2>

    <div class="flex flex-wrap gap-4 max-w-6xl">
        <noscript>
            <OfflineLanguages />
        </noscript>

        {#if langs.length === 0 && totalLanguageSize === 0}
            <OfflineLanguages />
        {:else}
            {#each Object.values(langs) as value}
                <div
                    class="flex gap-2 items-center px-4 py-2 border border-skin-accent rounded-sm snap-center"
                >
                    <div
                        class="w-3 h-3 rounded-full"
                        style="background-color: {value.color}"
                    />
                    <p class="whitespace-nowrap text-skin-base">
                        {value.name} - {(
                            (value.size / totalLanguageSize) *
                            100
                        ).toFixed(2)} %
                    </p>
                </div>
            {/each}
            <p class="text-xs">
                🛈 These stats are pulled from <a
                    href="https://github.com/m0hammedimran"
                    class="focus-outline focus-visible:outline-1"
                >
                    Github</a
                >, and are based on the languages used in my public
                repositories.
            </p>
        {/if}
    </div>
</div>
