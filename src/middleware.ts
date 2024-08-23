import { NextRequest, NextResponse } from "next/server";
import { API_ENDPOINT } from "./constants";

export default async function middleware(req: NextRequest) {
    // as described in /login.tsx here we handle the access token logic
    const accessToken = req.cookies.get("accessToken");

    // create a copy of the original requets to use it later in case it failed
    const originalRequest = new Request(req, {
        headers: new Headers(req.headers),
    });

    // here we attach the accessToken as a normal axios interceptor behaviour
    if (accessToken) {
        originalRequest.headers.set("Authorization", "Bearer " + accessToken);
    }

    // instead of returning the NextResponse.next() directly
    // 1- we recieve the requet from any page here in the middleware
    // 2- we make the request ourselves from the middleware to handle it
    // 3- then we return the response from the request we made instead of NextResponse.Next()
    let res = await fetch(originalRequest);

    // here we handle the refresh token logic
    if (res.status === 401) {
        // fetch the refresh token endpoint
        const refreshResponse = await fetch(API_ENDPOINT + "/refresh", {
            credentials: "include",
            headers: {
                // IMPORTANT you need to add the cookies here yourself, because a request from middleware.ts doesn't have cookies by default
                Cookie: req.cookies.toString(),
            },
        });

        if (refreshResponse.ok) {
            const json = await refreshResponse.json();
            // after refreshing the token, we add the new token to the originalRequest headers and re-send the request
            originalRequest.headers.set("Authorization", "Bearer " + json.accessToken);
            res = await fetch(originalRequest);
            // then we set the accessToken in our cookies, as an httpOnly cookie
            // so that we can access it in other requests
            // notice: we didn't set the cookie when we logged in, because you can't set an httpOnly cookie from the client
            // so the expected behaviour is:
            // 1- the user logs in, and gets redirected to the /profile page
            // 2- the profile page makes a request the fails and returns 401 status for the first time
            // 3- the middleware.ts hits the /refresh endpoint and gets an access token, and re-send the request
            // 4- any other request will use the access token the middleware set.
            // so basically the first ever request after login will fail, and then we get an access token and set it in cookies
            res.headers.set("Set-Cookie", `accessToken;${json.accessToken};httpOnly`);
            return res;
        } else {
            // if refreshing fails, that means the user doesn't have a refresh token, or it's not valid, then we log him out
            // or maybe you have a /logout route or page
            const res = NextResponse.redirect("/login");
            res.cookies.delete("accessToken");
            return res;
        }
    }

    return res;
}

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};
