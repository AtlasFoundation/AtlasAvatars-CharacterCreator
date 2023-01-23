import axios from "axios"
import { BigNumber, ethers } from "ethers"
import React, { Fragment, useContext, useState } from "react"
import mintPopupImage from "../../public/ui/mint/mintPopup.png"
import polygonIcon from "../../public/ui/mint/polygon.png"
import ethereumIcon from "../../public/ui/mint/ethereum.png"
import nearIcon from "../../public/ui/mint/near.png"
import { AccountContext } from "../context/AccountContext"
import { SceneContext } from "../context/SceneContext"
import { ViewContext, ViewStates } from "../context/ViewContext"
import { useWalletSelector } from '../context/WalletSelectorContext'
import { providers, utils } from "near-api-js";

import { NFT_CONTRACT_ID } from "../services/address";
import { getModelFromScene, getScreenShot } from "../library/utils"
import { CharacterContract, EternalProxyContract, webaverseGenesisAddress } from "./Contract"
import MintModal from "./MintModal"

import styles from "./MintPopup.module.css"

const pinataApiKey = import.meta.env.VITE_PINATA_API_KEY
const pinataSecretApiKey = import.meta.env.VITE_PINATA_API_SECRET

const mintCost = 1

export default function MintPopup() {
  const { template, avatar, skinColor, model, currentTemplate } = useContext(SceneContext)
  const { currentView, setCurrentView } = useContext(ViewContext)
  const { selector, accountId } = useWalletSelector();

  const [mintStatus, setMintStatus] = useState("")

  const currentTemplateIndex = parseInt(currentTemplate.index === undefined ? currentTemplate.index : 1)
  const templateInfo = template[currentTemplateIndex]

  async function saveFileToPinata(fileData, fileName) {
    if (!fileData) return console.warn("Error saving to pinata: No file data")
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`
    let data = new FormData()

    data.append("file", fileData, fileName)
    let resultOfUpload = await axios.post(url, data, {
      maxContentLength: "Infinity", //this is needed to prevent axios from erroring out with large files
      maxBodyLength: "Infinity", //this is needed to prevent axios from erroring out with large files
      headers: {
        "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataSecretApiKey,
      },
    })
    return resultOfUpload.data
  }

  const mintAsset = async (avatar) => {
    // const pass = await checkOT(walletAddress);
    if(true) {
      setCurrentView(ViewStates.MINT_CONFIRM)
      setMintStatus("Uploading...")
      console.log('avatar in mintAsset', avatar)

      const glb = await getModelFromScene(avatar.scene.clone(), "glb", skinColor)
      const glbName = "AvatarGlb_" + Date.now() + ".glb";
      const glbHash = await saveFileToPinata(
        glb,
        glbName
      )
      const wallet = await selector.wallet();
			const BOATLOAD_OF_GAS = utils.format.parseNearAmount("0.0000000003");
			const DEPOSITE = utils.format.parseNearAmount("1");

      try {
        const res = await wallet.signAndSendTransaction({
					signerId: accountId,
					receiverId: NFT_CONTRACT_ID,
					actions: [
						{
							type: "FunctionCall",
							params: {
								methodName: "nft_mint",
								args: { 
                  token_id: `${accountId}-Character-Avatar`,
                  token_metadata: {
                    title: "Character Creator on Near Chain",
                    description: "Character Avatar from Character Creator",
                    media:
                      `https://gateway.pinata.cloud/ipfs/${glbHash.IpfsHash}`,
                  },
                  receiver_id: accountId,
                 },
								gas: BOATLOAD_OF_GAS,
                deposit: DEPOSITE
							},
						},
					],
        })

        if(res.status.SuccessValue) {
          setMintStatus("Mint success!")
        }
      } catch (err) {
        setMintStatus("Public Mint failed! Please check your wallet.")
      }
    } else {
      return;
    }
  }

  // const checkOT = async (address) => {
  //   if(address) {
  //     // const address = '0x6e58309CD851A5B124E3A56768a42d12f3B6D104'
  //     const chainId = 1 // 1: ethereum mainnet, 4: rinkeby 137: polygon mainnet 5: // Goerli testnet
  //     const ethersigner = ethers.getDefaultProvider("mainnet", {
  //       alchemy: import.meta.env.VITE_ALCHEMY_API_KEY,
  //     })
  //     const contract = new ethers.Contract(EternalProxyContract.address, EternalProxyContract.abi, ethersigner);
  //     const webaBalance = await contract.beneficiaryBalanceOf(address, webaverseGenesisAddress, 1);
  //     console.log("webaBalance", webaBalance)
  //     if(parseInt(webaBalance) > 0) return true;
  //     else {
  //       setMintStatus("Currently in alpha. You need a genesis pass to mint. \n Will be public soon!")
  //       return false;
  //     }
  //   } else {
  //     setMintStatus("Please connect your wallet")
  //     return false;
  //   }
  // }

  const showTrait = (trait) => {
    if (trait.name in avatar) {
      if ("traitInfo" in avatar[trait.name]) {
        return avatar[trait.name].name
      } else return "Default " + trait.name
    } else return "No set"
  }

  return (
    // currentView.includes("MINT") && (
      <div className={styles["StyledContainer"]}>
        <div className={styles["StyledBackground"]} />
        <div className={styles["StyledPopup"]}>
          {/* {connected && ( */}
            <Fragment>
              <div className={styles["Header"]}>
                <img
                  src={mintPopupImage}
                  className={mintStatus}
                  height={"50px"}
                />
                <div className={styles["mintTitle"]}>Mint Avatar</div>
              </div>
              <MintModal model={model} />
              <div className={styles["TraitDetail"]}>
                {templateInfo.traits &&
                  templateInfo.traits.map((item, index) => (
                    <div className={styles["TraitBox"]} key={index}>
                      <div className={styles["TraitImage"]} />
                      <img src={templateInfo.traitIconsDirectory + item.icon} />
                      <div className={styles["TraitText"]}>{showTrait(item)}</div>
                    </div>
                  ))}
              </div>
              <div className={styles["MintPriceBox"]}>
                <div className={styles["MintCost"]}>
                  {"Mint Price: "}
                </div>
                <div className={styles["TraitImage"]} />
                <img src={nearIcon} height={"50%"} />
                <div className={styles["MintCost"]}>
                  &nbsp;{mintCost}
                </div>
              </div>
              <div className={styles["Title"]} fontSize={"1rem"}>
                {mintStatus}
              </div>
              <div className={styles["ButtonPanel"]}>
                <div
                  className={styles["StyledButton"]}
                  onClick={() => setCurrentView(ViewStates.CREATOR)}
                >
                  {" "}
                  {currentView === ViewStates.MINT_COMPLETE ? "Ok" : "Cancel"}
                </div>
                {currentView !== ViewStates.MINT_COMPLETE && (
                  <div
                    className={styles["StyledButton"]}
                    onClick={() => mintAsset(model)}
                  >
                    Mint
                  </div>
                )}
              </div>
            </Fragment>
          {/* )} */}
        </div>
      </div>
    // )
  )
}
