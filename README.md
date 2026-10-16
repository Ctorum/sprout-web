This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
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
- Colors, spacing and type tokens are defined in `app/globals.css`. Neutrals are tinted toward the moss accent (hue 150). Use the semantic token utilities (`bg-bg`, `text-muted`, `bg-accent`) rather than raw colors.
- Product and design context: `PRODUCT.md`.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
