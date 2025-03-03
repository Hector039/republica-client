import { NavLink } from "react-router-dom";
import axios from "../../config/axiosConfig";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from 'react-toastify';
import "./assets/systempayments.css"

const date = new Date();
const urlUsers = "users/"
const urlAddMonthPayment = "monthlypayments/"
const urlAddAnnualPayment = "annualpayments/"
const urlTotalDayPayments = "utils/daytotalpayments/"

export default function SystemPayments() {

    const [users, setUsers] = useState([])
    const [dateChanger, setDateChanger] = useState(date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0"))
    const [dateChanger2, setDateChanger2] = useState(date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0"))
    const [userDates, setUserDates] = useState({});
    const [totalDay, setTotalDay] = useState([])
    const [queryDay, setQueryDay] = useState([])


    const {
        register,
        handleSubmit,
    } = useForm({
        mode: "onBlur",
    });

    const {
        register: register3,
        handleSubmit: handleSubmit3
    } = useForm({
        mode: "onBlur",
    });

    function getUsers(e) {
        axios.post(urlUsers, { search: e.search, value: e.value }, { withCredentials: true })
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.log(error);
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            })
    }



    function addPayment(e, uid, buttonType) {
        const dateArray = e.split("-")

        if (buttonType === "month") {
            axios.post(urlAddMonthPayment, { uid: uid, month: dateArray[1], year: dateArray[0] }, { withCredentials: true })
                .then(response => {
                    toast.success('Se registró el pago mensual del usuario.');
                })
                .catch(error => {
                    console.log(error);
                    toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                })
        } else if (buttonType === "year") {
            axios.post(urlAddAnnualPayment, { uid: uid, year: dateArray[0] }, { withCredentials: true })
                .then(response => {
                    toast.success('Se registró el pago anual del usuario.');
                })
                .catch(error => {
                    console.log(error);
                    toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                })
        }

    }

    const handleSubmit2 = (e, uid) => {
        e.preventDefault();
        const buttonType = e.nativeEvent.submitter.name;
        const selectedDate = userDates[uid] || dateChanger2;
        addPayment(selectedDate, uid, buttonType);
    };

    function getDayTotalPayments(e) {
        axios.get(urlTotalDayPayments + e.day, { withCredentials: true })
            .then(response => {
                setQueryDay(e.day)
                setTotalDay(response.data);
            })
            .catch(error => {
                console.log(error);
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            })
    }

    const handleChange = (event) => {
        setDateChanger(event.target.value);
    }
    const handleChange2 = (event, uid) => {
        setUserDates(prevState => ({
            ...prevState,
            [uid]: event.target.value
        }));
        //setDateChanger2(event.target.value);
    }

    return (
        <div className="carrito">
            <h1>Gestión de pagos:</h1>

            <h2>Consulta de caja diaria:</h2>
            <form onSubmit={handleSubmit3(getDayTotalPayments)} className="checkout-form">
                <input type="date" id="day" name="day" value={dateChanger} {...register3("day", { required: true })} onChange={handleChange} />
                <button type="submit" className="cuenta-button" >Consultar</button>
            </form>
            {
                totalDay.length != 0 &&
                <table>
                    <thead>
                        <tr>
                            <th>Día consultado</th>
                            <th>Motivo</th>
                            <th>Cantidad de registros</th>
                        </tr>
                    </thead>
                    <tbody>

                        {
                            totalDay.map((day) => (
                                <tr key={day.id}>
                                    <th>{queryDay}</th>
                                    {day.table_name === "monthly_payments" && <th>Mensuales</th>}
                                    {day.table_name === "annual_payments" && <th>Anuales</th>}
                                    {day.table_name === "merch_requests" && <th>Encargues</th>}
                                    {day.table_name === "inscription_requests" && <th>Inscripciones</th>}
                                    <th>{day.total}</th>
                                </tr>
                            ))
                        }

                    </tbody>
                </table>
            }

            <h2>Registro de pagos:</h2>
            <form onSubmit={handleSubmit(getUsers)} className="checkout-form">
                <label>Buscar usuario por: 
                    <select {...register("search")}>
                        <option value="TODO" defaultChecked>Todo</option>
                        <option value="first_name">Nombre</option>
                        <option value="last_name">Apellido</option>
                        <option value="dni">DNI</option>
                        <option value="user_group">Grupo</option>
                        <option value="user_status">Estado (0 o 1)</option>
                    </select>
                </label>
                <label>Comienza con:
                    <input type="text" name="value" placeholder="Ingresa tu búsqueda..." {...register("value")} />
                </label>
                <button type="submit" className="cuenta-button">Buscar</button>
            </form>

            {users.length &&
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>DNI</th>
                            <th>Teléfono</th>
                            <th>Registrado</th>
                            <th>Estado</th>
                            <th>Tarifa</th>
                            <th>Fecha a registrar</th>
                        </tr>
                    </thead>
                    <tbody>

                        {
                            users.map((user) => (
                                <tr key={user.id_user}>
                                    <th>{user.id_user}</th>
                                    <th>{user.first_name}</th>
                                    <th>{user.last_name}</th>
                                    <th>{user.dni}</th>
                                    <th>{user.tel_contact}</th>
                                    <th>{user.register_date.slice(0, -14)}</th>
                                    <th>{user.user_status ? "ACTIVO" : "INACTIVO"}</th>
                                    <th>{user.fee}</th>
                                    <th><form onSubmit={e => handleSubmit2(e, user.id_user)} className="checkout-form">
                                        <input
                                            type="month"
                                            id="month_paid"
                                            name="month_paid"
                                            value={userDates[user.id_user] || dateChanger2}
                                            onChange={(e) => handleChange2(e, user.id_user)}
                                            required
                                        />
                                        <div className="register-payments-buttons-container">
                                            <button className="payments-buttons" type="submit" name="month" >Registrar mes</button>
                                            <button className="payments-buttons" type="submit" name="year" >Registrar año</button>
                                        </div>
                                    </form>
                                    </th>
                                </tr>
                            ))
                        }

                    </tbody>
                </table>
            }
            <NavLink to={`/administrationdebtors`} className="get-debtors-button">Consultar deudores activos</NavLink>
            <NavLink to={`/`} className="info-button">Volver</NavLink>


        </div>
    )
}