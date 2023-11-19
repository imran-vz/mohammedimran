import CustomError from "./CustomError";
import fetcher from "./fetcher";
import { isErrorResponse } from "./retryer";
import { wrapTextMultiline } from "./utils";

export type Lang = {
    name: string;
    color: string;
    size: number;
};

export type TopLangData = Record<string, Lang>;

/**
 * Fetch top languages for a given username.
 *
 * @param {string} username GitHub username.
 * @param {string[]} exclude_repo List of repositories to exclude.
 * @param {number} size_weight Weightage to be given to size.
 * @param {number} count_weight Weightage to be given to count.
 * @returns {Promise<TopLangData>} Top languages data.
 */
export default async function fetchTopLanguages(
    username: string,
    exclude_repo: string[] = [],
    size_weight: number = 1,
    count_weight: number = 0,
): Promise<TopLangData> {
    if (!username) {
        throw new Error("missing username");
    }

    const res = await fetcher(
        { login: username },
        import.meta.env.GITHUB_API_TOKEN,
    );

    if (isErrorResponse(res?.data)) {
        if (!res)
            throw new CustomError(
                "Something went wrong while trying to retrieve the language data using the GraphQL API.",
                CustomError.GRAPHQL_ERROR,
            );
        if (res.data.errors[0].type === "NOT_FOUND") {
            throw new CustomError(
                res.data.errors[0].message || "Could not fetch user.",
                CustomError.USER_NOT_FOUND,
            );
        }
        if (res.data.errors[0].message) {
            throw new CustomError(
                wrapTextMultiline(res.data.errors[0].message, 90, 1)[0],
                res?.statusText as any,
            );
        }
        throw new CustomError(
            "Something went wrong while trying to retrieve the language data using the GraphQL API.",
            CustomError.GRAPHQL_ERROR,
        );
    } else {
        let repoNodes = res?.data.data.user.repositories.nodes;

        if (!repoNodes) return {};

        let repoToHide = new Map<string, boolean>();

        // populate repoToHide map for quick lookup
        // while filtering out
        if (exclude_repo) {
            exclude_repo.forEach((repoName) => {
                repoToHide.set(repoName, true);
            });
        }

        // filter out repositories to be hidden
        repoNodes = repoNodes.filter((name) => !repoToHide.has(name.name));

        let repoCount = 0;

        const nodes: Record<
            string,
            { name: string; color: string; size: number; count: number }
        > = repoNodes
            ?.filter((node) => node.languages.edges.length > 0)
            // flatten the list of language nodes
            .reduce(
                (acc, curr) => curr.languages.edges.concat(acc),
                [] as any[],
            )
            .reduce((acc, prev) => {
                // get the size of the language (bytes)
                let langSize = prev.size;

                // if we already have the language in the accumulator
                // & the current language name is same as previous name
                // add the size to the language size and increase repoCount.
                if (
                    acc[prev.node.name] &&
                    prev.node.name === acc[prev.node.name].name
                ) {
                    langSize = prev.size + acc[prev.node.name].size;
                    repoCount += 1;
                } else {
                    // reset noderepoCount to 1
                    // language must exist in at least one repo to be detected
                    repoCount = 1;
                }
                return {
                    ...acc,
                    [prev.node.name]: {
                        name: prev.node.name,
                        color: prev.node.color,
                        size: langSize,
                        count: repoCount,
                    },
                };
            }, {});

        Object.keys(nodes).forEach((name) => {
            // comparison index calculation
            nodes[name].size =
                Math.pow(nodes[name].size, size_weight) *
                Math.pow(nodes[name].count, count_weight);
        });

        const topLangs = Object.keys(nodes)
            .sort((a, b) => nodes[b].size - nodes[a].size)
            .reduce((result, key) => {
                result[key] = nodes[key];
                return result;
            }, {} as TopLangData);

        return topLangs;
    }
}

export type languages =
    | "TypeScript"
    | "Shell"
    | "JavaScript"
    | "HTML"
    | "CSS"
    | "Svelte"
    | "Astro"
    | "Rust"
    | "Go"
    | "Vim Script"
    | "Dockerfile"
    | "MDX"
    | "AutoHotkey"
    | "Makefile";
