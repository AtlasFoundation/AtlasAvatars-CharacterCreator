import React, { Fragment, useContext, useEffect } from "react"
import ReactDOM from "react-dom/client"
import Background from "./components/Background"
import { AudioProvider } from "./context/AudioContext"
import Landing from "./components/Landing"
import { UserMenu } from "./components/UserMenu"

import Scene from "./components/Scene"
import { ViewProvider, ViewContext, ViewStates } from "./context/ViewContext"
import { SceneContext, SceneProvider } from "./context/SceneContext"
import { WalletSelectorContextProvider } from './context/WalletSelectorContext'
import MintPopup from "./components/MintPopup"
import "@near-wallet-selector/modal-ui/styles.css";
// import Gate from "./components/Gate"

// dynamically import the manifest
const assetImportPath = import.meta.env.VITE_ASSET_PATH + "/manifest.json"

function App() {
  const { template, setTemplate } = useContext(SceneContext)
  const { setCurrentView } = useContext(ViewContext)
  // fetch the manifest, then set it
  useEffect(() => {
    async function fetchManifest() {
      const response = await fetch(assetImportPath)
      const data = await response.json()
      return data
    }

    fetchManifest().then((data) => {
      setTemplate(data)
      setCurrentView(ViewStates.LANDER_LOADING)
    })
  }, [])
  return (
    template && (
      <Fragment>
        <Background />
        {/* <Gate /> */}

        <Landing />
        <Scene />
        <UserMenu />
      </Fragment>
    )
  )
}

function AppContainer(){
  return (
  <AudioProvider>
    <ViewProvider>
      <SceneProvider>
        <App />
      </SceneProvider>
    </ViewProvider>
  </AudioProvider>
  )
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <WalletSelectorContextProvider>
    <AppContainer />
  </WalletSelectorContextProvider>
)
