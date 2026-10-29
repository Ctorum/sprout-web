import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { Dashboard } from "./Dashboard";
import { getDictionary, hasLocale } from "./dictionaries";

export default async function Home() {
  const locale = await lang();
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary();

  return <Dashboard lang={locale} dict={dict} />;
}
