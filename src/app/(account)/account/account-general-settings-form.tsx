import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowRight, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/providers/auth-provider";
import { useUpdateUserInfo } from "@/features/auth/hooks/use-update-userinfo";
import { useRef } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AccountGeneralSettingsForm() {
  const { user, refreshUser } = useAuth();
  const { mutate, isPending } = useUpdateUserInfo();
  // const canUpdate = usePermission(userRole).checkPermission("team", "update");
  const inputRef = useRef<HTMLInputElement>(null);
  const updateAccountSettings = z.object({
    name: z.string().min(4, "Name must be at least 4 characters long").max(32, "Name must be at most 32 characters long"),
    image: z
      .union([
        z.instanceof(File),
        z.string().transform((value) => (value === "" ? undefined : value)),
      ])
      .optional(),
  });

  const form = useForm<z.infer<typeof updateAccountSettings>>({
    resolver: zodResolver(updateAccountSettings),
    defaultValues: {
      name: user?.name || "",
      image: user?.prefs?.avatar || "",
    },
  });

  const handleSave = async (values: z.infer<typeof updateAccountSettings>) => {
    if (!user) {
      return;
    }
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : (values.image ?? ""),
    };

    mutate(
      { updates: finalValues },
      {
        onSuccess: () => {
          refreshUser();
        },
      }
    );
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSave)}>
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <div className="flex flex-col gap-y-2">
                <div className="flex items-center gap-x-5">
                  {field.value ? (
                    <div className="relative size-[72px] overflow-hidden rounded-md">
                      <Image
                        alt="Logo"
                        fill
                        className="object-cover"
                        src={
                          field.value instanceof File
                            ? URL.createObjectURL(field.value)
                            : field.value
                        }
                      />
                    </div>
                  ) : (
                    <Avatar className="size-[72px]">
                      <AvatarFallback>
                        <ImageIcon className="size-[36px] text-neutral-400" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className="flex flex-col">
                    <p className="text-sm">Profile Picture</p>
                    <p className="text-muted-foreground text-sm">
                      JPG, PNG, SVG or JPEG, max 1mb
                    </p>
                    <input
                      className="hidden"
                      type="file"
                      accept=".jpg, .png, .svg, .jpeg"
                      ref={inputRef}
                      onChange={handleImageChange}
                      disabled={isPending}
                    />
                    {!field.value ? (
                      <Button
                        type="button"
                        disabled={isPending}
                        variant={"default"}
                        size={"sm"}
                        className="mt-2 w-fit"
                        onClick={() => inputRef.current?.click()}
                      >
                        Upload Image
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        disabled={isPending}
                        variant={"destructive"}
                        size={"sm"}
                        className="mt-2 w-fit"
                        onClick={() => {
                          field.onChange("");  // Change from null to empty string
                          if (inputRef.current) {
                            inputRef.current.value = "";
                          }
                        }}
                      >
                        Remove Image
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          />
           <div className="space-y-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="max-w-md">
                <FormLabel>Name</FormLabel>
                <FormDescription>
                  Change the name of your account.
                </FormDescription>
                <FormControl>
                  <Input
                    {...field}
                    variant={"default"}
                    placeholder="Enter name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <p className="text-sm text-muted-foreground">
            This will be visible to other team members.
          </p>
          </div>

          {/* <div className="space-y-2 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Data Privacy Mode</Label>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Hide sensitive patient information from team members without
                  proper access
                </p>
              </div>
              <Switch defaultChecked={true} disabled={!canUpdate} />
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Automatic Backups</Label>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Automatically backup team data on a regular schedule
                </p>
              </div>
              <Switch defaultChecked={true} disabled={!canUpdate} />
            </div>
          </div> */}
        </div>

        <div className="mt-8 flex justify-end">
          <Button variant="default" disabled={isPending}>
            {isPending ? "Saving..." : "Save settings"}
            {!isPending && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </form>
    </Form>
  );
}
