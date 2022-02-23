import React from "react";
import Head from "next/head";

import Header from "./Header";

export default function Layout({
  children,
  withoutHeader,
}: {
  children: React.ReactNode;
  withoutHeader?: boolean;
}) {
  return (
    <div className="h-full">
      <Head>
        <title>WhereCal</title>
      </Head>
      {!withoutHeader && <Header />}
      {children}
    </div>
  );
}
