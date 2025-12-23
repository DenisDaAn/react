import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
    Box,
    Button,
    TextField,
    Typography,
    Alert,
    CircularProgress,
    Card,
    CardContent,
} from "@mui/material";
import { Email } from "@mui/icons-material";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router";
import { authProvider } from "@/components/auth/auth";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [errorKey, setErrorKey] = useState(0);
    const [cooldown, setCooldown] = useState(0);

    const [params] = useSearchParams();
    const navigate = useNavigate();
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        document.title = "*** | Log in";

        const token =
            params.get("token") || localStorage.getItem("token") || authProvider.token;
        const errorParam = params.get("error");

        if (errorParam) {
            const message =
                errorParam === "invalid_token"
                    ? "Неверная или устаревшая ссылка для входа"
                    : errorParam === "unauthorized"
                        ? "Необходима авторизация"
                        : "Ошибка авторизации";

            setError(message);
            setErrorKey((k) => k + 1);
        }

        const tryLogin = async () => {
            if (authProvider.isAuthenticated && authProvider.token) navigate("/home");
            if (!token) return;
            setLoading(true);
            try {
                await authProvider.signin(token);
                navigate("/home");
            } catch {
                navigate("/?error=invalid_token");
            } finally {
                setLoading(false);
            }
        };

        tryLogin();

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [params, navigate]);

    const startCooldown = (seconds: number) => {
        setCooldown(seconds);
        timerRef.current = setInterval(() => {
            setCooldown((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current!);
                    setSent(false);
                    return 0;
                }
                return prev - 1;
            });
            return;
        }, 1000);
    };

    const validateEmail = (email: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setError("");

        if (!email) {
            setError("Введите адрес электронной почты");
            setErrorKey((k) => k + 1);
            return;
        }

        if (!validateEmail(email)) {
            setError("Некорректный формат e-mail");
            setErrorKey((k) => k + 1);
            return;
        }

        if (cooldown > 0) {
            setError(`Повторная отправка будет доступна через ${cooldown} сек`);
            setErrorKey((k) => k + 1);
            return;
        }

        setLoading(true);

        try {
            const { data } = await axios.post(
                "http://127.0.0.1:8000/send_mail",
                { email }
            );

            if (data?.success) {
                setSent(true);
                localStorage.setItem("email_info", email);
                startCooldown(60);
            } else if (data?.cooldown) {
                startCooldown(data.cooldown);
                setError(data.error);
            } else {
                throw new Error("No data");
            }
        } catch (err) {
            console.error(err);
            setError("Не удалось отправить письмо.\nПопробуйте позже.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                height: "100vh",
                bgcolor: "var(--color-bg)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
            >
                <Card
                    sx={{
                        width: 420,
                        borderRadius: 4,
                        boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
                        background: "linear-gradient(145deg, #0e1117, #1a1f25)",
                        border: "1px solid rgba(255,255,255,0.05)",
                        position: "relative",
                        overflow: "hidden",
                        "&:before": {
                            content: '""',
                            position: "absolute",
                            inset: 0,
                            background:
                                "linear-gradient(135deg, rgba(0,230,118,0.12), transparent 70%)",
                            pointerEvents: "none",
                        },
                    }}
                >
                    <CardContent sx={{ p: 4, position: "relative", zIndex: 2 }}>
                        <Typography
                            variant="h5"
                            align="center"
                            fontWeight="bold"
                            sx={{
                                color: "var(--color-accent)",
                                mb: 3,
                                textShadow: "0 0 8px var(--color-accent-hover)",
                                letterSpacing: 1,
                            }}
                        >
                            Вход в ***
                        </Typography>

                        {sent ? (
                            <Alert
                                severity="success"
                                icon={false}
                                sx={{
                                    mb: 3,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 1,
                                    bgcolor: "rgba(0, 230, 118, 0.08)",
                                    border: "1px solid var(--color-accent)",
                                    borderRadius: 2,
                                    color: "var(--color-text)",
                                    boxShadow: "0 0 12px rgba(0,230,118,0.25)",
                                    backdropFilter: "blur(6px)",
                                    overflow: "hidden",
                                    px: 2,
                                    py: 1.5,
                                }}
                            >
                                <Box sx={{ display: "flex", gap: 1.2, alignItems: "center" }}>
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 280, damping: 12 }}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={2}
                                            stroke="var(--color-accent)"
                                            width={28}
                                            height={28}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                    </motion.div>

                                    <Box sx={{ textAlign: "left", fontSize: 15, lineHeight: 1.4 }}>
                                        Письмо с ссылкой для входа отправлено на <b>{email}</b>
                                        <br />
                                        Проверьте почту!
                                    </Box>
                                </Box>
                            </Alert>
                        ) : (
                            <Typography
                                variant="body2"
                                align="center"
                                sx={{
                                    color: "var(--color-text-muted)",
                                    mb: 3,
                                }}
                            >
                                Введите ваш e-mail, чтобы получить ссылку для входа
                            </Typography>
                        )}

                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                            }}
                        >
                            <TextField
                                variant="outlined"
                                label="E-mail"
                                fullWidth
                                disabled={loading || sent}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                InputProps={{
                                    startAdornment: <Email sx={{ mr: 1, color: "var(--color-accent)" }} />,
                                    style: { color: "var(--color-text)" },
                                }}
                                InputLabelProps={{
                                    style: { color: "var(--color-text-muted)" },
                                }}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": {
                                            borderColor: "rgba(255,255,255,0.2)",
                                        },
                                        "&:hover fieldset": {
                                            borderColor: "var(--color-accent)",
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "var(--color-accent)",
                                            boxShadow: "0 0 8px var(--color-accent)",
                                        },
                                    },
                                }}
                            />

                            {error && (<motion.div key={errorKey} initial={{ x: 0, opacity: 0 }} animate={{ x: [0, -10, 10, -8, 8, -5, 5, 0], opacity: [1, 1], transition: { duration: 0.5 }, scale: [1.0, 1.1, 1.0] }} > <Alert severity="error" icon={false} sx={{ mb: 3, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 0, gap: 1.2, bgcolor: "rgba(211, 47, 47, 0.15)", border: "1px solid rgba(244, 67, 54, 0.3)", borderRadius: 2, color: "white", py: 1.2, }} > <Box sx={{ display: "flex", alignItems: "center", gap: 1, }} > <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }} style={{ display: "flex", alignItems: "center", justifyContent: "center", transform: "translateY(1px)", }} > <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="tomato" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={24} height={24} style={{ verticalAlign: "middle" }} > <path d="M12 9v4m0 4h.01" /> <path d="M10.29 3.86L3.1 16.31a1.5 1.5 0 001.29 2.19h15.22a1.5 1.5 0 001.29-2.19L13.71 3.86a1.5 1.5 0 00-2.42 0z" /> </svg> </motion.div> <Typography variant="body2" sx={{ lineHeight: 1.4, textAlign: "center" }}> {error} </Typography> </Box> </Alert> </motion.div>)}

                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={loading || cooldown > 0}
                                sx={{
                                    mt: 1,
                                    fontWeight: "bold",
                                    height: 48,
                                    borderRadius: 2,
                                    color: "#fff",
                                    background:
                                        cooldown > 0
                                            ? "rgba(255,255,255,0.15)"
                                            : "linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))",
                                    transition: "var(--transition-base)",
                                    "&:hover": {
                                        transform: "scale(1.02)",
                                        boxShadow: "0 0 20px rgba(0,230,118,0.4)",
                                    },
                                }}
                            >
                                {loading ? (
                                    <CircularProgress size={26} color="inherit" />
                                ) : cooldown > 0 ? (
                                    `Отправить повторно через ${cooldown}с`
                                ) : (
                                    "Отправить ссылку"
                                )}
                            </Button> 
                        </Box>
                    </CardContent>
                </Card>
            </motion.div>
        </Box>
    );
}
