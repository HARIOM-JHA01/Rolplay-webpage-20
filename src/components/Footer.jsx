import { Link } from "react-router-dom";
import { Facebook, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  const cities = t("footer.cities", { returnObjects: true });

  return (
    <footer className="relative noise-overlay border-t border-gray-200 bg-white overflow-hidden" data-testid="site-footer">
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-3xl pointer-events-none opacity-10"
        style={{ background: "radial-gradient(circle, rgba(192,57,43,0.4), transparent 60%)" }}
      />
      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-14">
          <div className="md:col-span-5">
            <img src="/logo.png" alt="RolPlay" className="h-12 w-auto mb-4" draggable={false} />
            <p className="text-zinc-600 max-w-md leading-relaxed">{t("footer.tagline")}</p>
            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://www.facebook.com/profile.php?id=61582917112897"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full grid place-items-center border border-gray-200 text-zinc-500 hover:border-[#C0392B]/50 hover:text-[#C0392B] transition-all duration-300"
                data-testid="footer-facebook"
              >
                <Facebook size={16} />
              </a>
              <a
                href="https://www.linkedin.com/company/rolplaymx/posts/?feedView=all"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-full grid place-items-center border border-gray-200 text-zinc-500 hover:border-[#C0392B]/50 hover:text-[#C0392B] transition-all duration-300"
                data-testid="footer-linkedin"
              >
                <Linkedin size={16} />
              </a>
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="font-mono text-[11px] tracking-[0.2em] text-[#C0392B] uppercase mb-5">
              {t("footer.locations")}
            </div>
            <ul className="space-y-3">
              {Array.isArray(cities) && cities.map((l) => (
                <motion.li
                  key={l.city}
                  whileHover={{ x: 4 }}
                  className="flex items-start gap-2 text-sm"
                >
                  <MapPin size={14} className="text-[#C0392B] mt-1" />
                  <span>
                    <span className="text-[#C0392B] font-medium">{l.city}</span>
                    <span className="text-zinc-600">, {l.country}</span>
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <div className="font-mono text-[11px] tracking-[0.2em] text-[#C0392B] uppercase mb-5">
              {t("footer.contactTitle")}
            </div>
            <div className="space-y-3">
              <a
                href="mailto:info@rolplay.ai"
                className="flex items-center gap-3 text-sm text-zinc-600 hover:text-zinc-900 group"
                data-testid="footer-email"
              >
                <Mail size={14} className="text-[#C0392B]" />
                <span className="transition">info@rolplay.ai</span>
              </a>
              <a
                href="tel:+525518006006"
                className="flex items-center gap-3 text-sm text-zinc-600 hover:text-zinc-900"
                data-testid="footer-phone"
              >
                <Phone size={14} className="text-[#C0392B]" />
                <span>+52 55 1800 6006</span>
              </a>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 text-xs">
              <Link to="/" className="text-zinc-500 hover:text-zinc-900">{t("nav.home")}</Link>
              <span className="text-zinc-300">/</span>
              <Link to="/about" className="text-zinc-500 hover:text-zinc-900">{t("nav.about")}</Link>
              <span className="text-zinc-300">/</span>
              <Link to="/benefits" className="text-zinc-500 hover:text-zinc-900">{t("nav.benefits")}</Link>
              <span className="text-zinc-300">/</span>
              <Link to="/contact" className="text-zinc-500 hover:text-zinc-900">{t("nav.contact")}</Link>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-zinc-500 font-mono tracking-widest">{t("footer.copyright")}</p>
          <p className="text-xs text-zinc-500 font-mono tracking-widest">{t("footer.award")}</p>
        </div>
      </div>
    </footer>
  );
}
