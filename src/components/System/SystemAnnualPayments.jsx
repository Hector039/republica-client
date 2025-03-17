import { NavLink } from "react-router-dom";
import axios from "../../config/axiosConfig";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from 'react-toastify';

const date = new Date();

const urlUsers = "users/annualwithunpaid"
const urlAddAnnualPayment = "annualpayments/"
const urlNewExpenditure = "utils/expenditures/"

export default function SystemAnnualPayments() {

    const payDate = date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0");
    const today = date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0");

    const [users, setUsers] = useState([])
    const [userDates, setUserDates] = useState({});
    const [amounts, setAmounts] = useState({});

    const {
        register,
        handleSubmit,
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

    function addPayment(e, uid) {
        const dateArray = e.split("-")
        const amount = amounts[uid] || "";

        if (!amount) {
            toast.error("Por favor, ingresa un monto.");
            return;
        }

        axios.post(urlAddAnnualPayment, { uid: uid, year: dateArray[0], payDate: payDate, amount: amount }, { withCredentials: true })
            .then(response => {
                if (response.data !== "") return toast.success(response.data);
                toast.success('Se registró el pago.');
                setAmounts(prev => ({ ...prev, [uid]: "" }));
            })
            .catch(error => {
                if (error.response.data.code === 5) return toast.error(error.response.data.message);
                console.log(error);
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            })
    };

    const handleSubmit2 = (e, uid) => {
        e.preventDefault();
        const selectedDate = userDates[uid] || today;
        addPayment(selectedDate, uid);
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
            <h1>Gestión de matrículas:</h1>

            <form onSubmit={handleSubmit(getUsers)} className="checkout-form">
                <label>Buscar usuario por:
                    <select {...register("search")}>
                        <option value="last_name" defaultChecked>Apellido</option>
                        <option value="first_name">Nombre</option>
                        <option value="dni">DNI</option>
                        <option value="user_group">Grupo</option>
                        <option value="user_status">Estado (0 o 1)</option>
                        <option value="TODO">Todo</option>
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
                                <th>Última impaga</th>
                                <th>Monto</th>
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
                                        <th>{new Date(user.register_date).toLocaleDateString('en-GB')}</th>
                                        <th>{user.user_status ? "ACTIVO" : "INACTIVO"}</th>
                                        <th>{user.last_unpaid_year ? user.last_unpaid_year : "---"}</th>
                                        <th>{user.last_unpaid_amount ? user.last_unpaid_amount : "---"}</th>
                                        <th><form onSubmit={e => handleSubmit2(e, user.id_user)} >
                                            <input
                                                type="month"
                                                id="month_paid"
                                                name="month_paid"
                                                value={userDates[user.id_user] || today}
                                                onChange={(e) => handleChange2(e, user.id_user)}
                                                required
                                            />
                                            <input
                                                className="merch-input"
                                                type="text"
                                                name="amount"
                                                placeholder="Monto *"
                                                inputMode="numeric"
                                                pattern="\d*"
                                                title="Solo números."
                                                value={amounts[user.id_user] || ""}
                                                onChange={(e) =>
                                                    setAmounts(prev => ({
                                                        ...prev,
                                                        [user.id_user]: e.target.value
                                                    }))
                                                }
                                            />
                                            <button className="payments-buttons" type="submit" name="year" >Registrar Matricula</button>

                                        </form>
                                        </th>
                                    </tr>
                                ))
                            }

                        </tbody>
                    </table>
                </div>
            }
        </div>
    )
}