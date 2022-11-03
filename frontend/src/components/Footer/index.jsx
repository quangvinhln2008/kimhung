import React from "react";
import styles from './index.module.css'

const Footer =() =>{
  return(
    <footer className={styles.footer}>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
          >
            Copyright:{' '} © 2022 Công ty TNHH Kim Hưng
          </a>
        </footer>
  )
}

export default Footer;