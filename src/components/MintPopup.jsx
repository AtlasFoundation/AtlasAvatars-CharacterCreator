import axios from "axios"
import { BigNumber, ethers } from "ethers"
import React, { Fragment, useContext, useState } from "react"
import ethereumIcon from "../../public/ui/mint/ethereum.png"
import nearIcon from "../../public/ui/mint/near.png"
import mintPopupImage from "../../public/ui/mint/mintPopup.png"
import { AccountContext } from "../context/AccountContext"
import { SceneContext } from "../context/SceneContext"
import { useWalletSelector } from '../context/WalletSelectorContext'
import { providers, utils } from "near-api-js";

import { getModelFromScene, getScreenShot } from "../library/utils"
import { CharacterContract, EternalProxyContract, webaverseGenesisAddress } from "./Contract"
import MintModal from "./MintModal"
import { NFT_CONTRACT_ID } from "../constants/address";
import { AppMode, ViewContext } from "../context/ViewContext"

import styles from "./MintPopup.module.css"

const pinataApiKey = import.meta.env.VITE_PINATA_API_KEY
const pinataSecretApiKey = import.meta.env.VITE_PINATA_API_SECRET

const mintCost = 1

export default function MintPopup({templateInfo}) {
  const { avatar, skinColor, model } = useContext(SceneContext)
	const { selector, accountId } = useWalletSelector();
  const { setCurrentAppMode } = useContext(ViewContext)

  const [mintStatus, setMintStatus] = useState("")
  const [mintSuccess, setMintSuccess] = useState(false)

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

  // const nearCall = useCallback(
	// 	async (args, methodName, donation, receiverId) => {

	// 		const wallet = await selector.wallet();
	// 		const BOATLOAD_OF_GAS = utils.format.parseNearAmount("0.0000000003");

	// 		return wallet
	// 			.signAndSendTransaction({
	// 				signerId: accountId,
	// 				receiverId: receiverId? receiverId : NFT_CONTRACT_ID,
	// 				actions: [
	// 					{
	// 						type: "FunctionCall",
	// 						params: {
	// 							methodName: methodName,
	// 							args: { ...args },
	// 							gas: BOATLOAD_OF_GAS,
	// 							deposit: donation,
	// 						},
	// 					},
	// 				],
	// 			})
	// 			.catch((err) => {
	// 				console.log("error:", err)
	// 			});

	// 	},
	// 	[selector, accountId]
	// );

  const mintAsset = async (avatar) => {
    if(true) {
      setMintStatus("Uploading...")
      console.log('avatar in mintAsset', avatar)

      const glb = await getModelFromScene(avatar.clone(), "glb", skinColor)
      let glbName = "AvatarGlb_" + Date.now() + ".glb";
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
          setMintSuccess(true)
        }
      } catch (err) {
        setMintStatus("Mint failed! Please check your wallet.")
      }
      
    } else {
      return;
    }
  }

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
                {
                  !mintSuccess ? <div
                                  className={styles["StyledButton"]}
                                  onClick={() => setCurrentAppMode(AppMode.CREATOR)}
                                >
                                  {" "}
                                  {"OK"}
                                </div>
                    : <div
                        className={styles["StyledButton"]}
                        onClick={() => mintAsset(model)}
                      >
                        Mint
                      </div>
                }
                
                
                {/* )} */}
              </div>
            </Fragment>
          {/* )} */}
        </div>
      </div>
    // )
  )
}
