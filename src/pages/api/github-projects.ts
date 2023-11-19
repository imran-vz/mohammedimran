import { createClient } from "@vercel/kv";
import type { APIRoute } from "astro";
import fetchTopLanguages, {
    type TopLangData,
} from "../../utils/fetch-top-languages";

export const GET: APIRoute = async () => {
    try {
        const kv = createClient({
            url: import.meta.env.KV_REST_API_URL,
            token: import.meta.env.KV_REST_API_TOKEN,
        });

        let response: TopLangData | null = null;
        const cacheResponse = await kv.hget<TopLangData>(
            "github-projects",
            "m0hammedimran",
        );

        if (!cacheResponse) {
            response = await fetchTopLanguages("m0hammedimran", [
                "angualar-todo-firebase",
                "protoezy-graphy-mock",
                "react-native-todo-app",
                "headlessui-react-type-error-demo",
                "wallpapers",
                "Final-Year-Project",
                "libsol",
            ]);

            await kv.hset("github-projects", { m0hammedimran: response });
            await kv.expire("github-projects", 60 * 60 * 24 * 7);
        }

        response = response || cacheResponse;
        return new Response(JSON.stringify(response), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.log(error);
        return new Response(
            JSON.stringify({ message: "Internal Server Error" }),
            { status: 500 },
        );
    }
};
