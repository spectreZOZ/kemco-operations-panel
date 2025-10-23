"use client";

import * as yup from "yup";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SubmitHandler, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useLoginUserMutation } from "@/src/services/authApi";
import { useRouter } from "next/navigation";
import { useToastMessage } from "@/src/hooks/useToastMessage";
import { useTranslations } from "next-intl";
import { yupResolver } from "@hookform/resolvers/yup";

type FormValues = {
  email?: string;
  password?: string;
  remember?: boolean;
};

export default function LoginPage() {
  const t = useTranslations("Login");

  const schema = yup.object().shape({
    email: yup
      .string()
      .email(t("errors.emailInvalid"))
      .required(t("errors.emailRequired")),
    password: yup
      .string()
      .min(4, t("errors.passwordMin", { min: 4 }))
      .required(t("errors.passwordRequired")),
    remember: yup.boolean(),
  });

  const [loginUser, { isLoading }] = useLoginUserMutation();
  const router = useRouter();
  const { success, failure } = useToastMessage();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    // @ts-expect-error: resolver
    resolver: yupResolver(schema),
    defaultValues: { email: "", password: "", remember: false },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const response = await loginUser(data).unwrap();
      success(`${t("alert.success")} ${response?.username || response?.email}`);
      router.push("/dashboard");
    } catch {
      failure(t("errors.invalidCredentials"));
    }
  };

  return (
    <Card className="w-full max-w-sm shadow-md">
      <CardHeader className="text-center space-y-2">
        <Image
          src={"/assets/logo.png"}
          alt="logo"
          width={150}
          height={150}
          className="mx-auto rounded-full w-24 h-24"
        />
        <CardTitle className="text-2xl font-bold tracking-tight">
          {t("title")}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t("fields.email")}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t("placeholders.email")}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t("fields.password")}</Label>
            <Input
              id="password"
              type="password"
              placeholder={t("placeholders.password")}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register("remember")}
                className="h-4 w-4 accent-secondary dark:accent-white rounded-sm border-gray-300"
              />
              {t("remember")}
            </label>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 mt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white dark:text-black"
          >
            {isLoading ? t("button.loading") : t("button.signIn")}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            {t("noAccount")}{" "}
            <Link
              href="/register"
              className="text-primary dark:text-white hover:underline font-medium"
            >
              {t("signUp")}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
