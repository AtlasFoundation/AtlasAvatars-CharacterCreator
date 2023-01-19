import { Web3Provider } from "@ethersproject/providers"
import { Web3ReactProvider } from "@web3-react/core"
import React, { Suspense } from "react"
import ReactDOM from "react-dom/client"
import { AudioProvider } from "./context/AudioContext"

import { AccountProvider } from "./context/AccountContext"
import { SceneProvider } from "./context/SceneContext"
import { ViewProvider } from "./context/ViewContext"
import { WalletSelectorContextProvider } from './context/WalletSelectorContext'
import "@near-wallet-selector/modal-ui/styles.css";



import LoadingOverlay from "./components/LoadingOverlay"

import App from "./components/App"


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WalletSelectorContextProvider>
      <AudioProvider>
        <ViewProvider>
          <SceneProvider>
          <LoadingOverlay />
            <Suspense>
              <App />
            </Suspense>
          </SceneProvider>
        </ViewProvider>
      </AudioProvider>
    </WalletSelectorContextProvider>
  </React.StrictMode>,
)
