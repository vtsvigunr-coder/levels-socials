import logo from "../../assets/logo.svg";
import arrowDown from "../../assets/icons/arrow-down.svg";
import "./Footer.css";

const NAV_LINKS = ["About", "How It Works", "Strategy Providers", "Affiliates"];
const RESOURCE_LINKS = ["Platform", "Blog", "Help Center", "Contact"];
const LEGAL_LINKS = ["Terms of Use", "Privacy Policy", "Cookies Policy"];

export default function FooterSection({ onBackToTop }) {
  return (
    <footer className="footer">
      <div className="footer__links">
        <img className="footer__logo" src={logo} alt="Levels Socials" />

        <div className="footer__col">
          <p className="footer__colhead">Navigate</p>
          <div className="footer__collinks">
            {NAV_LINKS.map((label) => (
              <p key={label} className="footer__link">{label}</p>
            ))}
          </div>
        </div>

        <div className="footer__col">
          <p className="footer__colhead">Resources</p>
          <div className="footer__collinks">
            {RESOURCE_LINKS.map((label) => (
              <p key={label} className="footer__link">{label}</p>
            ))}
          </div>
        </div>

        <div className="footer__col">
          <p className="footer__colhead">Contact</p>
          <div className="footer__collinks">
            <a className="footer__link" href="tel:+2(03)424245867">+2(03)424245867</a>
            <a className="footer__link" href="mailto:support@levelssocials.com">support@levelssocials.com</a>
          </div>
        </div>

        <div className="footer__col footer__col--wide">
          <div className="footer__addressblock">
            <p className="footer__colhead">Address:</p>
            <p className="footer__addresstext">
              Ground floor, The sotheby building, Rodney Bay, Gros-Islet, Saint-Lucia P.O Box 838, castries, Saint Lucia
            </p>
          </div>
          <div className="footer__addressblock">
            <p className="footer__colhead">Legal:</p>
            <p className="footer__addresstext">
              Levels Ltd is incorporated in Saint Lucia as an International Business Company with registration number 2024-00069, under the International Business Companies Act.
            </p>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <p className="footer__copyright">© 2026 Levels Socials. All rights reserved.</p>
        <div className="footer__legallinks">
          {LEGAL_LINKS.map((label) => (
            <p key={label} className="footer__legallink">{label}</p>
          ))}
        </div>
        <button type="button" className="footer__totop" onClick={onBackToTop}>
          Back to top
          <img className="footer__totopicon" src={arrowDown} alt="" aria-hidden="true" />
        </button>
      </div>

      <div className="footer__disclosure">
        <p className="footer__disclosureheading">Risk Disclosure &amp; Disclaimer:</p>
        <div className="footer__disclosuretext">
          <div className="footer__disclosurecol">
            <p>
              Levels Social operates as a CFD brokerage and provides a technology platform that enables users to
              trade Contracts for Difference (CFDs) and to connect with independent strategy providers for
              automated trade replication based on user-defined settings. Levels Social does not provide
              investment advice, portfolio management, or personalized trading recommendations.
            </p>
            <p>
              CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. You
              should consider whether you understand how CFDs work and whether you can afford to take the high
              risk of losing your money. Users may lose some or all of their invested capital.
            </p>
            <p>
              Any performance data, statistics, or risk classifications displayed on the platform are based on
              historical information and are provided for informational purposes only. Past performance is not
              indicative of future results and does not guarantee future performance.
            </p>
          </div>
          <div className="footer__disclosurecol">
            <p>
              Strategy providers available on the platform are independent and are not employees, agents, or
              representatives of Levels Social. Copy trading and automated execution do not eliminate risk. Trade
              execution, pricing, and results may vary due to market conditions, liquidity, slippage, latency,
              account settings, or other factors.
            </p>
            <p>
              Withdrawals, transfers, and account functionality are subject to account verification, applicable
              laws, platform terms, and standard processing times.
            </p>
            <p>
              Users are solely responsible for their trading decisions, account configuration, and risk exposure.
              Before trading CFDs, users should carefully consider their financial situation, level of experience,
              and risk tolerance.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
