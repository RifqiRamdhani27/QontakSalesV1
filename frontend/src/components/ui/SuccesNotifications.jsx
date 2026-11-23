import { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

const overlayIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const overlayOut = keyframes`
  from { opacity: 1; }
  to   { opacity: 0; }
`;

const cardIn = keyframes`
  0%   { opacity: 0; transform: translateY(40px) scale(0.82); }
  60%  { opacity: 1; transform: translateY(-6px) scale(1.03); }
  80%  { transform: translateY(2px) scale(0.995); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
`;

const cardOut = keyframes`
  0%   { opacity: 1; transform: translateY(0) scale(1); }
  100% { opacity: 0; transform: translateY(-24px) scale(0.9); }
`;

const iconPop = keyframes`
  0%   { opacity: 0; transform: scale(0); }
  50%  { opacity: 1; transform: scale(1.25); }
  70%  { transform: scale(0.92); }
  100% { opacity: 1; transform: scale(1); }
`;

const ringPulse = keyframes`
  0%   { transform: scale(0.6); opacity: 0.7; }
  100% { transform: scale(2.2); opacity: 0; }
`;

const waveMove = keyframes`
  0%   { transform: rotate(90deg) translateX(0); }
  50%  { transform: rotate(90deg) translateX(-6px); }
  100% { transform: rotate(90deg) translateX(0); }
`;

const textIn = keyframes`
  from { opacity: 0; transform: translateX(-14px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const progress = keyframes`
  from { transform: scaleX(1); }
  to   { transform: scaleX(0); }
`;

export default function SuccessCard({
    open,
    title = "Sign up berhasil!",
    subtitle = "Akun kamu sudah dibuat. Mengarahkan ke login...",
    duration = 2600,
    onClose,
}) {
    const [closing, setClosing] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (open) {
            setClosing(false);
            setVisible(true);
        } else if (visible) {
            setClosing(true);
            const t = setTimeout(() => setVisible(false), 380);
            return () => clearTimeout(t);
        }
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const t = setTimeout(() => {
            setClosing(true);
            setTimeout(() => {
                setVisible(false);
                onClose?.();
            }, 380);
        }, duration);
        return () => clearTimeout(t);
    }, [open, duration, onClose]);

    if (!visible) return null;

    return (
        <Box
            position="fixed"
            inset={0}
            zIndex={9999}
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg="rgba(0,0,0,0.35)"
            backdropFilter="blur(3px)"
            animation={`${closing ? overlayOut : overlayIn} ${closing ? 380 : 260
                }ms ease forwards`}
            onClick={() => {
                setClosing(true);
                setTimeout(() => {
                    setVisible(false);
                    onClose?.();
                }, 380);
            }}
        >
            <Box
                role="alertdialog"
                aria-live="polite"
                onClick={(e) => e.stopPropagation()}
                position="relative"
                w={{ base: "90%", sm: "800px", md: "460px" }}
                minH="90px"
                borderRadius="12px"
                boxSizing="border-box"
                p="10px 15px"
                bg="#ffffff"
                boxShadow="rgba(30, 35, 39, 0.2) 0px 8px 24px"
                display="flex"
                alignItems="center"
                justifyContent="space-around"
                gap="15px"
                overflow="hidden"
                animation={`${closing ? cardOut : cardIn} ${closing ? 380 : 720
                    }ms cubic-bezier(0.22,1,0.36,1) forwards`}
            >
                {/* Wave background */}
                <Box
                    as="svg"
                    viewBox="0 0 1440 320"
                    xmlns="http://www.w3.org/2000/svg"
                    position="absolute"
                    left="-22px"         
                    top="-10px"          
                    h="calc(100% + 20px)" 
                    w="80px"
                    fill="#11d9d966"
                    transform="rotate(90deg)"
                    transformOrigin="top left"
                    animation={`${waveMove} 3.2s ease-in-out infinite`}
                    pointerEvents="none"
                    zIndex={0}
                >
                    <path
                        d="M0,256L11.4,240C22.9,224,46,192,69,192C91.4,192,114,224,137,234.7C160,245,183,235,206,213.3C228.6,192,251,160,274,149.3C297.1,139,320,149,343,181.3C365.7,213,389,267,411,282.7C434.3,299,457,277,480,250.7C502.9,224,526,192,549,181.3C571.4,171,594,181,617,208C640,235,663,277,686,256C708.6,235,731,149,754,122.7C777.1,96,800,128,823,165.3C845.7,203,869,245,891,224C914.3,203,937,117,960,112C982.9,107,1006,181,1029,197.3C1051.4,213,1074,171,1097,144C1120,117,1143,107,1166,133.3C1188.6,160,1211,224,1234,218.7C1257.1,213,1280,139,1303,133.3C1325.7,128,1349,192,1371,192C1394.3,192,1417,128,1429,96L1440,64L1440,320L1428.6,320C1417.1,320,1394,320,1371,320C1348.6,320,1326,320,1303,320C1280,320,1257,320,1234,320C1211.4,320,1189,320,1166,320C1142.9,320,1120,320,1097,320C1074.3,320,1051,320,1029,320C1005.7,320,983,320,960,320C937.1,320,914,320,891,320C868.6,320,846,320,823,320C800,320,777,320,754,320C731.4,320,709,320,686,320C662.9,320,640,320,617,320C594.3,320,571,320,549,320C525.7,320,503,320,480,320C457.1,320,434,320,411,320C388.6,320,366,320,343,320C320,320,297,320,274,320C251.4,320,229,320,206,320C182.9,320,160,320,137,320C114.3,320,91,320,69,320C45.7,320,23,320,11,320L0,320Z"
                        fillOpacity="1"
                    />
                </Box>

                <Box
                    position="relative"
                    w="35px"
                    h="35px"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    bg="#0be5e5de"
                    borderRadius="50%"
                    ml="8px"
                    flexShrink={0}
                    animation={`${iconPop} 520ms cubic-bezier(0.22,1,0.36,1) 120ms backwards`}
                >
                    <Box
                        position="absolute"
                        inset={0}
                        borderRadius="50%"
                        border="2px solid #0be5e5de"
                        animation={`${ringPulse} 1.6s ease-out 600ms infinite`}
                        pointerEvents="none"
                    />
                    <Box
                        as="svg"
                        viewBox="0 0 512 512"
                        w="17px"
                        h="17px"
                        color="#ffffff"
                        fill="currentColor"
                        stroke="currentColor"
                        strokeWidth="0"
                    >
                        <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z" />
                    </Box>
                </Box>

                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="flex-start"
                    flexGrow={1}
                    minW={0}
                >
                    <Box
                        as="p"
                        m={0}
                        color="#13e9f4"
                        fontSize="17px"
                        fontWeight={700}
                        cursor="default"
                        whiteSpace="nowrap"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        animation={`${textIn} 420ms ease 260ms backwards`}
                    >
                        {title}
                    </Box>
                    <Box
                        as="p"
                        m={0}
                        fontSize="14px"
                        color="#555"
                        cursor="default"
                        whiteSpace="nowrap"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        animation={`${textIn} 420ms ease 360ms backwards`}
                    >
                        {subtitle}
                    </Box>
                </Box>

                <Box
                    as="svg"
                    viewBox="0 0 15 15"
                    w="18px"
                    h="18px"
                    color="#555"
                    cursor="pointer"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0"
                    flexShrink={0}
                    transition="transform 200ms ease, color 200ms ease"
                    _hover={{ transform: "rotate(90deg) scale(1.15)", color: "#13e9f4" }}
                    onClick={() => {
                        setClosing(true);
                        setTimeout(() => {
                            setVisible(false);
                            onClose?.();
                        }, 380);
                    }}
                >
                    <path
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                    />
                </Box>

                <Box
                    position="absolute"
                    bottom={0}
                    left={0}
                    right={0}
                    h="3px"
                    bg="linear-gradient(90deg, #0be5e5, #13e9f4)"
                    transformOrigin="left"
                    animation={`${progress} ${duration}ms linear forwards`}
                />
            </Box>
        </Box>
    );
}