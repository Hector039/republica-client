import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../config/axiosConfig";
import "./assets/passrestoration.css"
import { toast } from 'react-toastify';

const urlUserPassRestoration = "users/passrestoration"

export default function PassRestoration() {
    const navigate = useNavigate();

    const passRestoration = (e) => {
        axios.post(urlUserPassRestoration, { code: e.code }, { withCredentials: true })
            .then(response => {
                if (response.status === 200) return navigate(`/forgot/${response.data.uid}`)
            })
            .catch(error => {
                toast.error(error.response.data.message);
            })
            
    }

    const { register, handleSubmit } = useForm({ mode: "onBlur" });

    return (
        <div className="cuenta-registrarse">
            <h2 className="cuenta-title">Solicitud restauración de contraseña:</h2>
            <h3 className="text-info">Ingresa el número de documento seguido de la fecha de nacimiento de corrido y SIN símbolos, por ejemplo: 12345678ddMMaa</h3>
            <form className="login-form" onSubmit={handleSubmit(passRestoration)}>
                <input type="number" id="code" name="code" placeholder="Código numérico *" {...register("code", { required: true })} />
                <div className="forgot-buttons">
                    <button type="submit" className="cuenta-button" >Enviar</button>
                    <Link to={"/users"} className="cuenta-button">Login</Link>
                </div>
            </form>
        </div>

    )
}
