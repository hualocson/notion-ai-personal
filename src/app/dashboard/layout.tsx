"use client";

import Navbar from "./components/nav-bar";

function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="container">
      <div>{children}</div>
      <Navbar />
    </div>
  );
}

export default DashboardLayout;
