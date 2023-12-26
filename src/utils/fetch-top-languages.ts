import type { Edge, TopLanguages } from "../types";
import CustomError from "./CustomError";
import fetcher from "./fetcher";
import { isErrorResponse } from "./retryer";
import { wrapTextMultiline } from "./utils";

/**
 * Fetch top languages for a given username.
 *
 * @param {string} username GitHub username.
 * @param {string[]} exclude_repo List of repositories to exclude.
 * @param {number} size_weight weightage to be given to size.
 * @param {number} count_weight weightage to be given to count.
 * @returns {Promise<TopLanguages>} Top languages data.
 */
export default async function fetchTopLanguages(
	username: string,
	exclude_repo: string[] = [],
	size_weight = 1,
	count_weight = 0,
): Promise<TopLanguages> {
	if (!username) {
		throw new Error("missing username");
	}

	const res = await fetcher({ login: username }, import.meta.env.GITHUB_API_TOKEN);

	if (isErrorResponse(res?.data)) {
		if (!res)
			throw new CustomError(
				"Something went wrong while trying to retrieve the language data using the GraphQL API.",
				CustomError.GRAPHQL_ERROR,
			);
		if (res.data.errors[0].type === "NOT_FOUND") {
			throw new CustomError(res.data.errors[0].message || "Could not fetch user.", CustomError.USER_NOT_FOUND);
		}
		if (res.data.errors[0].message) {
			throw new CustomError(
				wrapTextMultiline(res.data.errors[0].message, 90, 1)[0],
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				res?.statusText as any,
			);
		}
		throw new CustomError(
			"Something went wrong while trying to retrieve the language data using the GraphQL API.",
			CustomError.GRAPHQL_ERROR,
		);
	}

	let repoNodes = res?.data.data.user.repositories.nodes;
	if (!repoNodes) return {};
	const repoToHide = new Set(exclude_repo);

	// filter out repositories to be hidden
	repoNodes = repoNodes.filter((name) => !repoToHide.has(name.name));

	let repoCount = 0;

	const nodes = repoNodes
		?.filter((node) => node.languages.edges.length > 0)
		// flatten the list of language nodes
		.reduce((acc, curr) => curr.languages.edges.concat(acc), [] as Edge[])
		.reduce((acc, prev) => {
			// get the size of the language (bytes)
			let langSize = prev.size;
			const prevNodeName = prev.node.name;
			const node = acc[prevNodeName];
			// if we already have the language in the accumulator
			// & the current language name is same as previous name
			// add the size to the language size and increase repoCount.
			if (node && prevNodeName === node.name) {
				langSize = prev.size + node.size;
				repoCount += 1;
			} else {
				// reset repoCount to 1
				// language must exist in at least one repo to be detected
				repoCount = 1;
			}
			acc[prevNodeName] = {
				name: prevNodeName,
				color: prev.node.color,
				size: langSize,
				count: repoCount,
			};

			return acc;
		}, {} as TopLanguages);

	for (const name of Object.keys(nodes)) {
		nodes[name].size = nodes[name].size ** size_weight * nodes[name].count ** count_weight;
	}

	const topLangs = Object.keys(nodes)
		.sort((a, b) => nodes[b].size - nodes[a].size)
		.reduce((result, key) => {
			result[key] = nodes[key];
			return result;
		}, {} as TopLanguages);

	return topLangs;
}
