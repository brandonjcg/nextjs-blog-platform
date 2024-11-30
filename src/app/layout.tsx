"use client";

import localFont from "next/font/local";
import "./../styles/globals.css";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoredToken: { username: string } = jwtDecode(token);
        setUsername(decoredToken.username);
      } catch (error) {
        console.error("Error decoding token:", error);
        setUsername(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUsername(null);
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-gray-100 text-gray-900`}
      >
        {/* Navbar */}
        <Navbar username={username} onLogout={handleLogout} />

        {/* Main Content */}
        <main className="container mx-auto py-8">{children}</main>
      </body>
    </html>
  );
}
