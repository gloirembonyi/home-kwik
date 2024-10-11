import { Button } from "@/components/ui/base/button";
import { Input } from "@/components/ui/Input";
import Image from "next/image";
import React from "react";

const Login = () => {
  return (
    <div className="h-screen bg-gray-200 flex items-center p-4">
      <div className="hidden lg:flex items-center justify-center flex-1 lg:basis-1/2 2xl:basis-2/3">
        <Image
          src={"/images/bg-art.png"}
          alt="bg-art"
          height={1000}
          width={1000}
          objectFit="cover"
          className=""
        />
      </div>
      <div className="bg-white flex-1 sm:basis-1/2 2xl:basis-1/3  h-[98vh] rounded-xl flex flex-col gap-6 py-10 px-12 items-center justify-center xl:justify-start">
        <Image
          src="/images/logo.png"
          alt="logo"
          height={250}
          width={250}
          className="mx-auto mt-4"
        />
        <h1 className="text-center font-bold text-3xl">Welcome Back!</h1>
        <p className="text-center text-gray-800 text-sm">Please enter your details</p>
        <Input
          id="email"
          //   label="Email"
          placeholder="  Email"
          type="text"
        />
        <Input
          id="password"
          //   label="Password"
          placeholder="Password"
          type="password"
        />
        <Button className="w-full bg-[#1b1d21] rounded-full py-6 max-w-sm">Login</Button>
      </div>
    </div>
  );
};

export default Login;
