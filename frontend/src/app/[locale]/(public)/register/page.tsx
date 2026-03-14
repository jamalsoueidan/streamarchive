import { generateAlternates } from "@/app/lib/seo";
import { getLocale, getTranslations } from "next-intl/server";
import { RegisterChoices } from "./components/register-choices";

export async function generateMetadata() {
  const t = await getTranslations("register");
  const locale = await getLocale();
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: generateAlternates("/register", locale),
  };
}

export default function RegisterPage() {
  return <RegisterChoices />;
}
