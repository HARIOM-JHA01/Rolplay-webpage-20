import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Facebook, Linkedin, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";

/* ── Second Brain logo image ── */
const SecondBrainLogo = ({ size = 20 }) => (
  <img
    src="/second-brain-logo.jpg"
    alt="Second Brain"
    width={size}
    height={size}
    style={{ objectFit: "contain", display: "inline-block" }}
    draggable={false}
  />
);

/* ── CallMentor AI logo image ── */
const CallMentorLogo = ({ size = 20 }) => (
  <img
    src="/callmentor-logo.jpg"
    alt="CallMentor AI"
    width={size}
    height={size}
    style={{ objectFit: "contain", display: "inline-block" }}
    draggable={false}
  />
);

const PRODUCT_LINKS = [
  {
    label: "Second Brain",
    href: "https://second-brain-shz8.onrender.com/",
    Icon: SecondBrainLogo,
    testid: "nav-second-brain",
  },
  {
    label: "CallMentor AI",
    href: "https://callmentorai-rolplay.vercel.app/",
    Icon: CallMentorLogo,
    testid: "nav-callmentor",
  },
];

const Logo = () => (
  <div className="flex items-center group" data-testid="brand-logo">
    <div className="relative overflow-hidden rounded-md transition-all duration-500 group-hover:drop-shadow-[0_0_12px_rgba(192,57,43,0.7)]">
      <img
        src="/logo.png"
        alt="RolPlay"
        className="h-9 w-auto object-contain"
        style={{ filter: "brightness(1.05) contrast(1.05)" }}
        draggable={false}
      />
    </div>
  </div>
);

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const activeLang = i18n.language?.startsWith("es") ? "ES" : "EN";

  const switchLang = (lang) => {
    const code = lang === "EN" ? "en" : "es";
    i18n.changeLanguage(code);
    localStorage.setItem("rolplay_lang", code);
  };

  const links = [
    { to: "/", label: t("nav.home") },
    { to: "/about", label: t("nav.about") },
    { to: "/benefits", label: t("nav.benefits") },
    { to: "/achievements", label: t("nav.achievements") },
    { to: "/success-stories", label: t("nav.successStories") },
    { to: "/contact", label: t("nav.contact") },
    { to: "/faqs", label: t("nav.faqs") },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <motion.nav
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-white ${
        scrolled ? "shadow-md border-b border-gray-100" : "border-b border-gray-200/60"
      }`}
      data-testid="main-nav"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-[72px] flex items-center justify-between">
        <Link to="/" data-testid="nav-logo-link">
          <Logo />
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              data-testid={`nav-link-${l.to.replace(/\//g, "") || "home"}`}
              className={({ isActive }) =>
                `relative px-2.5 py-2 text-sm font-medium tracking-wide whitespace-nowrap transition-colors ${
                  isActive ? "text-[#C0392B]" : "text-zinc-600 hover:text-zinc-900"
                } group`
              }
            >
              {({ isActive }) => (
                <>
                  {l.label}
                  <span
                    className={`absolute left-2.5 right-2.5 -bottom-0.5 h-px bg-[#C0392B] origin-left transition-transform duration-500 ${
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">

          {/* ── Product quick-links ─────────────────────── */}
          <div className="hidden lg:flex items-center gap-1.5 mr-1">
            {PRODUCT_LINKS.map(({ label, href, Icon, testid }) => (
              <a
                key={testid}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                data-testid={testid}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wide border border-gray-200 text-zinc-600 hover:border-[#C0392B] hover:text-[#C0392B] hover:bg-red-50 transition-all duration-200 group"
              >
                <Icon size={26} />
                {label}
                <ExternalLink size={9} className="opacity-0 group-hover:opacity-60 transition-opacity" />
              </a>
            ))}
          </div>

          {/* ── Thin separator ──────────────────────────── */}
          <div className="hidden lg:block w-px h-5 bg-gray-200 mx-1" />

          <div
            className="hidden md:flex items-center border border-gray-200 rounded-full p-0.5 text-[11px] font-mono tracking-widest bg-gray-50"
            data-testid="lang-toggle"
            role="group"
            aria-label="Language selector"
          >
            {["EN", "ES"].map((lang) => (
              <button
                key={lang}
                onClick={() => switchLang(lang)}
                data-testid={`lang-${lang.toLowerCase()}`}
                aria-pressed={activeLang === lang}
                className={`px-2.5 py-1 rounded-full transition-all ${
                  activeLang === lang
                    ? "bg-[#C0392B] text-white"
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-zinc-400">
            <a
              href="https://www.facebook.com/profile.php?id=61582917112897"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-8 h-8 rounded-full grid place-items-center hover:text-[#C0392B] hover:bg-red-50 transition"
              data-testid="nav-facebook"
            >
              <Facebook size={15} />
            </a>
            <a
              href="https://www.linkedin.com/company/rolplaymx/posts/?feedView=all"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-8 h-8 rounded-full grid place-items-center hover:text-[#C0392B] hover:bg-red-50 transition"
              data-testid="nav-linkedin"
            >
              <Linkedin size={15} />
            </a>
          </div>

          <button
            onClick={() => setOpen((o) => !o)}
            className="lg:hidden w-10 h-10 grid place-items-center text-zinc-700 hover:text-zinc-900"
            data-testid="mobile-menu-toggle"
            aria-label="menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="lg:hidden bg-white border-t border-gray-100 shadow-lg"
            data-testid="mobile-menu"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  data-testid={`mobile-nav-link-${l.to.replace(/\//g, "") || "home"}`}
                  className={({ isActive }) =>
                    `px-3 py-3 text-base rounded-md font-medium ${
                      isActive ? "text-[#C0392B] bg-red-50" : "text-zinc-600 hover:text-zinc-900 hover:bg-gray-50"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              {/* Product links in mobile menu */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="px-3 mb-2 text-[10px] font-mono tracking-[0.2em] text-zinc-400 uppercase">
                  Productos
                </div>
                {PRODUCT_LINKS.map(({ label, href, Icon, testid }) => (
                  <a
                    key={testid}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid={`mobile-${testid}`}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-zinc-600 hover:text-[#C0392B] hover:bg-red-50 transition-colors"
                  >
                    <Icon size={26} />
                    {label}
                    <ExternalLink size={11} className="ml-auto text-zinc-300" />
                  </a>
                ))}
              </div>

              <div className="flex items-center gap-2 mt-3 px-3">
                {["EN", "ES"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => switchLang(lang)}
                    data-testid={`mobile-lang-${lang.toLowerCase()}`}
                    aria-pressed={activeLang === lang}
                    className={`px-3 py-1 rounded-full text-xs font-mono tracking-widest transition-all ${
                      activeLang === lang
                        ? "bg-[#C0392B] text-white"
                        : "text-zinc-500 border border-gray-200 hover:text-zinc-800"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
