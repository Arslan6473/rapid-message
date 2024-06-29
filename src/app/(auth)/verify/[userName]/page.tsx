"use client";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/apiResponse";
import { useParams, useRouter } from "next/navigation";
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
import { varifyCodeValidation } from "@/schemas/varifySchema";

function VerifyUserPage() {
  const [isVerifing, setIsVerifing] = useState(false);
  const params = useParams();
  const userName = params.userName;
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof varifyCodeValidation>>({
    resolver: zodResolver(varifyCodeValidation),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof varifyCodeValidation>) => {
    try {
      setIsVerifing(true);
      const response = await axios.post("/api/users/verifycode", {
        userName,
        code: data.code,
      });
      if (response.data.success) {
        toast({
          title: "Success",
          description: response.data.message,
        });

        router.replace(`/signin`);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const formError =
        axiosError.response?.data.message ?? "Error occurred try again";

      toast({
        title: "Verification Failed",
        description: formError,
        variant: "destructive",
      });
    } finally {
      setIsVerifing(false);
    }
  };
  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-800">
        <div className="w-full max-w-md py-6 px-6 space-y-5 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-xl font-bold tracking-tight lg:text-5xl mb-3">
            Verify Your Account
            </h1>
            <p className="mb-3 text-md font-normal">Enter the verification code sent to your email</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <Input  placeholder="Verification Code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isVerifing} className="w-full">
                {isVerifing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Verify"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}

export default VerifyUserPage;
