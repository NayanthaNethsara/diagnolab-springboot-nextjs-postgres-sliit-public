"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (result?.error) {
      toast({
        title: "Error",
        description: "Invalid username or password",
        variant: "destructive",
      });
    } else {
      router.push("/LabManagement");
    }

    setIsLoading(false);
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[380px] gap-6">
          <div className="grid gap-4 text-left">
            <div>
              <span className="text-3xl font-bold">Welcome to </span>
              <span className="text-3xl font-extrabold text-cyan-700 dark:text-cyan-500">
                MedHub
              </span>
            </div>
            <p className="text-left text-muted-foreground">
              Streamline Administrative Tasks and Improve Patient Services with
              MedHub
            </p>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Amali Amanda"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-12 px-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 justify-start items-center gap-3 inline-flex focus:border-cyan-500 focus:ring-cyan-500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 px-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 justify-start items-center gap-3 inline-flex focus:border-cyan-500 focus:ring-cyan-500"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-cyan-700 hover:bg-cyan-600 text-white dark:bg-cyan-600 dark:hover:bg-cyan-500 shadow-lg hover:shadow-cyan-500/50 transition-all duration-200"
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </div>
      </div>
      <div className="hidden lg:block">
        <Image
          src="/images/login-page.jpg"
          alt="Login Page Cover"
          width={1920}
          height={1080}
          className="h-full w-full rounded-l-lg drop-shadow-2xl object-cover object-[30%]"
        />
      </div>
    </div>
  );
}
