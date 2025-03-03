import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "../../config/axiosConfig";
import { toast } from 'react-toastify';
import { useUser } from "../context/dataContext";

const urlMonthlyHistory = "monthlypayments/"
const urlUserAnnualHistory = "annualpayments/"
const urlUserInscriptionHistory = "inscriptions/"
const urlUserMerchHistory = "merchrequests/"

export default function UserPaymentsHistory() {
    const { uid, lastname } = useParams();
    const [monthlyPaymentsHistory, setMonthlyPaymentsHistory] = useState([])
    const [annualPaymentsHistory, setAnnualPaymentsHistory] = useState([])
    const [merchHistory, setMerchHistory] = useState([])
    const [inscriptionHistory, setInscriptionHistory] = useState([])
    const { user } = useUser();

    useEffect(() => {
        function axiosData() {
            axios.get(urlMonthlyHistory + uid, { withCredentials: true })
                .then(response => {
                    setMonthlyPaymentsHistory(response.data);
                })
                .catch(error => {
                    console.log(error);
                    toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                })
                axios.get(urlUserAnnualHistory + uid, { withCredentials: true })
                .then(response => {
                    setAnnualPaymentsHistory(response.data);
                })
                .catch(error => {
                    console.log(error);
                    toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                })
            axios.get(urlUserInscriptionHistory + uid, { withCredentials: true })
                .then(response => {
                    setInscriptionHistory(response.data);
                })
                .catch(error => {
                    console.log(error);
                    toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                })
            axios.get(urlUserMerchHistory + uid, { withCredentials: true })
                .then(response => {
                    setMerchHistory(response.data);
                })
                .catch(error => {
                    console.log(error);
                    toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                })
        }
        axiosData();
    }, []);

    return (
        <div className="cuenta-main">
            <h1>Historial de pagos de {lastname}:</h1>

            <section className="cuenta-info">
                <h2>Historial mensual:</h2>
                {!monthlyPaymentsHistory.length ? <p className="info-text-register">Sin datos</p> :

                    <table>
                        <thead>
                            <tr>
                                <th>ID registro</th>
                                <th>Fecha del registro</th>
                                <th>Mes</th>
                                <th>Año</th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                monthlyPaymentsHistory.map((payment) => (
                                    <tr key={payment.id_payment}>
                                        <th>{payment.id_payment}</th>
                                        <th>{payment.pay_date.slice(0, -14)}</th>
                                        <th>{payment.month_paid}</th>
                                        <th>{payment.year_paid}</th>
                                    </tr>
                                ))
                            }

                        </tbody>

                    </table>}
                    <h2>Historial anual:</h2>
                {!annualPaymentsHistory.length ? <p className="info-text-register">Sin datos</p> :

                    <table>
                        <thead>
                            <tr>
                                <th>ID registro</th>
                                <th>Fecha del registro</th>
                                <th>Año</th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                annualPaymentsHistory.map((payment) => (
                                    <tr key={payment.id_payment}>
                                        <th>{payment.id_payment}</th>
                                        <th>{payment.pay_date.slice(0, -14)}</th>
                                        <th>{payment.year_paid}</th>
                                    </tr>
                                ))
                            }

                        </tbody>

                    </table>}
                <h2>Historial inscripciones:</h2>
                {!inscriptionHistory.length ? <p className="info-text-register">Sin datos</p> :
                    <table>
                        <thead>
                            <tr>
                                <th>Fecha evento</th>
                                <th>Nombre evento</th>
                                <th>Fecha del pago</th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                inscriptionHistory.map((insc) => (
                                    <tr key={insc.id_inscription}>
                                        <th>{insc.event_date.slice(0, -14)}</th>
                                        <th>{insc.event_name}</th>
                                        <th>{String(insc.pay_date).slice(0, -14)}</th>
                                    </tr>
                                ))
                            }

                        </tbody>

                    </table>}
                <h2>Historial de solicitudes:</h2>
                {!merchHistory.length ? <p className="info-text-register">Sin datos</p> :
                    <table>
                        <thead>
                            <tr>
                                <th>Fecha solicitud</th>
                                <th>Descripción</th>
                                <th>Fecha del pago</th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                merchHistory.map((merch) => (
                                    <tr key={merch.id_request}>
                                        <th>{merch.req_date.slice(0, -14)}</th>
                                        <th>{merch.req_description}</th>
                                        <th>{String(merch.pay_date).slice(0, -14)}</th>
                                    </tr>
                                ))
                            }

                        </tbody>

                    </table>}
            </section>
            {user.is_admin == 1 ? <Link to={"/administrationdebtors"} className="info-button">Volver</Link> : <Link to={"/users"} className="info-button">Volver</Link>}
        </div>
    )
}