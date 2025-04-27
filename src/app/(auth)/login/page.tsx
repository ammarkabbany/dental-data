"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { loginSchema } from "@/features/auth/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "react-aria-components";
import { Button } from "@/components/ui/button";
import GoogleIcon from "@/components/icons/google";
import GithubIcon from "@/components/icons/github";
import Link from "next/link";
import { LockKeyholeIcon, Mail } from "lucide-react";
import { useLogin } from "@/features/auth/hooks/use-login";
import { account } from "@/lib/appwrite/client";
import { OAuthProvider } from "appwrite";
import { NEXT_URL } from "@/lib/constants";
import { useAuth } from "@/providers/auth-provider";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { redirect } from "next/navigation";
import { useRedirectUrl } from "@/features/auth/hooks/use-redirect-url";
import EmailOTPCard from "@/components/auth/otp-confirmation-card";

export default function LoginPage() {
  const { isLoading, isAuthenticated } = useAuth();
  const redirectUrl = useRedirectUrl();

  const { mutate, isPending, isError, error } = useLogin();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  if (isLoading) {
    return <main className="bg-gradient-to-b from-background to-muted/30">
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    </main>
  }
  if (isAuthenticated) redirect("/");

  if (isError) {
    if (error.message === 'email-not-verified') {
      return <EmailOTPCard userId={error.cause as string} />
    }
  }

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    mutate({ data: values })
  };

  return (
    <Card className="max-w-md w-full rounded-none sm:rounded-xl">
      <CardHeader className="p-7 flex items-center justify-center">
        <CardTitle className="text-xl">Login</CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter email"
                      >
                        <Input.Group>
                          <Input.LeftIcon>
                            <Mail />
                          </Input.LeftIcon>
                        </Input.Group>
                      </Input>
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
                        {...field} placeholder="Enter password"
                      >
                        <Input.Group>
                          <Input.LeftIcon>
                            <LockKeyholeIcon />
                          </Input.LeftIcon>
                          <Input.PasswordToggle />
                        </Input.Group>
                      </Input>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              className="w-full mt-4 cursor-pointer"
              disabled={isPending}
            >
              {isPending ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
          {error && (
            <div className="text-red-500 text-xs mt-4">
              {error.message}
            </div>
          )}
        </Form>
        <Separator className="my-4" />
        <h3 className="text-center text-sm text-muted-foreground mb-2">
          Or continue with
        </h3>
        <div className="">
          <Button
            onClick={() => account.createOAuth2Session(OAuthProvider.Google, `${NEXT_URL}${redirectUrl ?? "/"}`, `${NEXT_URL}?authStatus=failed`)}
            className="items-center w-full"
            variant="secondary"
            disabled={isPending}
          >
            <GoogleIcon />
            Google
          </Button>
          {/* <Button
            onClick={() => {}}
            className="items-center bg-neutral-800 hover:bg-neutral-700 text-white"
            variant="secondary"
            disabled={isPending}
          >
            <GithubIcon />
            GitHub
          </Button> */}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-center">
        <p className="text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          {/* ${params.size > 0 && "?"+encodeURIComponent(params.get("redirect"))} */}
          <Link aria-disabled={isPending} href={`/sign-up`} className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
