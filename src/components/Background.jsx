import React from "react"
import logo from "../ui/Atlaslogo.png"
import styles from "./Background.module.css"

export default function Background() {
  return (
    <div className={styles["backgroundImg"]}>
      <div className={styles["backgroundBlur"]}></div>
      <div className={styles["Background"]}>
        <div className={styles["atlasmark"]}>
          <img src={logo} className={styles["logo"]} />
        </div>
      </div>
    </div>
  )
}
