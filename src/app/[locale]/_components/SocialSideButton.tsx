import { socialLinks } from "@/components/Footer";
import { FaGlobe } from "react-icons/fa6";

export function SocialSideButton() {
  return (
    <div className="group border-avt-green fixed top-1/2 left-0 z-50 hidden -translate-y-1/2 items-center gap-2 rounded-e-full border-2 bg-white p-3 shadow-lg transition-all duration-300 hover:shadow-xl md:flex">
      {/* Globe Button */}
      <button className="flex shadow-lg transition-all duration-300 group-hover:hidden">
        <FaGlobe className="text-avt-green text-xl transition-all duration-300" />
      </button>

      {socialLinks.map((social) => (
        <a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.label}
          className="text-avt-green hidden transition-all duration-200 group-hover:flex hover:scale-110"
        >
          {social.icon}
        </a>
      ))}
    </div>
  );
}
