import { NavLink } from "react-router-dom";
import axios from "../../config/axiosConfig";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from 'react-toastify';

const date = new Date();

const urlUsers = "users/"
const urlAddMonthPayment = "monthlypayments/"
const urlAddAnnualPayment = "annualpayments/"

const urlNewExpenditure = "utils/expenditures/"
const urlAddLinkedMonthPayment = "monthlypayments/linkedpayment/"

export default function SystemPayments() {

    const payDate = date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0");
    const today = date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0");

    const [users, setUsers] = useState([])
    const [userDates, setUserDates] = useState({});

    const {
        register,
        handleSubmit,
    } = useForm({
        mode: "onBlur",
    });


    const {
        register: register4,
        handleSubmit: handleSubmit4
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
            axios.post(urlAddMonthPayment, { uid: uid, month: dateArray[1], year: dateArray[0], payDate: payDate }, { withCredentials: true })
                .then(response => {
                    toast.success('Se registró el pago mensual del usuario.');
                })
                .catch(error => {
                    console.log(error);
                    toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                })
        } else if (buttonType === "year") {
            axios.post(urlAddAnnualPayment, { uid: uid, year: dateArray[0], payDate: payDate }, { withCredentials: true })
                .then(response => {
                    toast.success('Se registró el pago anual del usuario.');
                })
                .catch(error => {
                    console.log(error);
                    toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                })
        } else if (buttonType === "linked") {
            axios.post(urlAddLinkedMonthPayment, { uid: uid, month: dateArray[1], year: dateArray[0], payDate: payDate, isLinked: 1 }, { withCredentials: true })
                .then(response => {
                    toast.success('Se registró el pago mensual por vínculo del usuario.');
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
        const selectedDate = userDates[uid] || today;
        addPayment(selectedDate, uid, buttonType);
    };

    function newExpenditure(e) {
        axios.post(urlNewExpenditure, { descr: e.descr, amount: e.amount, payDate: payDate }, { withCredentials: true })
            .then(response => {
                toast.success('Se registró el egreso.');
            })
            .catch(error => {
                console.log(error);
                toast.error('Ocurrió un error inesperado');
            })
    }

    const handleChange2 = (event, uid) => {
        setUserDates(prevState => ({
            ...prevState,
            [uid]: event.target.value
        }));
    }

    return (
        <div className="carrito">
            <h1>Gestión de pagos:</h1>

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

            {users.length > 0 &&
                <div className="table_container">
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>DNI</th>
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
                                        <th>{user.first_name}</th>
                                        <th>{user.last_name}</th>
                                        <th>{user.dni}</th>
                                        <th>{user.register_date.slice(0, -14)}</th>
                                        <th>{user.user_status ? "ACTIVO" : "INACTIVO"}</th>
                                        <th>{user.id_fee}</th>
                                        <th><form onSubmit={e => handleSubmit2(e, user.id_user)} >
                                            <input
                                                type="month"
                                                id="month_paid"
                                                name="month_paid"
                                                value={userDates[user.id_user] || today}
                                                onChange={(e) => handleChange2(e, user.id_user)}
                                                required
                                            />
                                            <div className="register-payments-buttons-container">
                                                <button className="payments-buttons" type="submit" name="linked" >Registrar mes por vínculo</button>
                                                <button className="payments-buttons" type="submit" name="month" >Registrar mes</button>
                                                <button className="payments-buttons" type="submit" name="year" >Registrar Matricula</button>
                                            </div>
                                        </form>
                                        </th>
                                    </tr>
                                ))
                            }

                        </tbody>
                    </table>
                </div>
            }
            <h2>Egresos:</h2>
            <form onSubmit={handleSubmit4(newExpenditure)} className="checkout-form">
                <input type="text" name="descr" placeholder="Descripción o motivo" {...register4("descr", { required: true })} />
                <input type="number" name="amount" min={"0"} defaultValue={0} placeholder="Monto" {...register4("amount", { required: true })} />
                <button type="submit" className="cuenta-button">Ingresar egreso</button>
            </form>

            <NavLink to={`/administrationdebtors`} className="get-debtors-button">Consultar deudores activos</NavLink>
            <NavLink to={`/fees`} className="get-debtors-button">Tarifario</NavLink>
            <NavLink to={`/daily`} className="get-debtors-button">Consultar caja diaria</NavLink>
            <NavLink to={`/expenditures`} className="get-debtors-button">Consultar egresos mensuales</NavLink>
            <NavLink to={`/`} className="info-button">Volver</NavLink>


        </div>
    )
}