import React from "react"
import atlasMark from "../../public/ui/loading/atlasLogo.png"

import { ViewContext } from "../context/ViewContext";

import styles from './LoadingOverlay.module.css'

export default function LoadingOverlayCircularStatic({
  title = "Loading"
}) {
  const { currentView } = React.useContext(ViewContext);
  return currentView.includes('LOADING') &&
  (
    <div className={styles['LoadingStyleBox']}>
      <span className = "loading-text" >
        {title}
      </span>
        <div className={styles["vh-centered"]}>
          <div className={styles["cover-loadingbar"]}>
            <div className={styles["loading-bar"]}>
            </div>
          </div>
        </div>
      <div className={styles["logo-container"]}>
          <img className={styles["atlasmark"]} src={atlasMark} />
        <div className={styles["logo-gradient"]}></div>
      </div>
    </div>
  )
}
