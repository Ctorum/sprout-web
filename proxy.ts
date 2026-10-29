import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "pt"];
const defaultLocale = "en";
const cookieName = "lang";

function getLocale(request: NextRequest) {
  const saved = request.cookies.get(cookieName)?.value;
  if (saved && locales.includes(saved)) return saved;
  const languages = new Negotiator({
    headers: { "accept-language": request.headers.get("accept-language") ?? "" },
  }).languages();
  try {
    return match(languages, locales, defaultLocale);
  } catch {
    return defaultLocale;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const current = locales.find(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );

  if (!current) {
    request.nextUrl.pathname = `/${getLocale(request)}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  const response = NextResponse.next();
  if (request.cookies.get(cookieName)?.value !== current) {
    response.cookies.set(cookieName, current, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
