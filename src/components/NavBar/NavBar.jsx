import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "./assets/logo.jpeg";
import axios from "../../config/axiosConfig";
import { useUser } from "../context/dataContext";
import "./assets/navbar.css";

const urlUserLogout = "users/logout"

export default function NavBar() {
    const navigate = useNavigate();
    const { user } = useUser();
    
    const logout = () => {
        axios.get(urlUserLogout, { withCredentials: true })
            .then(response => {
                navigate("/logout");
            })
            .catch(error => {
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            })
    }
    
    return (
        <nav className="navbar">
            <div className="bottom-navbar">
                <div className="navbar-brand">
                    <Link to={"/"}><img src={logo} alt="Logo Gimnasio Republica del oeste" /></Link>
                </div>

                <div className="navbar-menu">
                    {user && user.is_admin ?
                        <><NavLink to={"/"} className="navbar-item" style={({ isActive }) => { return { fontWeight: isActive ? "bold" : "" } }}>Inicio</NavLink>
                            <NavLink to={"/administrationusers"} className="navbar-item-sistema" style={({ isActive }) => { return { fontWeight: isActive ? "bold" : "" } }}>Usuarios</NavLink>
                            <NavLink to={"/administrationpayments"} className="navbar-item-sistema" style={({ isActive }) => { return { fontWeight: isActive ? "bold" : "" } }}>Pagos</NavLink>
                            <NavLink to={"/administrationevents"} className="navbar-item-sistema" style={({ isActive }) => { return { fontWeight: isActive ? "bold" : "" } }}>Eventos</NavLink>
                            <NavLink to={"/administrationinscriptions"} className="navbar-item-sistema" style={({ isActive }) => { return { fontWeight: isActive ? "bold" : "" } }}>Inscripciones</NavLink>
                            <NavLink to={"/administrationmerch"} className="navbar-item-sistema" style={({ isActive }) => { return { fontWeight: isActive ? "bold" : "" } }}>Encargues</NavLink>
                            <NavLink to={"/users"} className="navbar-item" style={({ isActive }) => { return { fontWeight: isActive ? "bold" : "" } }}>Mi Cuenta</NavLink></> :
                        <><NavLink to={"/"} className="navbar-item" style={({ isActive }) => { return { fontWeight: isActive ? "bold" : "" } }}>Inicio</NavLink>
                            <NavLink to={"/users"} className="navbar-item" style={({ isActive }) => { return { fontWeight: isActive ? "bold" : "" } }}>Mi Cuenta</NavLink></>
                    }
                </div>

                {user && <div className="logout-container-navbar">

                    <NavLink to={"/users"} className="button-top-navbar" style={({ isActive }) => { return { fontWeight: isActive ? "bold" : "" } }}>{user.email}</NavLink>
                    <button onClick={logout}>Cerrar sesión</button>

                </div>}
            </div>
        </nav >
    )
}