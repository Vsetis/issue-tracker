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
    <html lang="en">
      <body className={inter.className}>
        <Theme appearance="light" accentColor="iris">
          <Navbar />
          <main className="p-5">
            <Component {...pageProps} />
          </main>
        </Theme>
      </body>
    </html>
  );
};

export default api.withTRPC(MyApp);
