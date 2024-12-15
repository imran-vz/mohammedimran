<script lang="ts">
    import type { Language } from '../types';
    import OfflineLanguages from './OfflineLanguages.svelte';

    export let totalLanguageSize = 0;
    export let languages: Language[] = [];

    const formatter = Intl.NumberFormat('en-IN', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
        style: 'percent',
    });
</script>

<div class="px-6 py-4 bg-skin-card bg-opacity-80 rounded-sm">
    <h2 class="text-xl font-bold mb-4">Most Used Language</h2>

    <div class="flex flex-wrap flex-col gap-4 max-w-6xl">
        <noscript>
            <OfflineLanguages />
        </noscript>

        {#if languages.length === 0 && totalLanguageSize === 0}
            <OfflineLanguages />
        {:else}
            <div class="flex flex-wrap gap-4">
                {#each languages as language}
                    <div class="flex gap-2 items-center px-4 py-2 border border-skin-accent rounded snap-center">
                        <div class="w-3 h-3 rounded-full" style="background-color: {language.color}"></div>
                        <p class="whitespace-nowrap text-skin-base">
                            {language.name} - {formatter.format(language.size / totalLanguageSize)}
                        </p>
                    </div>
                {/each}
            </div>

            <p class="text-xs inline-flex items-end gap-1">
                <svg class="w-4 h-4 bg-skin-fill" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                    ><path
                        fill="currentColor"
                        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"
                    /><path fill="currentColor" d="M11 11h2v6h-2zm0-4h2v2h-2z" /></svg
                >
                <span>
                    These stats are pulled from
                    <a href="https://github.com/m0hammedimran" class="focus-outline focus-visible:outline-1">
                        Github</a
                    >, and are based on the languages used in my public repositories.
                </span>
            </p>
        {/if}
    </div>
</div>
