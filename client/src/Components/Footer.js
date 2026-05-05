import logo from "../img/logo.png";

const Footer = () => {
  return (
    <footer className="nursery-footer">
      <div className="footer-brand">
        <img src={logo} alt="Ghars Logo" className="footer-logo" />
        <span>غرس</span>
      </div>
      <div className="footer-copy">
        © 2025 Ghars Community · جميع الحقوق محفوظة · Growing Together 🌿
      </div>
    </footer>
  );
};

export default Footer;