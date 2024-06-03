import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { Inter as FontSans } from "next/font/google";
import { cn } from "~/lib/utils";

import Header from "~/components/header";
import { Toaster } from "~/components/ui/sonner";
import { TRPCReactProvider } from "~/trpc/react";

const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
});

export const metadata = {
    title: "ProSights Chatbot",
    description: "RAG chatbot for asking questions regarding Bumble",
    icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${GeistSans.variable}`}>
            <TRPCReactProvider>
                <body
                    className={cn(
                        "flex flex-col bg-background font-sans antialiased",
                        fontSans.variable,
                    )}
                    style={{ height: "calc(100dvh - 45px)" }}
                >
                    <Header />

                    {children}
                </body>
                <Toaster richColors closeButton />
            </TRPCReactProvider>
        </html>
    );
}
