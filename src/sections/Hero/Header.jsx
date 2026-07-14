import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import GlassSurface from "../../components/GlassSurface.jsx";
import Button from "../../components/Button.jsx";
import CompanyMenu from "./CompanyMenu.jsx";
import logo from "../../assets/logo.svg";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const companyBtnRef = useRef(null);

  return (
    <header className="hero-header">
      <Link to="/" className="hero-logo">
        <img src={logo} alt="Levels Socials" />
      </Link>

      <div className="nav-center">
        <GlassSurface as="nav" className="nav-pill" radius={22} blur={30}>
          <button
            ref={companyBtnRef}
            type="button"
            className="nav-company"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="nav-dot" aria-hidden="true" /> Company
            <span className={`nav-chevron ${menuOpen ? "is-open" : ""}`} aria-hidden="true">⌄</span>
          </button>
          <Link to="/blog">Blog</Link>
          <Link to="/help">Help Center</Link>
          <Link to="/contact">Contact</Link>
        </GlassSurface>
        <CompanyMenu open={menuOpen} onClose={() => setMenuOpen(false)} anchorRef={companyBtnRef} />
      </div>

      <div className="nav-actions">
        <Link to="/login" className="nav-login">Login</Link>
        <Button variant="glass">Create Account</Button>
      </div>
    </header>
  );
}
