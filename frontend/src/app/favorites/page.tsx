import Link from "next/link";
import type { Metadata } from "next";
import { useRouter } from "next/router";
import { FC } from "react";

export const metadata: Metadata = {
    title: "About Us",
    description: "Open-source app which lets you find info on your favorite book."
}

const page: FC = () => {
    return (
    <div className='flex flex-col container max-w-7xl mx-auto mt-12 items-center'>
        <h1 className="font-medium text-2xl text-blue-400">Favorites</h1>
    </div>
    )
}

export default page