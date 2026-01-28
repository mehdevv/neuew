import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { FaRegMoneyBill1 } from "react-icons/fa6";

type Props = {
  category: string;
  title: string;
  price: string;
};

export function TravelHeader({ category, title, price }: Props) {
  const t = useTranslations("TravelCard");
  const priceFormat = t("price", { price: "{PRICE}" });
  const formattedPrice = price
    ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    : "";

  // Split the format string to insert the price with proper direction
  const parts = priceFormat.split("{PRICE}");
  const currencyBefore = parts[0];
  const currencyAfter = parts[1] || "";

  return (
    <div className="flex flex-col gap-6">
      {/* Title and Price */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        {/* Title */}
        <div className="flex flex-1 flex-col gap-2">
          <h1 className="text-xl leading-tight font-bold text-gray-900 md:text-2xl lg:text-2xl">
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              {title}
            </span>
          </h1>
          <Badge
            variant="outline"
            className="border-avt-green/30 bg-avt-green/10 text-avt-green hover:bg-avt-green/20 px-4 py-1.5 text-sm font-semibold"
          >
            {category}
          </Badge>
        </div>

        {/* Price */}
        {price && (
          <div className="group border-avt-green/30 from-avt-green/10 via-avt-green/5 hover:border-avt-green/50 flex h-fit shrink-0 items-center gap-3 rounded-xl border-2 bg-gradient-to-br to-white p-4 shadow-sm transition-all hover:shadow-md md:p-6">
            <div className="bg-avt-green/20 group-hover:bg-avt-green/30 flex h-10 w-10 items-center justify-center rounded-full transition-all md:h-12 md:w-12">
              <FaRegMoneyBill1 className="text-avt-green h-5 w-5 md:h-6 md:w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-500 md:text-sm">
                Price
              </span>
              <span className="text-avt-green text-xl font-bold md:text-2xl">
                {currencyBefore}
                <bdi
                  dir="ltr"
                  style={{ unicodeBidi: "isolate", display: "inline" }}
                  className="font-extrabold"
                >
                  {formattedPrice}
                </bdi>
                {currencyAfter}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
