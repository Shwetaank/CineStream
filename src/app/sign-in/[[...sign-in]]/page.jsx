"use client";
import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

const SignInPage = () => {
  return (
    <div className="relative w-full h-screen">
      {/* Background Image */}
      <Image
        src="/Login-Page.jpg"
        alt="Background"
        fill
        style={{ objectFit: "cover" }}
        quality={100}
        className="z-[-1]"
      />
        <div className="absolute inset-0 bg-black opacity-30 z-[-1]" />

      {/* Page Content (including header, if any) */}
      <div className="relative w-full h-full">
        {/* Add your header here if needed */}

        {/* SignIn Component */}
        <div className="flex w-full h-full items-center justify-center">
          <SignIn />
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
