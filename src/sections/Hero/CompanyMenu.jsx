import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlassSurface from "../../components/GlassSurface.jsx";
import COMPANY_MENU from "../../data/companyMenu.js";
import arrow from "../../assets/icons/arrow.svg";

export default function CompanyMenu({ open, onClose, onMouseEnter }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="company-menu-wrap"
          onMouseEnter={onMouseEnter}
          // NOTE: no `scale` here. Scaling the wrapper scales its glass child,
          // which forces the `backdrop-filter` to re-sample every frame and
          // flashes the blur while the menu animates in. Opacity + y only keeps
          // the backdrop stable so the glass never flickers on appearance.
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <GlassSurface as="ul" role="menu" className="company-menu" radius={16} blur={40}>
            {COMPANY_MENU.map((item) => (
              <li key={item.id} role="menuitem" tabIndex={0} className="menu-item">
                <span
                  className="menu-item__icon"
                  aria-hidden="true"
                  dangerouslySetInnerHTML={{ __html: item.icon }}
                />
                <span className="menu-item__text">
                  <span className="menu-item__title">
                    {item.title}
                    {item.badge && <span className="badge">{item.badge}</span>}
                  </span>
                  <span className="menu-item__subtitle">{item.subtitle}</span>
                </span>
                <img className="menu-item__chevron" src={arrow} alt="" aria-hidden="true" />
              </li>
            ))}
          </GlassSurface>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
