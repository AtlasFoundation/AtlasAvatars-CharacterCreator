import React from "react";
import CircularProgress, {CircularProgressProps} from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useSpring, animated } from 'react-spring'
import Lottie from "lottie-react";
import lottie from '../data/lottie.json'

function CircularProgressWithLabel(props : CircularProgressProps & {
    value : number
}) {

    const [loadingAnimation, setLoadingAnimation] = useSpring(() => ({
     from: { y: 100, opacity : 0 },
     to: { y: 0, opacity : 1 },
    }))

    return (
    <animated.div style = {{...loadingAnimation}}>
        <Box sx={
        {   
            position: "absolute",
            zIndex: 1000,
            width: "100vw",
            height: "100vh",
            top: 0,
            left: 0,
            display: "flex",
            flexDirection :"column",
            alignItems: "center",
            justifyContent: "center",
            userSelect : "none"
        }
    }>
        <span style={{
            fontFamily: 'Proxima',
            fontStyle: 'normal',
            fontWeight: '400',
            fontSize: '18px',
            lineHeight: "32px",
            textAlign: "center",
            color: '#FFFFFF',
        }}
        >Loading your avatar</span>
        <Box sx={
                {
                    position: "relative",
                    display: "inline-flex"
                }
            }
            className="vh-centered">
            {/*<CircularProgress/>*/}
            <Box sx={
                {
                    // position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "start",
                    width: "237px",
                    height: '14px',
                    border : "2px solid  #645D8D",
                    borderRadius : "10px"
                }
            }>
               <Box sx={
                    {
                        // position: "absolute",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: Math.round(props.value * 2.31),
                        height: '6px',
                        backgroundColor: "#FFFFFF",
                        borderRadius : "10px",
                        transition : " width 1s",
                        margin : "10px"
                    }
                }>
{/*                      <Typography variant="caption" component="div" color="text.secondary">
                        {
                        `${
                            Math.round(props.value)
                        }%`
                    }</Typography>*/}
                </Box>
            </Box>
        </Box>
    <Lottie style =  {{
        zIndex : "-999",
        position:'absolute',
        height : "80vh",
    }} animationData={lottie} loop={true} />
    <div style = {{
        bottom : '0',
        position : "absolute",
    }}>
        <img src="/webaMark.svg"  style={{
            position : "absolute",
            left: "50%",
            transform: "translate(-50%, -20%)",
            bottom : "0",
            height : "100%"
        }}/>
        <div style = {{
            height : "20vh",
            width  : "100vw",
            background : "radial-gradient(49.5% 173.11% at 50.84% -79.89%, #95414E 30.36%, rgba(137, 61, 73, 0) 100%)",
            display : "flex",
            flexDirection : "column",
            transform: "rotate(-180deg)",
            bottom : "0",
        }}>
        </div>
    </div>
    </Box>
    </animated.div>
    );
}

export default function LoadingOverlayCircularStatic({loadingModelProgress}) {
    return <CircularProgressWithLabel value={loadingModelProgress}/>;
}
