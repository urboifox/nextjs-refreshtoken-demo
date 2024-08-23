import { NextRequest, NextResponse } from "next/server";
import { API_ENDPOINT } from "./constants";

export default async function middleware(req: NextRequest) {
    const accessToken = req.cookies.get("accessToken")?.value;

    // Clone the request and set the Authorization header if the access token exists
    const requestHeaders = new Headers(req.headers);
    if (accessToken) {
        requestHeaders.set("Authorization", `Bearer ${accessToken}`);
    }

    // Create the modified request with the updated headers
    const originalRequest = new Request(req.url, {
        method: req.method,
        headers: requestHeaders,
        body: req.body,
        redirect: 'manual',  // Prevent auto-redirects
    });

    let response = await fetch(originalRequest);

    // Handle 401 Unauthorized by refreshing the token
    if (response.status === 401) {
        const refreshResponse = await fetch(`${API_ENDPOINT}/refresh`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Cookie: req.cookies.toString(),
            },
        });

        if (refreshResponse.ok) {
            const { accessToken: newAccessToken } = await refreshResponse.json();

            // Update the original request with the new access token
            requestHeaders.set("Authorization", `Bearer ${newAccessToken}`);
            const retryRequest = new Request(req.url, {
                method: req.method,
                headers: requestHeaders,
                body: req.body,
                redirect: 'manual',
            });

            // Retry the original request with the new token
            response = await fetch(retryRequest);

            // Set the new access token in the cookies
            const cookieResponse = NextResponse.next();
            cookieResponse.headers.set('Set-Cookie', `accessToken=${newAccessToken}; Path=/; HttpOnly`);
            return cookieResponse;
        } else {
            // Redirect to login if token refresh fails
            const redirectResponse = NextResponse.redirect("/login");
            redirectResponse.cookies.delete("accessToken");
            return redirectResponse;
        }
    }

    return response;
}

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/(api|trpc)(.*)",
    ],
};
