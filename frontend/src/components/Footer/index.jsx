import React from "react";
import styles from './index.module.css'

const Footer =() =>{
  return(
    <footer className={styles.footer}>
          <a
            href="https://thuvien.ufm.edu.vn/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Copyright:{' '} © 2022 Trung tâm học liệu - Trường Đại học Tài chính-Marketing
          </a>
        </footer>
  )
}

export default Footer;