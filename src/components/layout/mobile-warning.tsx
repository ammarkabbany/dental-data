import { Alert, AlertDescription } from "../ui/alert";

export const MobileNotSupportedWarning = () => {
  return (
    <Alert variant={"warning"} className="rounded-none border-none h-14 text-center">
      {/* <AlertTitle className="font-bold">Warning:</AlertTitle> */}
      <AlertDescription className="mt-1">
        We do NOT support mobile. Use with caution.
      </AlertDescription>
    </Alert>
  );
};
