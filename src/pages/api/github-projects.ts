import type { APIRoute } from "astro";
import fetchTopLanguages from "../../utils/fetch-top-languages";

export const GET: APIRoute = async () => {
    try {
        const response = await fetchTopLanguages("m0hammedimran", [
            "angualar-todo-firebase",
            "protoezy-graphy-mock",
            "react-native-todo-app",
            "headlessui-react-type-error-demo",
            "wallpapers",
            "Final-Year-Project",
            "libsol",
        ]);
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
