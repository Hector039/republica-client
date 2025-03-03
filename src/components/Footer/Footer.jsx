import { Link } from "react-router-dom";
import PhoneIcon from "./assets/icon-phone.svg";
import LocationIcon from "./assets/icon-location.svg";
import LogoFooter from "../NavBar/assets/logo.jpeg";
import FacebookIcon from "./assets/facebook-icon.jpg";
import InstagramIcon from "./assets/instagram-icon.jpg";
import WhatsappIcon from "./assets/WhatsApp.svg.png";
import"./assets/footer.css";

export default function Footer() {
    return (
        <footer className="footer-bar">
            <div className="footer-main">

                <div className="footer-brand">
                    <Link to={"/"}>
                        <img src={LogoFooter} alt="Tienda Logo" />
                    </Link>

                </div>

                <div className="contacto-footer">
                    <div className="contacto">
                        <div>
                            <img src={PhoneIcon} alt="icono teléfono" />
                        </div>
                        <div>
                            <p className="text-title">Teléfono:</p>
                            <p className="text-white">3425462491</p>
                        </div>
                    </div>
                    <div className="contacto">
                        <div>
                            <img src={LocationIcon} alt="icono Ubicación" />
                        </div>
                        <div>
                            <p className="text-title">Club República del Oeste:</p>
                            <p className="text-white">Avenida freyre 2765, Santa Fe Capital</p>
                        </div>
                    </div>
                    <div className="footer-networks">

                        <Link to={"https://www.facebook.com/"} target="_blank" rel="noreferrer" className="network-icon">
                            <img src={FacebookIcon} alt="Facebook Icono" />
                        </Link>
                        <Link to={"https://www.instagram.com/"} target="_blank" rel="noreferrer" className="network-icon">
                            <img src={InstagramIcon} alt="Instagram Icono" />
                        </Link>
                        <Link to={"https://web.whatsapp.com/"} target="_blank" rel="noreferrer" className="network-icon">
                            <img src={WhatsappIcon} alt="Whatsapp Icono" />
                        </Link>

                    </div>
                </div>

                
            </div>

            <div className="footer-rights">
                <p>2025 / Desarrollado por HM</p>
            </div>

        </footer>
    )
}