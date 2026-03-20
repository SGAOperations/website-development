import "./styles.css";
import { Toaster } from "@/components/ui/sonner";
import { DialogProvider } from "@/components/ui/dialog-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <DialogProvider>
          {children}
        </DialogProvider>
        <Toaster />
      </body>
    </html>
  )
}
