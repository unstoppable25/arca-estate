import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AIPrestigeCurator } from "@/components/discovery/ai-curator";
import { cn } from "@/lib/utils";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Arca Estate",
    description: "Trust-first real estate platform",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={cn(outfit.className, "flex min-h-screen flex-col")}>
                <Navbar />
                <main className="flex-1 pt-16">
                    {children}
                </main>
                <Footer />
                <AIPrestigeCurator />
            </body>
        </html>
    );
}
