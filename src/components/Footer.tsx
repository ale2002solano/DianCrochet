import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';



export default function Footer(){
    return(
        <footer className="bg-black text-white py-4 font-koulen">
      <div className="container mx-auto text-center">
        <p className="font-bold uppercase">Dian Crochet Tejiendo lo que pienso</p>
        <div className="mt-4 flex justify-center space-x-6">
          <a href="https://www.facebook.com/manzanitadian" aria-label="Facebook">
            <FontAwesomeIcon icon={faFacebook} className="fa-lg" />
          </a>
          <a href="https://www.instagram.com/dian.crochett/" aria-label="Instagram">
            <FontAwesomeIcon icon={faInstagram} className="fa-lg" />
          </a>
          <a href="https://www.linkedin.com/company/crochet/" aria-label="LinkedIn">
            <FontAwesomeIcon icon={faLinkedin} className="fa-lg" />
          </a>
        </div>
        <p className="mt-4 text-sm">Dian Crochet 2024</p>
      </div>
    </footer>
    )
}
    