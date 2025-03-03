import { useNavigate, NavLink } from 'react-router-dom';
import "./assets/logout.css"
import { useUser } from "../context/dataContext";

export default function Logout() {
    const { setUser } = useUser();

    const navigate = useNavigate();

    
    function backToHome() {
        sessionStorage.clear();
        setUser(null);
        navigate("/");
    }

    setTimeout(backToHome, 3000);

    return (
        <div className="logout-container">
            <h2>Te esperamos pronto!</h2>
            <NavLink to={"/users"} className="logout-button">Volver a loguearse</NavLink>
        </div>
    )
}
