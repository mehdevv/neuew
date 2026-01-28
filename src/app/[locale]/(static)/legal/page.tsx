"use client";

import { useTranslations } from "next-intl";

export default function LegalPage() {
  const t = useTranslations("LegalNotice");

  return (
    <div className={`prose mx-auto max-w-4xl p-6 text-justify`} dir="auto">
      <h1>{t("title")}</h1>

      <section>
        <h2>{t("legalNotices.title")}</h2>
        <h3>{t("legalNotices.sections.presentation.title")}</h3>
        <ul>
          <li>{t("legalNotices.sections.presentation.items.name")}</li>
          <li>{t("legalNotices.sections.presentation.items.url")}</li>
          <li>{t("legalNotices.sections.presentation.items.publisher")}</li>
          <li>{t("legalNotices.sections.presentation.items.address")}</li>
          <li>{t("legalNotices.sections.presentation.items.email")}</li>
          <li>{t("legalNotices.sections.presentation.items.host")}</li>
        </ul>
        <p>{t("legalNotices.sections.content")}</p>
        <p>{t("legalNotices.sections.personalData")}</p>
        <p>{t("legalNotices.sections.cookies")}</p>
        <p>{t("legalNotices.sections.liability")}</p>
        <p>{t("legalNotices.sections.externalLinks")}</p>
        <p>{t("legalNotices.sections.law")}</p>
        <p>{t("legalNotices.sections.contact")}</p>
      </section>

      <section>
        <h2>{t("termsOfUse.title")}</h2>
        <p>{t("termsOfUse.sections.platform")}</p>
        <p>{t("termsOfUse.sections.acceptance")}</p>
        <h3>{t("termsOfUse.sections.services.title")}</h3>
        <ul>
          <li>{t("termsOfUse.sections.services.items.0")}</li>
          <li>{t("termsOfUse.sections.services.items.1")}</li>
          <li>{t("termsOfUse.sections.services.items.2")}</li>
        </ul>
        <h3>{t("termsOfUse.sections.commitments.title")}</h3>
        <ul>
          <li>{t("termsOfUse.sections.commitments.items.0")}</li>
          <li>{t("termsOfUse.sections.commitments.items.1")}</li>
          <li>{t("termsOfUse.sections.commitments.items.2")}</li>
        </ul>
        <p>{t("termsOfUse.sections.content")}</p>
        <p>{t("termsOfUse.sections.personalData")}</p>
        <p>{t("termsOfUse.sections.liability")}</p>
        <p>{t("termsOfUse.sections.externalLinks")}</p>
        <p>{t("termsOfUse.sections.modifications")}</p>
        <p>{t("termsOfUse.sections.law")}</p>
        <p>{t("termsOfUse.sections.contact")}</p>
      </section>
    </div>
  );
}
