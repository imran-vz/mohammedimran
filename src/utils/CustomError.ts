export const TRY_AGAIN_LATER = "Please try again later";

export const SECONDARY_ERROR_MESSAGES = {
    MAX_RETRY:
        "You can deploy own instance or wait until public will be no longer limited",
    NO_TOKENS:
        "Please add an env variable called PAT_1 with your GitHub API token in vercel",
    USER_NOT_FOUND: "Make sure the provided username is not an organization",
    GRAPHQL_ERROR: TRY_AGAIN_LATER,
    GITHUB_REST_API_ERROR: TRY_AGAIN_LATER,
    WAKATIME_USER_NOT_FOUND: "Make sure you have a public WakaTime profile",
} as const;

export default class CustomError extends Error {
    type: string;
    secondaryMessage: any;

    /**
     * @param {string} message Error message.
     * @param {string} type Error type.
     */
    constructor(message: string, type: keyof typeof SECONDARY_ERROR_MESSAGES) {
        super(message);
        this.type = type;
        this.secondaryMessage = SECONDARY_ERROR_MESSAGES[type] || type;
    }

    static MAX_RETRY = "MAX_RETRY" as const;
    static NO_TOKENS = "NO_TOKENS" as const;
    static USER_NOT_FOUND = "USER_NOT_FOUND" as const;
    static GRAPHQL_ERROR = "GRAPHQL_ERROR" as const;
    static GITHUB_REST_API_ERROR = "GITHUB_REST_API_ERROR" as const;
    static WAKATIME_ERROR = "WAKATIME_ERROR" as const;
}
