"use client";
import {
  FaFacebook,
  FaLinkedin,
  FaInstagram,
  FaYoutube,
  FaInfo,
  FaMessage,
  FaPhone,
  FaEnvelope,
  FaLocationPin,
} from "react-icons/fa6";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import Image from "next/image";
// "advertising"

const Footer = () => {
  const t = useTranslations("Footer");

  // Custom style for the icon containers to maintain consistent size
  const iconStyle = "w-5 h-5 flex-shrink-0";

  //// Social media links data
  // Contact information data
  const contactInfo = [
    {
      href: "tel:+213550129119",
      icon: <FaPhone className={iconStyle} />,
      text: "+213 550 129 119",
    },
    {
      href: "mailto:algeriavirtualtravel@gmail.com",
      icon: <FaEnvelope className={iconStyle} />,
      text: "algeriavirtualtravel@gmail.com",
    },
    {
      href: "mailto:contact-avt@algeriavirtualtravel.com",
      icon: <FaEnvelope className={iconStyle} />,
      text: "contact-avt@algeriavirtualtravel.com",
    },
    {
      href: "https://maps.app.goo.gl/bdnQoegzdGraJyRh7",
      icon: <FaLocationPin className={iconStyle} />,
      text: t("address"),
    },
  ];

  // Internal links data
  const internalLinks = [
    {
      to: "/create-store",
      icon: (
        <Image
          src="/svg/store-icon.svg"
          alt="store-icon"
          className={iconStyle}
          width={20}
          height={20}
        />
      ),
      text: t("store"),
    },
    {
      to: "/advertising",
      icon: (
        <Image
          src="/svg/ads-icon.svg"
          alt="ads-icon"
          className={iconStyle}
          width={20}
          height={20}
        />
      ),
      text: t("ad"),
    },
    {
      to: "/contact",
      icon: <FaMessage className={iconStyle} />,
      text: t("contact_us"),
    },
    {
      to: "/legal",
      icon: <FaInfo className={iconStyle} />,
      text: t("legal_notice"),
    },
  ];
  const pathname = usePathname();
  const isMap = pathname.toLowerCase() === "/map";

  return (
    <footer
      className={`bg-avt-green w-full p-4 text-white ${isMap && "hidden"}`}
    >
      <div className="px-auto container mx-auto">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="flex flex-col items-center justify-center space-y-4 md:items-start">
            <Image
              src="/images/logo.png"
              alt="Algeria Virtual Travel"
              className="max-w-xs object-contain"
              width={200}
              height={100}
            />
            <p className="max-w-md text-center text-sm font-normal md:text-left">
              {t("warning")}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 md:col-span-3 md:grid-cols-3">
            {/* Internal Links */}
            <div className="flex flex-col items-start space-y-4">
              {internalLinks.map((link) => (
                <Link
                  key={link.to}
                  href={link.to}
                  className="flex items-start gap-x-2 text-sm transition-opacity hover:opacity-80"
                >
                  <span>{link.icon}</span>
                  <span className="text-start">{link.text}</span>
                </Link>
              ))}
            </div>

            {/* Contact Info */}
            <div className="flex flex-col items-start space-y-4">
              {contactInfo.map((info) => (
                <a
                  key={info.text}
                  href={info.href}
                  target={info.href.startsWith("mailto:") || info.href.includes("maps") || info.href.includes("goo.gl") ? "_blank" : undefined}
                  rel={info.href.startsWith("mailto:") || info.href.includes("maps") || info.href.includes("goo.gl") ? "noopener noreferrer" : undefined}
                  className="flex items-start text-sm transition-opacity hover:opacity-80"
                >
                  <span className="mr-3 flex-shrink-0">{info.icon}</span>
                  <span className="text-start break-words">{info.text}</span>
                </a>
              ))}
            </div>

            <div className="flex flex-col items-center justify-center gap-y-4 lg:items-end">
              <p className="text-xs">{t("follow_us")}</p>
              <div className="flex gap-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="transform transition-opacity duration-200 hover:scale-110 hover:opacity-80"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
              {/* label image */}
              <div className="flex flex-row gap-2">
                <Image
                  src="/images/label-pi.png"
                  alt="Label Project innovant"
                  className="h-24 w-24 object-contain"
                  width={96}
                  height={96}
                />

                <Image
                  src="/images/label-startup.png"
                  alt="Label Startup"
                  className="h-24 w-24 object-contain"
                  width={96}
                  height={96}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 border-t-2 border-white/30 pt-4">
        © {new Date().getFullYear()} {t("All_rights_reserved")}
      </div>
    </footer>
  );
};

export const socialLinks = [
  {
    href: "https://www.facebook.com/Algeria.Travel.Guide?mibextid=ZbWKwL",
    icon: <FaFacebook className={"h-7 w-7 flex-shrink-0"} />,
    label: "Facebook",
  },
  {
    href: "https://instagram.com/algeria_virtual_travel",
    icon: <FaInstagram className={"h-7 w-7 flex-shrink-0"} />,
    label: "Instagram",
  },
  {
    href: "https://www.youtube.com/channel/UC9Qz9Miogea_axHlC9b-H4w",
    icon: <FaYoutube className={"h-7 w-7 flex-shrink-0"} />,
    label: "YouTube",
  },
  {
    href: "https://www.linkedin.com/company/algeriavirtualtravel/",
    icon: <FaLinkedin className={"h-7 w-7 flex-shrink-0"} />,
    label: "LinkedIn",
  },
];

export default Footer;
