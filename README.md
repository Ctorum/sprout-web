This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/[lang]/page.tsx`. The page auto-updates as you edit the file.

## Internationalization

Routes are prefixed with the locale: `/en` and `/pt`.

- `proxy.ts` redirects unprefixed paths using the `lang` cookie, then the `Accept-Language` header, then `en`. Visiting a locale route refreshes the cookie.
- Translations live in `app/[lang]/dictionaries/{en,pt}.json`. Read them with `getDictionary()` from `app/[lang]/dictionaries.ts`.
- To add a locale, add its JSON file, register it in `dictionaries.ts` and in `locales` inside `proxy.ts`, and add it to the language list in `app/[lang]/Shell.tsx`.
- Every user-facing string goes through a dictionary. Keep both files in sync.

## Code Conventions

- **No comments in code.** Never write comments inside source files (`.ts`, `.tsx`, `.css`). Make names and structure explain intent. Put explanations here in the documentation instead.
- Colors, spacing and type tokens are defined in `app/globals.css`. Neutrals are tinted navy (hue 265); `grow` (green) marks progress and gain, `info` (violet) marks labels and plan lines, `debt` (coral) marks shortfalls. Use the semantic token utilities (`bg-surface`, `text-muted`, `bg-grow`) rather than raw colors.
- Themes: light is the default; dark applies through `data-theme="dark"` on `<html>`. A script in `app/[lang]/layout.tsx` sets it before paint from `localStorage` (`theme`) or the system preference, and the toggle in `Shell.tsx` updates both.
- Sample data lives in `app/[lang]/data.ts` (per context: solo, couple, company). Goal names and other labels come from the `items` section of the dictionaries, keyed by the same ids. Currency and dates are formatted in `app/[lang]/format.ts`; keep `Intl` options explicit so server and browser output match.
- Every colored gain/loss or debt/credit signal also carries a sign, icon or text, so color is never the only cue.
- Product and design context: `PRODUCT.md`.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
