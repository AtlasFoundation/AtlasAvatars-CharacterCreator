import classnames from "classnames"
import { ethers } from "ethers"
import React, { useCallback, useContext, useEffect, useState } from "react"
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter"
import { AccountContext } from "../context/AccountContext"
import { SceneContext } from "../context/SceneContext"
import { combine } from "../library/merge-geometry"
import { getAvatarData } from "../library/utils"
import VRMExporter from "../library/VRMExporter"
import CustomButton from "./custom-button"
import { AppMode, ViewContext } from "../context/ViewContext"

import styles from "./UserMenu.module.css"
import { providers, utils } from "near-api-js";
import { useWalletSelector } from '../context/WalletSelectorContext'

export const UserMenu = () => {
  const type = "_Gen1" // class type

  const {currentAppMode, setCurrentAppMode} = useContext(ViewContext)
  const [showDownloadOptions, setShowDownloadOptions] = useState(false)
	const { selector, modal, accountId } = useWalletSelector();

  // const { ensName, setEnsName, connected, setConnected } =
  //   useContext(AccountContext)
  // const { activate, deactivate, account } = useWeb3React()

  const { skinColor, model, avatar } = useContext(SceneContext)

  const [mintStatus, setMintStatus] = useState("")

  // useEffect(() => {
  //   if (account) {
  //     _setAddress(account)
  //     setConnected(true)
  //   } else {
  //     setConnected(false)
  //     setMintStatus("Please connect your wallet.")
  //   }
  // }, [account])

  // const _setAddress = async (address) => {
  //   const { name } = await getAccountDetails(address)
  //   console.log("ens", name)
  //   setEnsName(name ? name.slice(0, 15) + "..." : "")
  // }

  const disconnectWallet = async () => {
		const wallet = await selector.wallet();

		wallet.signOut().catch((err) => {
			console.log("Failed to sign out");
			console.error(err);
		});
  }

  const handleDownload = () => {
    showDownloadOptions
      ? setShowDownloadOptions(false)
      : setShowDownloadOptions(true)
  }

  const connectWallet = () => {
		modal.show()
  }

  async function download(
    avatarToDownload,
    fileName,
    format,
    atlasSize = 4096,
  ) {
    // We can use the SaveAs() from file-saver, but as I reviewed a few solutions for saving files,
    // this approach is more cross browser/version tested then the other solutions and doesn't require a plugin.
    const link = document.createElement("a")
    link.style.display = "none"
    document.body.appendChild(link)
    function save(blob, filename) {
      link.href = URL.createObjectURL(blob)
      link.download = filename
      link.click()
    }

    function saveString(text, filename) {
      save(new Blob([text], { type: "text/plain" }), filename)
    }

    function saveArrayBuffer(buffer, filename) {
      save(getArrayBuffer(buffer), filename)
    }
    // Specifying the name of the downloadable model
    const downloadFileName = `${
      fileName && fileName !== "" ? fileName : "AvatarCreatorModel"
    }`

    console.log('avatarToDownload', avatarToDownload)

    const avatarToCombine = avatarToDownload.clone()

    const exporter = format === "glb" ? new GLTFExporter() : new VRMExporter()
    const avatarModel = await combine({
      transparentColor: skinColor,
      avatar: avatarToCombine,
      atlasSize,
    })
    if (format === "glb") {
      exporter.parse(
        avatarModel,
        (result) => {
          if (result instanceof ArrayBuffer) {
            saveArrayBuffer(result, `${downloadFileName}.glb`)
          } else {
            const output = JSON.stringify(result, null, 2)
            saveString(output, `${downloadFileName}.gltf`)
          }
        },
        (error) => {
          console.error("Error parsing", error)
        },
        {
          trs: false,
          onlyVisible: false,
          truncateDrawRange: true,
          binary: true,
          forcePowerOfTwoTextures: false,
          maxTextureSize: 1024 || Infinity,
        },
      )
    } else {

      const vrmData = {...getVRMBaseData(avatar), ...getAvatarData(avatarModel, "UpstreetAvatar")}
      exporter.parse(vrmData, avatarModel, (vrm) => {
        saveArrayBuffer(vrm, `${downloadFileName}.vrm`)
      })
    }
  }

  function getVRMBaseData(avatar){
    // to do, merge data from all vrms, not to get only the first one
    for (const prop in avatar){
      if (avatar[prop].vrm){
        return avatar[prop].vrm
      }
    }
  }

  function getArrayBuffer(buffer) {
    return new Blob([buffer], { type: "application/octet-stream" })
  }

  return (
    <div className={classnames(styles.userBoxWrap)}>
      <div className={styles.leftCorner} />
      <div className={styles.rightCorner} />
      <ul>
          <React.Fragment>
            <li>
              <CustomButton
                type="icon"
                theme="light"
                icon={showDownloadOptions ? "close" : "download" }
                size={32}
                onClick={handleDownload}
              />
              {showDownloadOptions && (
                <div className={styles.dropDown}>
                  <CustomButton
                    theme="light"
                    text="Download GLB"
                    icon="download"
                    size={14}
                    onClick={() => {
                      download(model, `UpstreetAvatar_${type}`, "glb")
                    }}
                  />
                  <CustomButton
                    theme="light"
                    text="Download VRM"
                    icon="download"
                    size={14}
                    onClick={() => {
                      download(model, `UpstreetAvatar_${type}`, "vrm")
                    }}
                  />
                </div>
              )}
            </li>
            <li>
              <CustomButton
                type="icon"
                theme="light"
                icon="mint"
                size={32}
                onClick={() => {
                  setCurrentAppMode(AppMode.MINT);     
                }}
              />
            </li>
          </React.Fragment>
        {accountId ? (
          <React.Fragment>
            <li>
              <div className={styles.loggedInText}>
                <div className={styles.chainName}>Testnet</div>
                  <div className={styles.walletAddress}>
                    { accountId.slice(0, 4) + ".." + accountId.slice(-7) }
                  </div>
              </div>
              <CustomButton
                type="login"
                theme="dark"
                icon="logout"
                onClick={disconnectWallet}
                size={28}
                className={styles.loginButton}
              />
            </li>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <li>
              <div className={styles.loggedOutText}>
                Not
                <br />
                Connected
              </div>
              <CustomButton
                type="login"
                theme="dark"
                icon="login"
                onClick={connectWallet}
                size={28}
                className={styles.loginButton}
              />
            </li>
          </React.Fragment>
        )}
      </ul>
    </div>
  )
}
