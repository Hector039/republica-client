import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useUser } from "../context/dataContext";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "../../config/axiosConfig";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'
import { toast } from 'react-toastify';
import { QRCodeSVG } from "qrcode.react";
import "./assets/users.css";

const MySwal = withReactContent(Swal)

const urlUserLogin = "users/login"
const urlUser = "users/"
const urlUserRegister = "users/signin"
const urlAdminNotifications = "utils/notifications"
const urlGetQr = "utils/getqr"

export default function Users() {
    const navigate = useNavigate();
    const { user, setUser } = useUser();
    const [qr, setQr] = useState(null)

    useEffect(() => {
        function axiosData() {
            if (sessionStorage.getItem("temp")) {
                axios.get(urlUser + sessionStorage.getItem("temp"), { withCredentials: true })
                    .then(response => {
                        setUser(response.data);
                    })
                    .catch(error => {
                        console.log(error);
                        toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                    })
            }
        }
        axiosData();
    }, [])

    const {
        register,
        handleSubmit,
    } = useForm({
        mode: "onBlur",
    });

    const {
        register: register2,
        handleSubmit: handleSubmit2,
        formState: { isSubmitSuccessful }
    } = useForm({
        mode: "onBlur",
    });

    const login = (e) => {
        axios.post(urlUserLogin, { dni: e.dni, password: e.password }, { withCredentials: true })
            .then(response => {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Login correcto!",
                    showConfirmButton: false,
                    timer: 1500
                }).then(result => {
                    sessionStorage.setItem("temp", response.data.id_user);
                    setUser(response.data);
                    if (response.data.is_admin) {
                        axios.get(urlAdminNotifications, { withCredentials: true })
                            .then(response => {

                                const merchReq = response.data.merchReq;
                                const inscReq = response.data.inscReq;
                                if (merchReq.merch > 0 || inscReq.insc > 0) {
                                    MySwal.fire({
                                        title: "Tienes nuevas notificaciones! Deseas verlas?",
                                        icon: "warning",
                                        showCancelButton: true,
                                        confirmButtonColor: "#3085d6",
                                        cancelButtonColor: "#d33",
                                        confirmButtonText: "Ir"
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            return navigate("/adminnotifications");
                                        }
                                    });
                                }
                            })
                            .catch(error => {
                                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                                console.log(error)
                            })
                    }
                    navigate("/");
                });
            })
            .catch(error => {
                if (error.response.status === 401) {
                    return toast.error(error.response.data.error);
                }
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            })
    }

    const newRegister = (e) => {
        const telContact = `54${e.tel_pre}15${e.tel_contact}`

        if (e.password !== e.repassword) return toast.error('Los passwords no coinciden. Intenta de nuevo');
        axios.post(urlUserRegister, {
            first_name: e.first_name,
            last_name: e.last_name,
            email: e.email,
            birth_date: e.birth_date,
            password: e.password,
            dni: e.dni,
            tel_contact: telContact
        }, { withCredentials: true })
            .then(response => {
                Swal.fire({
                    icon: "success",
                    title: `Bienvenida/o ${response.data.last_name}!`,
                    showConfirmButton: true
                }).then(resp => {
                    sessionStorage.setItem("temp", response.data.id_user);
                    setUser(response.data);
                    navigate("/");
                })
            })
            .catch(error => {
                console.log(error);
                if (error.response.statusText && error.response.statusText === "Unauthorized") return toast.error(error.response.data.error);
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            })
    }

    const getQr = () => {
        console.log("enviando");

        axios.get(urlGetQr, { withCredentials: true })
            .then(response => {
                setQr(response.data.qrCode);
            })
            .catch(error => {
                console.log(error);
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            })

    }

    return (
        <div className="cuenta-main">
            <section className="cuenta-info">
                {
                    !user ?
                        <>
                            <div className="cuenta-registrarse">
                                <h2 >Acceder usuario existente:</h2>
                                <form className="login-form" onSubmit={handleSubmit(login)}>
                                    <input type="text" name="dni" placeholder="DNI *" inputMode="numeric" pattern="\d*" maxLength="8" minLength="8" title="Solo números. 8 dígitos."  {...register("dni", { required: true })} />
                                    <input type="password" id="login-password" name="password" placeholder="Contraseña *" maxLength="8" pattern="[A-Za-z0-9]{8,8}" {...register("password", { required: true })} />
                                    <button type="submit" className="cuenta-button">Acceder</button>
                                </form>
                                <Link to={"/passrestoration"} className="boton-forgot">Olvidaste tu contraseña?</Link>
                            </div>


                            <div className="cuenta-registrarse">
                                <h2 >Registrar cuenta nueva:</h2>
                                <form className="login-form" onSubmit={handleSubmit2(newRegister)}>
                                    <input type="text" id="first_name" name="first_name" placeholder="Nombre *" maxLength="15" pattern="[A-Za-zÀ-ÿ\u00f1\u00d1]{3,15}" title="No uses símbolos ni números. Min 3, Max 15 carácteres." {...register2("first_name", { required: true })} />
                                    <input type="text" id="last_name" name="last_name" placeholder="Apellido *" maxLength="15" pattern="[A-Za-zÀ-ÿ\u00f1\u00d1]{3,15}" title="No uses símbolos ni números. Min 3, Max 15 carácteres." {...register2("last_name", { required: true })} />
                                    <input type="email" id="email" name="email" placeholder="Correo Electrónico" {...register2("email")} />

                                    <p className="info-text-register">Recuerda que tu contraseña debe tener 6 carácteres alfanuméricos SIN símbolos.</p>
                                    <input type="password" id="password" name="password" placeholder="Contraseña nueva *" maxLength="8" pattern="[A-Za-z0-9]{8,8}" {...register2("password", { required: true })} />
                                    <input type="password" id="repassword" name="repassword" placeholder="Repite la contraseña nueva *" maxLength="8" pattern="[A-Za-z0-9]{8,8}" {...register2("repassword", { required: true })} />
                                    <input type="date" id="birth_date" name="birth_date" placeholder="Fecha nacimiento *" {...register2("birth_date", { required: true })} />
                                    <input id="dni" name="dni" placeholder="DNI *" type="text" inputMode="numeric" pattern="\d*" maxLength="8" minLength="8" title="Solo números. 8 dígitos." {...register2("dni", { required: true })} />
                                    <p className="info-text-register">Teléfono ejemplo: 123 1234567</p>
                                    <div className="telephone-container">
                                        <div className="tel-pre">
                                            <p className="info-text-register">0 -</p>
                                            <input type="text" className="tel-prefix" id="tel_pre" name="tel_pre" placeholder="Prefijo *" inputMode="numeric" pattern="\d*" maxLength="5" minLength="3" title="Solo números. min 3 max 5 dígitos." {...register2("tel_pre", { required: true })} />
                                        </div>
                                        <div className="telephone">
                                            <p className="info-text-register">15 -</p>
                                            <input type="text" className="tel_contact" id="tel_contact" name="tel_contact" placeholder="Teléfono *" inputMode="numeric" pattern="\d*" maxLength="7" minLength="7" title="Solo números. 7 dígitos." {...register2("tel_contact", { required: true })} />
                                        </div>
                                    </div>

                                    <button type="submit" className="cuenta-button" >Registrarse</button>
                                </form>
                            </div>
                        </> :
                        <div className="user-info-container">
                            <h2>Información de cuenta:</h2>

                            <div className="user-info">
                                <p>Nombre completo: {user.first_name} {user.last_name}</p>
                                <p>E-Mail: {user.email}</p>
                                <p>Fecha de nacimiento: {user.birth_date.slice(0, -14)}</p>
                                <p>DNI: {user.dni}</p>
                                <p>Teléfono de contacto: {user.tel_contact}</p>
                                <p>Fecha de registro: {user.register_date.slice(0, -14)}</p>
                                <div className="user-info-buttons">
                                    <NavLink to={`/updateuser/${user.id_user}`} className="cuenta-button" style={({ isActive }) => { return { fontWeight: isActive ? "bold" : "" } }}>Actualizar datos</NavLink>
                                    <NavLink to={`/userpaymentshistory/${user.id_user}/${user.last_name}`} className="cuenta-button" style={({ isActive }) => { return { fontWeight: isActive ? "bold" : "" } }}>Consultar historial de pagos</NavLink>
                                </div>
                            </div>
                            <div className="qr-container">
                                {user.is_admin == 1 && <button className="boton-quitar-carrito" onClick={() => { getQr() }}>Iniciar WhatsApp</button>}
                                {qr != null && (qr ? <QRCodeSVG size={"256"} value={qr} /> : <p>Cargando QR...</p>)}
                            </div>
                        </div>
                }
            </section>
            <Link to={"/"} className="info-button">Volver</Link>
        </div>
    )
}