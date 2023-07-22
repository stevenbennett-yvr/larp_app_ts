import { FormEvent } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, Center, Button, Image, Text } from '@mantine/core';
import image from "../resources/CaM.png"
import { globals } from "../globals"

const Login = () => {
    const { loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e: FormEvent<HTMLButtonElement>) {
        e.preventDefault();
        await loginWithGoogle();        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key !== null) {
              localStorage.removeItem(key);
            }
          }
        navigate("/");
    }

    return (
        <Center h="100vh">
        <Card shadow="sm" padding="xl" radius="md" style={{ maxWidth: 400 }}>
          <Text fz={globals.largeFontSize} ta={"center"} mb={"lg"} style={{ marginBottom: 20 }}>
            Welcome!
          </Text>
          <Center>
          <Image
            src={image}
            alt="Canada at Midnight Logo"
            width={200}
            height={200}
            style={{ marginBottom: 20 }}
          />
          </Center>
          <Text fz={globals.smallerFontSize} align="center" style={{ marginBottom: 20 }}>
            <p>This application contains a set of tools for playing Canada at Midnight roleplaying games.</p>
            <p>Canada at Midnight is a World of Darkness Fan Club that hosts live action role playing events in twenty five domains across Canada & the US as well as online via Discord.</p>
          </Text>
          <Button fullWidth type="submit" onClick={handleSubmit}>
            Log In with Google
          </Button>
        </Card>
      </Center>
    );
};

export default Login;
