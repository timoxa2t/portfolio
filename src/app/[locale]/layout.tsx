import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { PageWrapper } from "@/components/PageWrapper/PageWrapper";
import { PerformanceMonitor } from "@/components/PerformanceMonitor/PerformanceMonitor";
import { Providers } from "@/components/Providers/Providers";

import "@/styles/global.scss";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale?: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} style={{ minWidth: "320px" }}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.svg" />
      </head>
      <body>
        <Providers messages={messages} locale={locale as string}>
          <PageWrapper>{children}</PageWrapper>
          <PerformanceMonitor />
        </Providers>
      </body>
    </html>
  );
}
