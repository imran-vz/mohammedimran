import axios from "axios";
import type { Response } from "../types";

const query = `query userInfo($login: String!) {
    user(login: $login) {
        repositories(
            ownerAffiliations: OWNER
            isFork: false
            first: 100
            privacy: PUBLIC
            orderBy: {
            direction: DESC
            field: UPDATED_AT
            }
        ) {
            nodes {
                name
                description
                languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
                    edges {
                        size
                        node {
                            color
                            name
                        }
                    }
                }
            }
        }
    }
}`;

export default function fetcher(variables: { login: string }, token: string) {
	const payload = { query, variables };
	return axios<Response>({
		url: "https://api.github.com/graphql",
		method: "POST",
		data: payload,
		headers: { Authorization: `token ${token}` },
	});
}
