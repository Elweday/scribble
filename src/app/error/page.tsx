"use client"
import Error from "~/app/_components/404";
import { local } from "~/constants/game"; 
import Link from "next/link";

export default function Home() {
    const defaultErrMsg = "Page not found"
    return (
        <main className="w-full h-full flex place-content-center place-items-center flex-col gap-4">
            <div className="place-self-center items-center flex flex-col gap-3  ">
                <Error message={local.get("error") || defaultErrMsg} />
                <Link className="px-4 text-center w-40 py-4 rounded-lg  hover:bg-red-800 hover:scale-[1.02] transition-all bg-red-700" href="/">Go Home</Link>
            </div>
        </main>
    );
}
