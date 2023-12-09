export type Language = {
    name: string;
    color: string;
    size: number;
    count: number;
};

export type TopLanguages = Record<string, Language>;

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

export type EdgeNode = { color: string; name: string };
export type Edge = { size: number; node: EdgeNode };
export type Languages = { edges: Edge[] };
export type Node = { name: string; description: string; languages: Languages };
export type Repositories = { nodes: Node[] };
export type User = { repositories: Repositories };
export type Data = { user: User };
export type Errors = { type: string; message: string }[];

export type Response = { data: Data } | { errors: Errors };
