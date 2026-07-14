import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlassSurface from "../../components/GlassSurface.jsx";
import COMPANY_MENU from "../../data/companyMenu.js";

export default function CompanyMenu({ open, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          className="company-menu-wrap"
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <GlassSurface as="ul" role="menu" className="company-menu" radius={20} blur={40}>
            {COMPANY_MENU.map((item) => (
              <li
                key={item.id}
                role="menuitem"
                tabIndex={0}
                className={`menu-item ${item.active ? "menu-item--active" : ""}`.trim()}
              >
                <span className="menu-item__icon">
                  <img src={item.icon} alt="" aria-hidden="true" />
                </span>
                <span className="menu-item__text">
                  <span className="menu-item__title">
                    {item.title}
                    {item.badge && <span className="badge">{item.badge}</span>}
                  </span>
                  <span className="menu-item__subtitle">{item.subtitle}</span>
                </span>
                <span className="menu-item__chevron" aria-hidden="true">›</span>
              </li>
            ))}
          </GlassSurface>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
