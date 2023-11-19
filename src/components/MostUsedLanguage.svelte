<script lang="ts">
    import type { Lang } from "../utils/fetch-top-languages";
    export let totalLanguageSize: number = 0;
    export let langs: Lang[] = [];
</script>

<div class="px-6 py-4 bg-zinc-900 bg-opacity-80 rounded-sm">
    <h4 class="text-xl font-bold mb-4">Most Used Language</h4>

    <div class="flex flex-wrap gap-4 max-w-6xl">
        <noscript>
            <ol class="flex flex-wrap gap-4 max-w-6xl overflow-x-scroll">
                <li
                    class="rounded-sm border border-pink-600/50 bg-zinc-900 bg-opacity-20 backdrop-blur-sm px-4 py-2 hover:bg-opacity-50 whitespace-nowrap"
                >
                    Javascript / TypeScript
                </li>
                <li
                    class="rounded-sm border border-pink-600/50 bg-zinc-900 bg-opacity-20 backdrop-blur-sm px-4 py-2 hover:bg-opacity-50 whitespace-nowrap"
                >
                    Rust (Intermediate)
                </li>
                <li
                    class="rounded-sm border border-pink-600/50 bg-zinc-900 bg-opacity-20 backdrop-blur-sm px-4 py-2 hover:bg-opacity-50 whitespace-nowrap"
                >
                    Go lang
                </li>
            </ol>
        </noscript>

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
        {#if langs.length}
            <p class="text-xs">
                🛈 These stats are pulled from <a
                    href="https://github.com/m0hammedimran"
                >
                    Github,
                </a> and are based on the languages used in my public repositories.
            </p>
        {/if}
    </div>
</div>
