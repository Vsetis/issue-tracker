import { type AppType } from "next/app";
import { Theme } from "@radix-ui/themes";
import { api } from "~/utils/api";
import { Inter } from "next/font/google";

import "@radix-ui/themes/styles.css";
import "~/styles/globals.css";

import Navbar from "~/components/Navbar";

const inter = Inter({
  subsets: ["latin"],
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <Theme appearance="light" accentColor="iris">
      <main className={inter.className}>
        <Navbar />
        <div className="container mx-auto p-5">
          <Component {...pageProps} />
        </div>
      </main>
    </Theme>
  );
};

export default api.withTRPC(MyApp);
