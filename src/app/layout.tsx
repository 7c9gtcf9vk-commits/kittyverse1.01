import type { Metadata } from "next";
import "./globals.css";
import I18nProvider from "@/components/I18nProvider";
import ThemeProvider from "@/components/ThemeProvider";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://kittyverse.app"
  ),
  title: {
    default: "KittyVerse - Dreamy Digital Space",
    template: "%s | KittyVerse",
  },
  description:
    "A dreamy digital space inspired by Hello Kitty & Friends. Explore characters, create projects, and journal your thoughts in a pastel macaron world.",
  keywords: [
    "KittyVerse",
    "Hello Kitty",
    "Sanrio",
    "digital space",
    "character gallery",
    "journal",
    "macaron",
    "pastel",
    "Next.js",
  ],
  authors: [{ name: "KittyVerse Team" }],
  creator: "KittyVerse",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    alternateLocale: "en_US",
    url: "https://kittyverse.app",
    siteName: "KittyVerse",
    title: "KittyVerse - Dreamy Digital Space",
    description:
      "A dreamy digital space inspired by Hello Kitty & Friends. Explore characters, create projects, and journal your thoughts.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "KittyVerse",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KittyVerse - Dreamy Digital Space",
    description:
      "A dreamy digital space inspired by Hello Kitty & Friends.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  alternates: {
    languages: {
      "zh-CN": "/zh-CN",
      "en-US": "/en-US",
      "x-default": "/",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var lang = localStorage.getItem('kittyverse-lang');
                  if (!lang) {
                    lang = navigator.language.startsWith('zh') ? 'zh-CN' : navigator.language.startsWith('en') ? 'en-US' : 'zh-CN';
                    localStorage.setItem('kittyverse-lang', lang);
                  }
                  document.documentElement.lang = lang;
                } catch(e) {}
              })();
              (function() {
                try {
                  var mode = localStorage.getItem('kittyverse-theme-mode');
                  if (mode === 'dark' || window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider>
          <I18nProvider>{children}</I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
