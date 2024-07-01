"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signInValidation } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';

function SigninPage() {
  const router = useRouter();
  const [isSignInUser, setIsSignInUser] = useState(false);

  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(signInValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInValidation>) => {
    setIsSignInUser(true);
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect:false
    });

    if (result?.error) {
      toast({
        title: "Signin Failed",
        description: "Incorrect email or password",
        variant: "destructive",
      });
     
    }

    if (result?.ok) {
      toast({
        title: "Success",
        description: "User signin successfully",
      });
      router.replace('/dashboard');
    }

    setIsSignInUser(false);
  };
  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-800">
        <div className="w-full max-w-md py-6 px-6 space-y-5 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-xl font-bold tracking-tight lg:text-5xl mb-3">
              Welcome to Rapid Message
            </h1>
            <p className="mb-3 text-md font-normal">Sign in to start</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSignInUser} className="w-full">
                {isSignInUser ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
            <div className="text-center mt-4">
              <p>
                Not a member?{" "}
                <Link
                  href="/signup"
                  className="text-purple-600 hover:text-purple-800"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}

export default SigninPage;
