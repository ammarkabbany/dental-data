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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUpdateTeam } from "@/features/team/hooks/use-update-team";
import useTeamStore from "@/store/team-store";
import { usePermission } from "@/hooks/use-permissions";
import { Input } from "@/components/ui/input";

export default function GeneralSettingsForm() {
  const { currentAppwriteTeam, currentTeam, userRole } = useTeamStore();
  const { mutate, isPending } = useUpdateTeam();
  const canUpdate = usePermission(userRole).checkPermission("team", "update");

  const updateTeamSettingsSchema = z.object({
    name: z.string().min(4, "Team name must be at least 4 characters long"),
    currency: z.string().min(3, "Currency is required"),
  });

  const form = useForm<z.infer<typeof updateTeamSettingsSchema>>({
    resolver: zodResolver(updateTeamSettingsSchema),
    defaultValues: {
      name: currentTeam?.name || "",
      currency: currentAppwriteTeam?.prefs.currency || "",
    },
  });

  const handleSave = async (
    values: z.infer<typeof updateTeamSettingsSchema>,
  ) => {
    if (!currentTeam) {
      return;
    }

    mutate({ teamId: currentTeam.$id, updates: values });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSave)}>
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            disabled={!canUpdate}
            render={({ field }) => (
              <FormItem className="max-w-md">
                <FormLabel>Name</FormLabel>
                <FormDescription>Change the name of your team.</FormDescription>
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

          <div className="space-y-2">
            <FormField
              control={form.control}
              name="currency"
              disabled={!canUpdate}
              render={({ field }) => (
                <FormItem className="max-w-xs">
                  <FormLabel>Currency</FormLabel>
                  <FormDescription>
                    Select the currency for your team.
                  </FormDescription>
                  <Select {...field} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger id="currency" className="w-[200px]">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Available currencies</SelectLabel>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="SAR">SAR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="EGP">EGP</SelectItem>
                        <SelectItem value="AED">AED</SelectItem>
                        <SelectItem value="AUD">AUD</SelectItem>
                        <SelectItem value="CAD">CAD</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <p className="text-sm text-muted-foreground">
              Currency used for displaying financial information
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

        {canUpdate ? (
          <div className="mt-8 flex justify-end">
            <Button variant="default" disabled={isPending}>
              {isPending ? "Saving..." : "Save general settings"}
              {!isPending && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center mt-10">
            You do not have permission to update team settings.
          </p>
        )}
      </form>
    </Form>
  );
}
