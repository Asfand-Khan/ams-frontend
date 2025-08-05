"use client";

import React, { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/shadcn/button";
import { Input } from "../shadcn/input";

import { Eye, EyeOff, Loader2 } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginSchemaType } from "@/schemas/loginSchema";
import { useMutation } from "@tanstack/react-query";
import { axiosFunction } from "@/utils/axiosFunction";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LoginResponseType } from "@/types/loginTypes";
import { sendOtpResponseType } from "@/types/sendOtpTypes";
import useUsernameStore from "@/hooks/useUsername";

const LoginForm = () => {
  // hooks
  const router = useRouter();
  const [toggleEye, setToggleEye] = useState(false);
  const setUsername = useUsernameStore((state) => state.setUsername);

  // login form
  const {
    handleSubmit: handleLoginSubmit,
    formState: { errors },
    register,
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const submitLogin = (data: LoginSchemaType) => {
    useLoginMutation.mutate(data);
  };

  // Send OTP Mutation
  const useSendOtpMutation = useMutation<
    sendOtpResponseType,
    AxiosError<sendOtpResponseType>,
    { username: string }
  >({
    mutationFn: (record) => {
      return axiosFunction({
        method: "POST",
        urlPath: "/auth/send-otp",
        data: record,
        isServer: true,
      });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message);
      console.log("Send Otp Mutation Error:", err);
    },
    onSuccess: () => {
      toast.success("Otp Sent Successfully!");
      router.push("/otp");
    },
  });

  // login mutation
  const useLoginMutation = useMutation<
    LoginResponseType,
    AxiosError<LoginResponseType>,
    LoginSchemaType
  >({
    mutationFn: (record) => {
      return axiosFunction({
        method: "POST",
        urlPath: "/auth/login",
        data: record,
        isServer: true,
      });
    },
    onError: (err) => {
      const message = err.response?.data?.message;
      toast.error(message);
      console.log("Login Mutation Error:", err);
    },
    onSuccess: (data) => {
      toast.success("Authenticated! Sending OTP...");
      setUsername(data.payload[0].username);
      useSendOtpMutation.mutate({ username: data.payload[0].username });
    },
  });

  return (
    <div className={cn("flex flex-col gap-6")}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-4xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-md text-balance">
          Welcome to the Orio Attendance
        </p>
      </div>

      <form onSubmit={handleLoginSubmit(submitLogin)} className="grid gap-6">
        <div className="grid gap-2">
          <Input
            id="email"
            type="text"
            {...register("username")}
            placeholder="Username"
          />
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username.message}</p>
          )}
        </div>
        <div className="grid gap-2">
          <div className="relative">
            <Input
              id="password"
              type={toggleEye ? "text" : "password"}
              {...register("password")}
              placeholder="Password"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer"
              onClick={() => setToggleEye((prevState) => !prevState)}
            >
              {toggleEye ? <Eye /> : <EyeOff />}
            </Button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>
        <Button
          type="submit"
          className="w-full cursor-pointer"
          size="lg"
          disabled={useLoginMutation.isPending}
        >
          Login
          {(useLoginMutation.isPending || useSendOtpMutation.isPending) && (
            <span className="animate-spin">
              <Loader2 />
            </span>
          )}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
