import { Toaster } from "@/components/ui/sonner";
import { DialogProvider } from "@/components/ui/dialog-provider";

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DialogProvider>
      {children}
      <Toaster />
    </DialogProvider>
  );
}
