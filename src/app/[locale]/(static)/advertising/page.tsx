"use client";

import { useTranslations } from "next-intl";

export default function AdsPage() {
  const t = useTranslations("Advertising");

  const sections = [
    "branding",
    "videos",
    "brandContent",
    "multiScreen",
    "contextual",
    "specialOps",
    "spots",
  ] as const;

  return (
    <div className="prose mx-auto p-6" dir="auto">
      <h1>{t("title")}</h1>
      <p>{t("intro")}</p>

      {sections.map((section) => (
        <section key={section}>
          <h2>{t(`sections.${section}.title`)}</h2>

          {/* Some sections have items, some only a description */}
          {t.has(`sections.${section}.items`) && (
            <ul>
              {Object.keys(t.raw(`sections.${section}.items`)).map((key) => (
                <li key={key}>{t(`sections.${section}.items.${key}`)}</li>
              ))}
            </ul>
          )}

          {t.has(`sections.${section}.desc`) && (
            <p>{t(`sections.${section}.desc`)}</p>
          )}
        </section>
      ))}
    </div>
  );
}
