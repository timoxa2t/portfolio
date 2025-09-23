"use client";

import { NextIntlClientProvider } from "next-intl";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import { theme } from "@/theme";
import { AbstractIntlMessages } from "next-intl";
import { ClientOnlyProviders } from "../ClientOnlyProviders/ClientOnlyProviders";
import CssBaseline from "@mui/material/CssBaseline";

interface ProvidersProps {
  messages: AbstractIntlMessages;
  locale: string;
  children: React.ReactNode;
}

export function Providers({ messages, locale, children }: ProvidersProps) {
  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <ClientOnlyProviders>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </StyledEngineProvider>
      </ClientOnlyProviders>
    </NextIntlClientProvider>
  );
}
