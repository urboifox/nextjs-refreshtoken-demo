import { cookies } from "next/headers";
import Link from "next/link";

// example request that needs an access token
export default async function ProfilePage() {
    // even though this request is for an internal route, but theres no /api/profile in our app
    // so the request will be redirected to API_ENDPOINT/profile (more info at next.config.mjs)
    const res = await fetch("/api/profile", {
        headers: {
            // you should send the cookies with the requests from server side, so that it reaches the middleware.ts.
            // put in mind that this makes this route dynamic, meaning that next will pre-render it on each request.
            Cookie: cookies().toString(),
        },
    });

    const json = await res.json();

    return (
        <div>
            <Link href="/">go Home</Link>
            {JSON.stringify(json)}
        </div>
    );
}
