import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { I18nProvider } from "./i18n";
import { App } from "./App";
import { AuthProvider } from "./auth";
import { ThemeProvider } from "./theme";

describe("App", () => {
  it("renders marketplace brand", () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <ThemeProvider>
          <I18nProvider>
            <AuthProvider>
              <MemoryRouter>
                <App />
              </MemoryRouter>
            </AuthProvider>
          </I18nProvider>
        </ThemeProvider>
      </QueryClientProvider>
    );
    expect(screen.getAllByText("FARMA OGLASI PRO").length).toBeGreaterThan(0);
  });
});
