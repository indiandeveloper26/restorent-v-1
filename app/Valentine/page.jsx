'use client'
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

export default function ValentineFinal() {
    const [isAccepted, setIsAccepted] = useState(false);
    const [noPos, setNoPos] = useState({ top: "65%", left: "50%" });

    const handleYes = () => {
        setIsAccepted(true);
        // Multicolor Party Confetti
        confetti({
            particleCount: 200,
            spread: 90,
            origin: { y: 0.6 },
            colors: ['#ff4b2b', '#ff9a9e', '#ffffff', '#ffd700']
        });
    };

    const moveNo = () => {
        const top = Math.random() * 60 + 20 + "%";
        const left = Math.random() * 40 + 30 + "%";
        setNoPos({ top, left });
    };

    return (
        <div style={{
            height: "100dvh",
            width: "100%",
            background: isAccepted
                ? "linear-gradient(to bottom, #ff758c 0%, #ff7eb3 100%)"
                : "linear-gradient(180deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            overflow: "hidden",
            position: "relative",
            transition: "all 0.8s ease"
        }}>

            <AnimatePresence>
                {!isAccepted ? (
                    <motion.div
                        key="ask"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, y: -100 }}
                        style={{
                            width: "100%",
                            textAlign: "center",
                            zIndex: 2,
                            background: "rgba(255, 255, 255, 0.25)",
                            backdropFilter: "blur(12px)",
                            padding: "40px 15px",
                            borderRadius: "30px",
                            border: "1px solid rgba(255, 255, 255, 0.4)",
                            boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                        }}
                    >
                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            style={{ fontSize: "80px", marginBottom: "10px" }}
                        >
                            💝
                        </motion.div>

                        <h1 style={{
                            fontSize: "clamp(2.2rem, 10vw, 3.5rem)",
                            margin: "10px 0",
                            color: "#c2185b",
                            fontWeight: "900",
                            textShadow: "1px 1px 0px white"
                        }}>
                            Hi <span style={{ color: "#ff4b2b" }}>Kajal</span>
                        </h1>
                        <p style={{
                            fontSize: "1.3rem",
                            color: "#ad1457",
                            fontWeight: "600"
                        }}>
                            Will you be <span style={{ borderBottom: "3px solid #ff4b2b" }}>Sahil's</span> Valentine?
                        </p>

                        <div style={{ marginTop: "50px", display: "flex", flexDirection: "column", alignItems: "center", gap: "25px" }}>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleYes}
                                style={{
                                    width: "85%",
                                    maxWidth: "300px",
                                    padding: "20px",
                                    fontSize: "24px",
                                    borderRadius: "50px",
                                    border: "none",
                                    background: "linear-gradient(45deg, #ff416c, #ff4b2b)",
                                    color: "white",
                                    fontWeight: "bold",
                                    boxShadow: "0 10px 30px rgba(255, 75, 43, 0.5)",
                                    cursor: "pointer"
                                }}
                            >
                                YES! ❤️
                            </motion.button>

                            <motion.button
                                animate={{ top: noPos.top, left: noPos.left }}
                                transition={{ type: "spring", stiffness: 700, damping: 30 }}
                                onMouseEnter={moveNo}
                                onTouchStart={moveNo}
                                style={{
                                    position: "absolute",
                                    padding: "12px 35px",
                                    fontSize: "18px",
                                    borderRadius: "50px",
                                    border: "2px solid #ff4b2b",
                                    background: "white",
                                    color: "#ff4b2b",
                                    fontWeight: "bold",
                                    transform: "translateX(-50%)"
                                }}
                            >
                                No
                            </motion.button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="success"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", damping: 10, stiffness: 100 }}
                        style={{ textAlign: "center", zIndex: 5 }}
                    >
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            style={{ fontSize: "100px" }}
                        >
                            🥰
                        </motion.div>
                        <h1 style={{
                            fontSize: "clamp(2.5rem, 12vw, 5rem)",
                            color: "white",
                            fontWeight: "900",
                            textShadow: "0 10px 20px rgba(0,0,0,0.2)",
                            marginTop: "20px"
                        }}>
                            Happy Valentine's Day!
                        </h1>
                        <h2 style={{ fontSize: "2rem", color: "white", marginTop: "10px" }}>
                            Sahil ❤️ Kajal
                        </h2>
                        <motion.p
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            style={{ fontSize: "1.4rem", color: "white", marginTop: "30px", fontWeight: "bold" }}
                        >
                            You made my day! 💖✨
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Decoration */}
            <div style={{ position: "absolute", top: "5%", right: "10%", fontSize: "40px", opacity: 0.3 }}>🌸</div>
            <div style={{ position: "absolute", bottom: "5%", left: "10%", fontSize: "40px", opacity: 0.3 }}>✨</div>
        </div>
    );
}