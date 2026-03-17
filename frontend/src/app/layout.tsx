import "@mantine/charts/styles.css";
import {
  ColorSchemeScript,
  DirectionProvider,
  MantineProvider,
  createTheme,
  mantineHtmlProps,
} from "@mantine/core";
import "@mantine/core/styles.css";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import { isbot } from "isbot";
import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import { headers } from "next/headers";
import Script from "next/script";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { FingerprintProvider } from "./providers/fingerprint-provider";

const logoFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-logo",
});

export const theme = createTheme({
  primaryColor: "green",
  colors: {
    dark: [
      "#c1c2c5",
      "#a6a7ab",
      "#909296",
      "#5c5f66",
      "#373a40",
      "#2c2e33",
      "#25262b",
      "#1a1b1e",
      "#141517",
      "#101113",
    ],
  },
  components: {
    Notification: {
      styles: {
        title: { fontSize: 20, fontWeight: 600 },
        description: { fontSize: 18 },
      },
    },
  },
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
      title: "StreamArchive",
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const locale = headersList.get("x-next-intl-locale") || "en";
  const userAgent = headersList.get("user-agent") || "";

  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={logoFont.variable}
      {...mantineHtmlProps}
    >
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
        {!isbot(userAgent) ? (
          <Script
            defer
            src="/script.js"
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_ID}
          />
        ) : null}
        <meta name="format-detection" content="telephone=no" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body>
        <DirectionProvider initialDirection={dir} detectDirection={false}>
          <MantineProvider theme={theme} defaultColorScheme="dark">
            <ModalsProvider>
              <Notifications position="bottom-center" />
              <NuqsAdapter>
                <FingerprintProvider>{children}</FingerprintProvider>
              </NuqsAdapter>
            </ModalsProvider>
          </MantineProvider>
        </DirectionProvider>
      </body>
    </html>
  );
}
