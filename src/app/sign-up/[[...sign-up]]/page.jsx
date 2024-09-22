"use client";
import { SignUp } from "@clerk/nextjs";
import Image from "next/image";

const SignUpPage = () => {
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

      {/* Page Content */}
      <div className="relative w-full h-full">
        {/* SignUp Component */}
        <div className="flex w-full h-full items-center justify-center">
          <SignUp />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
