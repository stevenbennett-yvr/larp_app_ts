import { faSignOut, faHome } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@mantine/core";

export function HomeButton() {
    const navigate = useNavigate();
  
    const handleNavigateHome = () => {
      navigate("/");
    };
  
    return (
      <Button variant='link' color="gray" compact leftIcon={<FontAwesomeIcon icon={faHome}/>} onClick={handleNavigateHome}>
        Home
      </Button>
    );
  }  

export function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      localStorage.clear();
      await logout();
      navigate("/login");
    } catch {
      console.log("Failed to log out");
    }
  };

  return (
    <Button  variant='link' color="gray" compact leftIcon={<FontAwesomeIcon icon={faSignOut} />} onClick={handleLogout}>
      Logout
    </Button>
  );
}