import { AxiosError, type AxiosResponse } from "axios";
import fetcher, { type Data, type Errors } from "./fetcher";
import CustomError from "./CustomError";
type fetcherType = typeof fetcher;

const RETRIES = 7;
export async function retryer(
    fetcher: fetcherType,
    variables: { login: string },
    retries = 0,
) {
    if (!RETRIES) {
        throw new CustomError(
            "No GitHub API tokens found",
            CustomError.NO_TOKENS,
        );
    }
    if (retries > RETRIES) {
        throw new CustomError(
            "Downtime due to GitHub API rate limiting",
            CustomError.MAX_RETRY,
        );
    }
    try {
        // try to fetch with the first token since RETRIES is 0 index i'm adding +1
        let response = await fetcher(
            variables,
            import.meta.env.GITHUB_API_TOKEN as string,
        );

        const isRateExceeded =
            isErrorResponse(response?.data) &&
            response.data.errors &&
            response.data.errors[0].type === "RATE_LIMITED";

        // if rate limit is hit increase the RETRIES and recursively call the retryer
        // with username, and current RETRIES
        if (isRateExceeded) {
            console.log(`retry Failed`);
            retries++;
            // directly return from the function
            return retryer(fetcher, variables, retries);
        }

        // finally return the response
        return response;
    } catch (err) {
        if (err instanceof AxiosError) {
            // also checking for bad credentials if any tokens gets invalidated
            const isBadCredential =
                err.response?.data &&
                err.response?.data.message === "Bad credentials";
            const isAccountSuspended =
                err.response?.data &&
                err.response?.data.message ===
                    "Sorry. Your account was suspended.";

            if (isBadCredential || isAccountSuspended) {
                console.log(`PAT_${retries + 1} Failed`);
                retries++;
                // directly return from the function
                return retryer(fetcher, variables, retries);
            } else {
                return err.response as
                    | AxiosResponse<{ data: Data } | { errors: Errors }, any>
                    | undefined;
            }
        }

        throw err;
    }
}
export function isErrorResponse(input: unknown): input is { errors: Errors } {
    if (input && typeof input === "object" && "errors" in input) return true;
    return false;
}
