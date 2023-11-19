import axios from "axios";

export default function fetcher(variables: { login: string }, token: string) {
    return axios.post<{ data: Data } | { errors: Errors }>(
        "https://api.github.com/graphql",
        {
            query: `
            query userInfo($login: String!) {
                user(login: $login) {
                    # fetch only owner repos & not forks
                    repositories(ownerAffiliations: OWNER, isFork: false, first: 100) {
                        nodes {
                            name
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
            }
        `,
            variables,
        },
        {
            headers: { Authorization: `token ${token}` },
        },
    );
}

export type EdgeNode = {
    color: string;
    name: string;
};
export type Edge = {
    size: number;
    node: EdgeNode;
};
export type Language = { edges: Edge[] };
export type Node = { name: string; languages: Language };
export type Repositories = { nodes: Node[] };
export type User = { repositories: Repositories };
export type Data = { user: User };
export type Errors = { type: string; message: string }[];
