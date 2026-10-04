import type { Metadata } from "next";
import QueryProvider from "@/providers/QueryProvider";
import SocketProvider from "@/providers/SocketProvider";
import StoreProvider from "@/providers/StoreProvider";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "App with navbar, sidebar, and content layout",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <StoreProvider>
          <QueryProvider>
            <SocketProvider>
              {children}
              <Toaster position="top-center" />
            </SocketProvider>
          </QueryProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
