"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { registerSchema } from "@/features/auth/schemas";
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
import Link from "next/link";
import { LockKeyholeIcon, Mail, User2 } from "lucide-react";
import { useRegister } from "@/features/auth/hooks/use-register";
import { account } from "@/lib/appwrite/client";
import { OAuthProvider } from "appwrite";
import { NEXT_URL } from "@/lib/constants";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useAuth } from "@/providers/auth-provider";
import { redirect } from "next/navigation";
import { useRedirectUrl } from "@/features/auth/hooks/use-redirect-url";
import EmailOTPCard from "@/components/auth/otp-confirmation-card";

export default function RegisterPage() {
  const { isLoading, isAuthenticated } = useAuth();
  const redirectUrl = useRedirectUrl();

  const { mutate, isPending, error, isSuccess, data } = useRegister();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  if (isLoading) {
    return <main className="">
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    </main>
  }
  if (isAuthenticated) redirect("/");

  if (isSuccess) {
    return <EmailOTPCard userId={data.userId} />
  }

  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    mutate({ data: values })
  };

  return (
    <Card className="max-w-md w-full rounded-sm outline-none border-none">
      <CardHeader className="p-7 flex flex-col items-center justify-center">
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Create an account to get started
        </CardDescription>
      </CardHeader>
      <CardContent className="px-7">
        <div className="">
          <Button
            onClick={() => account.createOAuth2Session(OAuthProvider.Google, `${NEXT_URL}${redirectUrl ?? "/"}`, `${NEXT_URL}?authStatus=failed`)}
            className="items-center text-base rounded-sm w-full [&_svg]:size-5!"
            variant="secondary"
            size={'lg'}
            disabled={isPending}
          >
            <GoogleIcon />
            Google
          </Button>
        </div>
        <Separator className="my-4" />
        <h3 className="text-center text-sm text-muted-foreground mb-2">
          Or continue with
        </h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter name"
                      >
                        <Input.Group>
                          <Input.LeftIcon>
                            <User2 />
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
              {isPending ? 'Signing up...' : 'Sign Up'}
            </Button>
          </form>
          {error && (
            <div className="text-red-500 text-xs mt-4">
              {error.message}
            </div>
          )}
        </Form>
        <p className="text-sm text-center text-gray-600 dark:text-gray-300 mt-2">
          By signing up, you agree to our<br /> <Link href="/terms" className="text-blue-500 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-blue-500 hover:underline">Privacy Policy</Link>.
        </p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          {/* ${params.size > 0 && "?"+encodeURIComponent(params.get("redirect"))} */}
          <Link aria-disabled={isPending} href={`/login`} className="text-blue-500 hover:underline">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
