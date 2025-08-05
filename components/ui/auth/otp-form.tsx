"use client";

import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/shadcn/input-otp";
import { useMutation } from "@tanstack/react-query";
import { axiosFunction } from "@/utils/axiosFunction";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { otpSchema, OtpSchemaType } from "@/schemas/otpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { VerifyOtpResponse } from "@/types/verifyOtpTypes";
import useUsernameStore from "@/hooks/useUsername";
import { setCookie } from "cookies-next";

const OtpForm = () => {
  const router = useRouter();
  const username = useUsernameStore((state) => state.username);

  // Verify Otp
  const {
    handleSubmit: handleVerifyOtpSubmit,
    formState: { errors },
    setValue,
    control,
    trigger,
  } = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      username: "",
      otp: "",
    },
  });

  const useVerifyOtpMutation = useMutation<
    VerifyOtpResponse,
    AxiosError<VerifyOtpResponse>,
    { username: string; otp: string }
  >({
    mutationFn: (record) => {
      return axiosFunction({
        method: "POST",
        urlPath: "/auth/verify-otp",
        data: {
          username: record.username,
          otp: +record.otp,
        },
        isServer: true,
      });
    },
    onMutate: () => {
      toast.info("Verifying Otp...");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message);
      console.log("Verify Otp Mutation Error:", err);
    },
    onSuccess: (data) => {
      toast.success("OTP Verified Successfully!");
      setCookie("orio-attendance-token", data.payload[0].token);
      setCookie("userInfo", JSON.stringify({
        username: data.payload[0].username,
        fullname: data.payload[0].employee.full_name,
        email: data.payload[0].email,
        employee_id: data.payload[0].employee_id,
        user_id: data.payload[0].id
      }));
      localStorage.setItem("menus", JSON.stringify(data.payload[0].menus));
      router.push("/");
    },
  });

  const submitVerifyOtp = (data: OtpSchemaType) => {
    useVerifyOtpMutation.mutate(data);
  };

  useEffect(() => {
    if (username) {
      setValue("username", username);
    }
  }, [username, setValue]);

  return (
    <>
      <form className={cn("flex flex-col gap-6")}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-4xl font-bold">Enter Verification Code</h1>
          <p className="text-muted-foreground text-md text-balance">
            A 6-digit code has been sent to your email.
          </p>
        </div>

        <div className="mx-auto">
          <Controller
            control={control}
            name="otp"
            render={({ field }) => (
              <>
                <InputOTP
                  maxLength={6}
                  disabled={useVerifyOtpMutation.isPending}
                  onChange={(val) => {
                    field.onChange(val);
                    if (val.length === 6) {
                      trigger("otp").then((isValid) => {
                        if (isValid) handleVerifyOtpSubmit(submitVerifyOtp)();
                      });
                    }
                  }}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                {errors.otp && (
                  <span className="text-red-500 text-sm">
                    {errors.otp.message}
                  </span>
                )}
              </>
            )}
          />
        </div>
      </form>
    </>
  );
};

export default OtpForm;
