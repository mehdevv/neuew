type Locales = "en" | "fr" | "ar";

interface Localizable {
  name_en: string;
  name_fr: string;
  name_ar: string;
  description_en: string;
  description_fr: string;
  description_ar: string;
}

export type Localized<T extends Localizable> = T & {
  t_name: string;
  t_description: string;
};

export function withResolvedLocale<T extends Localizable>(
  item: T,
  locale: Locales,
): Localized<T> {
  //  TODO: fuck up in the backedn where ar is en and vice versa for description

  return {
    ...item,
    t_name: item[`name_${locale}`],
    t_description: item[`description_${locale}`],
  } as Localized<T>;
}
