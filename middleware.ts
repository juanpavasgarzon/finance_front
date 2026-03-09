import { NextRequest, NextResponse } from "next/server";

const LOCALES = ["es", "en"];
const DEFAULT_LOCALE = "es";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const localeMatch = LOCALES.find((l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`);

  if (localeMatch) {
    const rest = pathname.replace(`/${localeMatch}`, "") || "/";
    const url = request.nextUrl.clone();
    url.pathname = rest;

    const response = NextResponse.rewrite(url);
    response.cookies.set("locale", localeMatch, { path: "/", maxAge: 365 * 24 * 60 * 60 });
    return response;
  }

  const savedLocale = request.cookies.get("locale")?.value;
  const locale = LOCALES.includes(savedLocale ?? "") ? savedLocale : DEFAULT_LOCALE;

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|favicon\\.ico|.*\\..*).*)" ],
};
