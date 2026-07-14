import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import GlassSurface from "../../components/GlassSurface.jsx";
import Button from "../../components/Button.jsx";
import CompanyMenu from "./CompanyMenu.jsx";
import logo from "../../assets/logo.svg";
import arrow from "../../assets/icons/arrow.svg";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeTimer = useRef(null);

  const open = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMenuOpen(true);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMenuOpen(false), 140);
  };

  return (
    <header className="hero-header">
      <Link to="/" className="hero-logo">
        <img src={logo} alt="Levels Socials" />
      </Link>

      {/* nav-center owns the hover region; the dropdown is a SIBLING of the pill
          (not a descendant) so the pill's backdrop-filter doesn't clip the
          dropdown's own glass. */}
      <div className="nav-center" onMouseLeave={scheduleClose}>
        <GlassSurface as="nav" className="nav-pill" radius={600} blur={29}>
          <button
            type="button"
            className="nav-company"
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            onMouseEnter={open}
            onFocus={open}
          >
            <span className="nav-dot" aria-hidden="true" />
            Company
            <img
              src={arrow}
              alt=""
              aria-hidden="true"
              className={`nav-chevron ${menuOpen ? "is-open" : ""}`}
            />
          </button>
          <Link to="/blog">Blog</Link>
          <Link to="/help">Help Center</Link>
          <Link to="/contact">Contact</Link>
        </GlassSurface>
        <CompanyMenu open={menuOpen} onClose={() => setMenuOpen(false)} onMouseEnter={open} />
      </div>

      <div className="nav-actions">
        <Link to="/login" className="nav-login">Login</Link>
        <Button variant="glass" className="btn--notch-bl btn--account">Create Account</Button>
      </div>
    </header>
  );
}
