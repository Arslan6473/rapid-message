"use client";
import { Button } from "./ui/button";
import { useToast } from "@/components/ui/use-toast";
import axios, { AxiosError } from "axios";
import dayjs from "dayjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { X } from "lucide-react";
import { Message } from "@/models/userModel";
import { ApiResponse } from "@/types/apiResponse";
import Link from "next/link";
import { useEffect } from "react";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: any) => void;
};

function MessageCart({ message, onMessageDelete }: MessageCardProps) {
  const { toast } = useToast();

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete(
        `/api/messages/deletemessage/${message._id}`
      );
      toast({
        title: response.data.message,
      });
      onMessageDelete(message._id);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Failed to delete message",
        variant: "destructive",
      });
    }
  };

  let baseUrl = "";
  useEffect(() => {
    if (typeof window !== "undefined") {
      baseUrl = `${window.location.protocol}//${window.location.host}`;
    }
  }, []);
  return (
    <>
      <Card className="card-bordered">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex flex-col ">
              {" "}
              <p className="text-xs mb-1">click on username to send message</p>
              <CardTitle>
                Message From{" "}
                <Link href={`${baseUrl}/u/${message.from}`}>
                  {" "}
                  @{message.from}
                </Link>
              </CardTitle>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <X className="w-5 h-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    this message.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteConfirm}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <div className="pt-2">
            <p className="text-sm">{message.content}</p>
            <p className="text-xs text-muted-foreground mt-2">
              {dayjs(message.createdAt).format("MMM D, YYYY h:mm A")}
            </p>
          </div>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </>
  );
}

export default MessageCart;
