import Link from "next/link";

export default function Home() {
    return (
        <div className="flex items-center justify-center gap-10 min-h-screen flex-col">
            <h1 className="text-4xl">Refresh token and access token test</h1>

            <div className="flex items-center gap-5">
                <Link href="/profile">Profile</Link>
                <Link href="/login">login</Link>
            </div>
        </div>
    );
}
