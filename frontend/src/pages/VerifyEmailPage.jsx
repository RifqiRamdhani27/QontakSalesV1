import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Flex, Text, Button } from "@chakra-ui/react";
import api from "@/services/api";

export default function VerifyEmailPage() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState("loading");

    useEffect(() => {
        const token = params.get("token");
        if (!token) {
            setStatus("error");
            return;
        }
        api
            .post("/auth/verify-email/", { token })
            .then(() => setStatus("ok"))
            .catch(() => setStatus("error"));
    }, [params]);

    return (
        <Flex minH="100vh" align="center" justify="center" direction="column" gap={4} bg="#0B1120" color="white">
            {status === "loading" && <Text>Memverifikasi email...</Text>}
            {status === "ok" && (
                <>
                    <Text>Email berhasil diverifikasi!</Text>
                    <Button onClick={() => navigate("/login")}>Ke halaman login</Button>
                </>
            )}
            {status === "error" && <Text>Link tidak valid atau sudah kadaluarsa.</Text>}
        </Flex>
    );
}