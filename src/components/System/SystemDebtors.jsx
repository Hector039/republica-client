import { NavLink } from "react-router-dom";
import axios from "../../config/axiosConfig";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from 'react-toastify';

const urlGetDebtors = "monthlypayments/"
const urlGetAnnualDebtors = "annualpayments/debtorshistory/"
const urlNotifyAnnualDebtor = "annualpayments/notifydebtor/"
const urlChangeStatus = "users/changeuserstatus"
const urlNotifyMonthlyDebtor = "monthlypayments/notifydebtor/"
const urlNotifyAllMonthlyDebtors = "monthlypayments/notifyallmonthlydebtors"
const urlNotifyAllAnnualDebtors = "annualpayments/notifyallannualdebtors"
const urlGetInscriptionDebtors = "inscriptions/getdebtorshistory/"
const urlGetMerchDebtors = "merchrequests/getdebtorshistory/"

const date = new Date();

export default function SystemDebtors() {

    const [debtorsUsers, setDebtorsUsers] = useState([])
    const [dateChanger, setDateChanger] = useState(date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0"))
    const [selectorChanger, setSelectorChanger] = useState("monthly_payments")

    const {
        register,
        handleSubmit,
    } = useForm({
        mode: "onBlur",
    });

    const {
        register: register2,
        handleSubmit: handleSubmit2
    } = useForm({
        mode: "onBlur",
    });

    function getDebtorsUsers(e) {

        if (e.selector === "monthly_payments") {
            axios.get(urlGetDebtors + e.day.slice(6) + "/" + e.day.slice(0, -6), { withCredentials: true })
                .then(response => {
                    setDebtorsUsers(response.data);
                })
                .catch(error => {
                    console.log(error);
                    toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                })
        } else if (e.selector === "annual_payments") {
            axios.get(urlGetAnnualDebtors + e.day.slice(0, -6), { withCredentials: true })
                .then(response => {
                    setDebtorsUsers(response.data);
                })
                .catch(error => {
                    console.log(error);
                    toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                })
        } else if (e.selector === "merch_requests") {
            axios.get(urlGetMerchDebtors + e.day, { withCredentials: true })
                .then(response => {
                    setDebtorsUsers(response.data);
                })
                .catch(error => {
                    console.log(error);
                    toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                })
        } else if (e.selector === "inscription_requests") {
            axios.get(urlGetInscriptionDebtors + e.day, { withCredentials: true })
                .then(response => {
                    setDebtorsUsers(response.data);
                })
                .catch(error => {
                    console.log(error);
                    toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                })
        }

    }

    function changeUserStatus(e, uid) {
        const newStatus = parseInt(e);
        axios.post(urlChangeStatus, { uid: uid, userStatus: newStatus }, { withCredentials: true })
            .then(response => {
                toast.success('Se cambió el estado del usuario.');
                setDebtorsUsers(prevUsers =>
                    prevUsers.map(user =>
                        user.id_user === uid ? { ...user, user_status: newStatus } : user
                    )
                );
            })
            .catch(error => {
                console.log(error);
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            })
    }

    function notifyDebtor(uid, date) {
        if (selectorChanger === "monthly_payments") {
            axios.get(urlNotifyMonthlyDebtor + uid + "/" + date, { withCredentials: true })
                .then(response => {
                    toast.success('Se envió notificación al usuario.');
                })
                .catch(error => {
                    console.log(error);
                    toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                })
        } else if (selectorChanger === "annual_payments") {
            axios.get(urlNotifyAnnualDebtor + uid + "/" + date, { withCredentials: true })
                .then(response => {
                    toast.success('Se envió notificación al usuario.');
                })
                .catch(error => {
                    console.log(error);
                    toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                })
        }
    }

    function notifyAllDebtors(debtorsUsers, date) {
        if (selectorChanger === "monthly_payments") {
            axios.post(urlNotifyAllMonthlyDebtors, { debtorsArray: debtorsUsers, date: date }, { withCredentials: true })
                .then(response => {
                    toast.success('Se enviaron las notificaciones a los usuarios.');
                })
                .catch(error => {
                    console.log(error);
                    toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                })
        } else if (selectorChanger === "annual_payments") {
            axios.post(urlNotifyAllAnnualDebtors, { debtorsArray: debtorsUsers, date: date }, { withCredentials: true })
                .then(response => {
                    toast.success('Se enviaron las notificaciones a los usuarios.');
                })
                .catch(error => {
                    console.log(error);
                    toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                })
        }
    }

    const handleChange = (event) => {
        setDateChanger(event.target.value);
    }
    const handleSelector = (event) => {
        setSelectorChanger(event.target.value);
    }

    return (
        <div className="carrito">
            <h1>Consulta de deudores activos:</h1>
            <form onSubmit={handleSubmit(getDebtorsUsers)}>
                <select {...register("selector")} onChange={handleSelector}>
                    <option value="monthly_payments" defaultChecked>Mensual</option>
                    <option value="annual_payments">Matrícula</option>
                    <option value="merch_requests">Solicitudes</option>
                    <option value="inscription_requests">Eventos</option>
                </select>
                <input type="date" id="day" name="day" value={dateChanger}  {...register("day", { required: true })} onChange={handleChange} />
                <button type="submit" className="cuenta-button" >Consultar</button>
            </form>

            {debtorsUsers.length != 0 &&
                <div className="table_container">
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Email</th>
                                <th>Teléfono</th>
                                <th>Estado</th>
                                <th>Historial pagos</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                debtorsUsers.map((user) => (
                                    <tr key={user.id_user}>
                                        <th>{user.first_name}</th>
                                        <th>{user.last_name}</th>
                                        <th>{user.email}</th>
                                        <th>{user.tel_contact}</th>
                                        <th><select {...register2(`status_${user.id_user}`)} value={user.user_status.toString()}
                                            onChange={e => { changeUserStatus(e.target.value, user.id_user) }} >
                                            <option value="1">Activo</option>
                                            <option value="0">Inactivo</option>
                                        </select></th>
                                        <th><NavLink to={`/userpaymentshistory/`} className="info-button">Ver</NavLink></th>
                                        <th>{(selectorChanger === "monthly_payments" || selectorChanger === "annual_payments") && <button className="boton-quitar-carrito" onClick={() => { notifyDebtor(user.id_user, dateChanger) }}>Notificar</button>}</th>
                                    </tr>
                                ))
                            }

                        </tbody>
                    </table>
                    {(selectorChanger === "monthly_payments" || selectorChanger === "annual_payments") && <button className="boton-quitar-carrito" onClick={() => { notifyAllDebtors(debtorsUsers, dateChanger) }}>Notificar todos</button>}
                </div>


            }
            <NavLink to={`/administrationpayments`} className="info-button">Volver</NavLink>


        </div>
    )
}