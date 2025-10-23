"use client";

import * as yup from "yup";

import { Alert, AlertDescription } from "@/src/components/ui/alert";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { SubmitHandler, useForm } from "react-hook-form";

import { AlertCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRegisterUserMutation } from "@/src/services/authApi";
import { useRouter } from "next/navigation";
import { useToastMessage } from "@/src/hooks/useToastMessage";
import { useTranslations } from "next-intl";
import { yupResolver } from "@hookform/resolvers/yup";

type FormValues = {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  role?: Role;
  company?: string;
  phone?: string;
  skills?: string;
};

type Role = "admin" | "developer";

export default function RegisterPage() {
  const t = useTranslations("Register");
  const router = useRouter();
  const { success, failure } = useToastMessage();
  const [registerUser, { isLoading, error }] = useRegisterUserMutation();

  const schema = yup.object().shape({
    name: yup.string().required(t("errors.nameRequired")),
    username: yup.string().required(t("errors.usernameRequired")),
    email: yup
      .string()
      .email(t("errors.emailInvalid"))
      .required(t("errors.emailRequired")),
    password: yup
      .string()
      .min(4, t("errors.passwordMin", { min: 4 }))
      .required(t("errors.passwordRequired")),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], t("errors.passwordMismatch"))
      .required(t("errors.confirmRequired")),
    role: yup.string().oneOf(["admin", "developer"]).required(),
    company: yup.string().optional(),
    phone: yup.string().optional(),
    skills: yup.string().optional(),
  });

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormValues>({
    // @ts-expect-error: resolver
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "developer",
      company: "",
      phone: "",
      skills: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      await registerUser({
        name: data.name,
        username: data.username,
        email: data.email,
        password: data.password,
        role: data.role,
        company: data.company,
        phone: data.phone,
        skills:
          data.role === "developer"
            ? data.skills
                ?.split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            : [],
      }).unwrap();

      success(t("alert.success"));
      router.push("/login");
    } catch (err) {
      console.log(err);
      // @ts-expect-error: error
      failure(err?.data?.message || t("alert.failure"));
    }
  };

  const selectedRole = watch("role");

  return (
    <Card className="w-full max-w-xl shadow-md">
      <CardHeader className="text-center space-y-2">
        <Image
          src="/assets/logo.png"
          alt="logo"
          width={120}
          height={120}
          className="mx-auto rounded-full w-24 h-24"
        />
        <CardTitle className="text-2xl font-bold tracking-tight">
          {t("title")}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </CardHeader>

      {error && (
        <div className="mx-6">
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertDescription>
              {/* @ts-expect-error: error */}
              <p>{error?.data?.message}</p>
            </AlertDescription>
          </Alert>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">{t("fields.name")}</Label>
            <Input
              id="name"
              placeholder={t("placeholders.name")}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name.message}</p>
            )}
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">{t("fields.username")}</Label>
            <Input
              id="username"
              placeholder={t("placeholders.username")}
              {...register("username")}
            />
            {errors.username && (
              <p className="text-red-500 text-xs">{errors.username.message}</p>
            )}
          </div>

          {/* Email */}
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

          {/* Password */}
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

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              {t("fields.confirmPassword")}
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder={t("placeholders.confirmPassword")}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role">{t("fields.role")}</Label>

            <Select
              defaultValue={"developer"}
              onValueChange={(value) => setValue("role", value as Role)}
            >
              <SelectTrigger
                className={`w-full justify-between bg-transparent border border-border text-foreground`}
              >
                <SelectValue placeholder="Select language" />
              </SelectTrigger>

              <SelectContent className="bg-background border-border text-foreground">
                {[
                  { key: "developer", label: t("roles.developer") },
                  { key: "admin", label: t("roles.admin") },
                ].map((role) => (
                  <SelectItem
                    key={role.key}
                    value={role.key}
                    className="cursor-pointer"
                  >
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Role-specific fields */}
          {selectedRole === "developer" && (
            <div className="space-y-2">
              <Label htmlFor="skills">{t("fields.skills")}</Label>
              <Input
                id="skills"
                placeholder={t("placeholders.skills")}
                {...register("skills")}
              />
              <p className="text-xs text-muted-foreground">
                {t("hints.skills")}
              </p>
            </div>
          )}

          {selectedRole === "admin" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="company">{t("fields.company")}</Label>
                <Input
                  id="company"
                  placeholder={t("placeholders.company")}
                  {...register("company")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">{t("fields.phone")}</Label>
                <Input
                  id="phone"
                  placeholder={t("placeholders.phone")}
                  {...register("phone")}
                />
              </div>
            </>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 mt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white dark:text-black"
          >
            {isLoading ? t("button.loading") : t("button.register")}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            {t("alreadyAccount")}{" "}
            <Link
              href="/login"
              className="text-primary dark:text-white hover:underline font-medium"
            >
              {t("signIn")}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
