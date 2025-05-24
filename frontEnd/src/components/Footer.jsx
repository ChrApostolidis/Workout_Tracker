import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer id="contact" className={styles.containerFooter}>
      <div>
        <div className={styles.containerLinks}>
          <a href="https://github.com/ChrApostolidis" target="_blank" >
            <FontAwesomeIcon icon={faGithub} size="2x" color="#fff"  />
          </a>
          <a
            href="https://www.linkedin.com/in/xristos-apostolidis-5aa0912ab/"
            target="_blank"
          >
            <FontAwesomeIcon icon={faLinkedin} size="2x" color="#fff" />
          </a>
        </div>
        <div className={styles.mainParagraph}>
          <p>&copy; 2025 Chris Apostolidis. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
