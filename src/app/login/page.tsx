"use client";
import { API_ENDPOINT } from "@/constants";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";

export default function LoginPage() {
    const router = useRouter();

    // simple form handling
    const initialFormData = { username: "", password: "" };
    const [data, setData] = useState(initialFormData);
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    // IMPORTANT you should make the login request, or whatever request that makes the server set a cookie in the browser from the client side
    // or make it on the server ex: (server actions), but you would need to parse the cookie from the response and set it yourself
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const payload = { username: data.username, password: data.password };
        const res = await fetch(API_ENDPOINT + "/login", {
            method: "POST",
            // IMPORTANT you must include the credentials "include" to make the browser accept the cookies from the server
            credentials: "include",
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (res.ok) {
            const json = await res.json();
            // do what ever you want with the user data, maybe set it in a store
            // but we WON'T set the access token ourselves
            //
            // but why? because in a normal react way, you normally want the accessToken on the client to send it with the request.
            // but in this method we are attaching the accessToken on the request from the middleware, which is on the server
            // so we don't need to access it or set it on the client (more details in middleware.ts)

            if (json.success) {
                router.push("/profile");
            }
        }
    };
    return (
        <form onSubmit={handleSubmit}>
            <input
                value={data.username}
                onChange={handleChange}
                className="text-black"
                type="text"
                name="username"
                placeholder="username"
            />
            <input
                value={data.password}
                onChange={handleChange}
                className="text-black"
                type="password"
                name="password"
                placeholder="password"
            />
            <button type="submit">Login</button>
        </form>
    );
}
