"use client";

import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import * as z from "zod";
import { ApiResponse } from "@/types/apiResponse";
import Link from "next/link";
import { redirect, useParams } from "next/navigation";
import { messageValidation } from "@/schemas/messageSchema";
import { useSession } from "next-auth/react";

export default function SendMessage() {
  const { data: session } = useSession();


  if(!session?.user) redirect('/')

  const messageFrom = session?.user.userName;
  
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams<{ username: string }>();
  const userName = params.username;

  

  const form = useForm<z.infer<typeof messageValidation>>({
    resolver: zodResolver(messageValidation),
  });

  const messageContent = form.watch("content");

  const onSubmit = async (data: z.infer<typeof messageValidation>) => {
   console.log(data)
    try {
        setIsLoading(true);
      const response = await axios.post<ApiResponse>(
        "/api/messages/send-message",
        {
          ...data,
          from:messageFrom,
          userName,
        }
      );

      toast({
        title: response.data.message,
        variant: "default",
      });
      form.reset({ ...form.getValues(), content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Failed to sent message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl min-h-[61.7vh]">
      <h1 className="text-4xl font-bold mb-10 text-center">
        Profile Link
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Message to @{userName}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your message here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading || !messageContent}>
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>

    </div>
  );
}
