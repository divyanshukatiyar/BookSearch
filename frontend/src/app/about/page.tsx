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
        <h1 className="font-medium text-2xl text-green-400">About Us</h1>
      <div className='flex flex-col items-center gap-6 rounded-md'>
        <h3>Currently this is a one man mission. My name is Divyanshu Katiyar, I am an Astrophysicist and based in Bonn, Germany. Through this app, you can find information on your favorite book.</h3>
      </div>
    </div>
    )
}

export default page