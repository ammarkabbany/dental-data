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
import GithubIcon from "@/components/icons/github";
import Link from "next/link";
import { LockKeyholeIcon, Mail, User2 } from "lucide-react";
import { useRegister } from "@/features/auth/hooks/use-register";
import { signUpWithGoogle } from "@/features/auth/oauth";
import { account } from "@/lib/appwrite/client";
import { OAuthProvider } from "appwrite";
import { NEXT_URL } from "@/lib/constants";

export default function LoginPage() {

  const {mutate, isPending, error} = useRegister();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    mutate({data: values})
  };

  return (
    <Card className="max-w-md w-full">
      <CardHeader className="p-7 flex items-center justify-center">
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>Register a new account</CardDescription>
      </CardHeader>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-6">
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
        <Separator className="my-4" />
        <h3 className="text-center text-sm text-muted-foreground mb-2">
          Or continue with
        </h3>
        <div className="">
          <Button
            onClick={() => account.createOAuth2Session(OAuthProvider.Google, `${NEXT_URL}/dashboard`, `${NEXT_URL}?authStatus=failed`)}
            className="items-center w-full"
            variant="secondary"
            disabled={isPending}
          >
            <GoogleIcon />
            Google
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          {/* ${params.size > 0 && "?"+encodeURIComponent(params.get("redirect"))} */}
          <Link aria-disabled={isPending} href={`/auth/login`} className="text-blue-500 hover:underline">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
