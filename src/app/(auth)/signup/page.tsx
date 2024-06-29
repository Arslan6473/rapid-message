"use client";

import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/apiResponse";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { signUpValidation } from "@/schemas/signUpSchema";
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

function SignupPage() {
  const [userName, setUserName] = useState("");
  const [isUserNameChecking, setIsUserNameChecking] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [isSignUpUser, setIsSignUpUser] = useState(false);

  const debounced = useDebounceCallback(setUserName, 400);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const checkUserNameUnique = async () => {
      if (userName) {
        setIsUserNameChecking(true);
        setUserMessage("");

        try {
          const response = await axios.post(
            `/api/users/checkUsernameUnique?userName=${userName}`
          );
          if (response.data.success) {
            setUserMessage(response.data.message);
          }
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUserMessage(
            axiosError.response?.data.message ?? "Error checking username"
          );
        } finally {
          setIsUserNameChecking(false);
        }
      }
    };

    checkUserNameUnique();
  }, [userName]);

  const form = useForm({
    resolver: zodResolver(signUpValidation),
    defaultValues: {
      userName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signUpValidation>) => {
    try {
      setIsSignUpUser(true);
      const response = await axios.post("/api/users/signup", data);
      if (response.data.success) {
        toast({
          title: "Success",
          description: response.data.message,
        });

        router.replace(`/verify/${userName}`);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const formError =
        axiosError.response?.data.message ?? "Error regestering user";

      toast({
        title: "Signup Failed",
        description: formError,
        variant: "destructive",
      });
    } finally {
      setIsSignUpUser(false);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-800">
        <div className="w-full max-w-md py-6 px-6 space-y-5 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-xl font-bold tracking-tight lg:text-5xl mb-3">
              Join Rapid Message
            </h1>
            <p className="mb-3 text-md font-normal">Sign up to start</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Username"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          debounced(e.target.value);
                        }}
                      />
                    </FormControl>
                    {isUserNameChecking && <Loader2 className="animate-spin" />}
                    {userMessage && (
                      <p
                        className={`text-sm ${
                          userMessage === "Username is unique"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                       {userMessage} 
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <p className="text-gray-200">We will send a verfication code to verify</p>
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
              <Button type="submit" disabled={isSignUpUser} className="w-full">
                {isSignUpUser ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
            <div className="text-center mt-4">
              <p>
                Already a member?{" "}
                <Link
                  href="/signin"
                  className="text-purple-600 hover:text-purple-800"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}

export default SignupPage;
