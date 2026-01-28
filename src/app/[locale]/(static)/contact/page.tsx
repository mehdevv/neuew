import { ContactForm } from "@/components/ContactForm";
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("Contact_us_page");

  return (
    <div className="p-10 ">
      <h1 className="w-full text-[40px] font-bold max-md:text-[30px]">
        {t("Title")}
      </h1>
      <ContactForm />
    </div>
  );
}
