import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../config/axiosConfig";
import { toast } from 'react-toastify';
import { useForm } from "react-hook-form";

const date = new Date();

const urlDailyCLubInfo = "utils/dailyclub/"
const urlDailyMonthlyInfo = "utils/dailymonthly/"
const urlDailyAnnualInfo = "utils/dailyannual/"
const urlDailyInscriptionsInfo = "utils/dailyinscriptions/"
const urlDailyRequestsInfo = "utils/dailyrequests/"
const urlDailyExpendituresInfo = "utils/dailyexpenditures/"

export default function Daily() {

    const today = date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0");

    const [totalExpenditures, setTotalExpenditures] = useState(0);
    const [totalDay, setTotalDay] = useState(0)

    const [clubInfo, setClubInfo] = useState([])
    const [monthlyInfo, setMonthlyInfo] = useState([])
    const [annualInfo, setAnnualInfo] = useState([])
    const [inscriptionInfo, setInscriptionInfo] = useState([])
    const [requestsInfo, setRequestsInfo] = useState([])
    const [expendituresInfo, setExpendituresInfo] = useState([])

    const {
        register,
        handleSubmit
    } = useForm({
        mode: "onBlur",
    });


    function getClubInfo(day) {
        axios.get(urlDailyCLubInfo + day, { withCredentials: true })
            .then(response => {
                setClubInfo(response.data);
            })
            .catch(error => {
                console.log(error);
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            })
    }
    function getMonthlyInfo(day) {
        axios.get(urlDailyMonthlyInfo + day, { withCredentials: true })
            .then(response => {
                setMonthlyInfo(response.data);
                updateTotal(response.data)
            })
            .catch(error => {
                console.log(error);
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            })
    }
    function getAnnualInfo(day) {
        axios.get(urlDailyAnnualInfo + day, { withCredentials: true })
            .then(response => {
                setAnnualInfo(response.data);
                updateTotal(response.data)
            })
            .catch(error => {
                console.log(error);
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            })
    }
    function getInscriptionInfo(day) {
        axios.get(urlDailyInscriptionsInfo + day, { withCredentials: true })
            .then(response => {
                setInscriptionInfo(response.data);
                //updateTotal(response.data)
            })
            .catch(error => {
                console.log(error);
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            })
    }
    function getRequestsInfo(day) {
        axios.get(urlDailyRequestsInfo + day, { withCredentials: true })
            .then(response => {
                setRequestsInfo(response.data);
                //updateTotal(response.data)
            })
            .catch(error => {
                console.log(error);
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            })
    }
    function getExpendituresInfo(day) {
        axios.get(urlDailyExpendituresInfo + day, { withCredentials: true })
            .then(response => {
                setExpendituresInfo(response.data);
                const total = response.data.reduce((acc, item) => acc + parseInt(item.amount), 0);
                setTotalExpenditures(total)
            })
            .catch(error => {
                console.log(error);
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            })
    }

    function updateTotal(data) {
        const total = data.reduce((acc, item) => acc + parseInt(item.total), 0);
        setTotalDay(prev => prev + total);
    }

    function getDayTotalInfo(e) {
        setTotalDay(0);

        getClubInfo(e.day);
        getMonthlyInfo(e.day);
        getAnnualInfo(e.day);
        getInscriptionInfo(e.day);
        getRequestsInfo(e.day);
        getExpendituresInfo(e.day);
    }

    return (
        <div className="cuenta-main">

            <h1>Consulta de caja diaria:</h1>
            <form onSubmit={handleSubmit(getDayTotalInfo)} className="checkout-form">
                <input type="date" id="day" name="day" defaultValue={today} {...register("day", { required: true })} />
                <button type="submit" className="cuenta-button" >Consultar</button>
            </form>

            {totalDay > 0 &&
                <table className="table_balance">
                    <thead>
                        <tr>
                            <th>Total cuotas y matrículas</th>
                            <th>Egresos</th>
                            <th>Balance del día</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr >
                            <th>{totalDay}</th>
                            <th>{totalExpenditures}</th>
                            <th>{totalDay - totalExpenditures}</th>
                        </tr>
                    </tbody>
                </table>}

            <h2>Club República:</h2>
            {
                clubInfo.length === 0 ? <p className="info-text-register">Sin datos</p> :
                    <table>
                        <thead>
                            <tr>
                                <th>Registros</th>
                                <th>Tarifa</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr >
                                <th>{clubInfo[0].cantidad}</th>
                                <th>{clubInfo[0].tarifa}</th>
                                <th>{clubInfo[0].total}</th>
                            </tr>
                        </tbody>

                    </table>
            }
            <section className="cuenta-info">
                <h2>Cuota:</h2>
                {monthlyInfo.length === 0 ? <p className="info-text-register">Sin datos</p> :

                    <table>
                        <thead>
                            <tr>
                                <th>Total</th>
                                <th>Balance</th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                monthlyInfo.map((reg) => (
                                    <tr key={reg.registros}>
                                        <th>{reg.total}</th>
                                        <th></th>
                                    </tr>
                                ))
                            }

                        </tbody>
                        <tfoot>
                            <tr>
                                <th></th>
                                <th>${(monthlyInfo.reduce((acumulador, item) => acumulador + parseInt(item.total), 0))}</th>
                            </tr>
                        </tfoot>
                    </table>}
                <h2>Matrícula anual:</h2>
                {annualInfo.length === 0 ? <p className="info-text-register">Sin datos</p> :

                    <table>
                        <thead>
                            <tr>
                                <th>Total</th>
                                <th>Balance</th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                annualInfo.map((reg) => (
                                    <tr key={reg.registros}>
                                        <th>{reg.total}</th>
                                        <th></th>
                                    </tr>
                                ))
                            }

                        </tbody>
                        <tfoot>
                            <tr>
                                <th></th>
                                <th>${(annualInfo.reduce((acumulador, item) => acumulador + parseInt(item.total), 0))}</th>
                            </tr>
                        </tfoot>
                    </table>}
                <h2>Inscripciones a eventos:</h2>
                {inscriptionInfo.length === 0 ? <p className="info-text-register">Sin datos</p> :
                    <table>
                        <thead>
                            <tr>
                                <th>Total</th>
                                <th>Balance</th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                inscriptionInfo.map((insc) => (
                                    <tr key={insc.registros}>
                                        <th>{insc.total}</th>
                                        <th></th>
                                    </tr>
                                ))
                            }

                        </tbody>
                        <tfoot>
                            <tr>
                                <th></th>
                                <th>${(inscriptionInfo.reduce((acumulador, item) => acumulador + item.total, 0))}</th>
                            </tr>
                        </tfoot>
                    </table>}
                <h2>Solicitudes de indumentaria:</h2>
                {requestsInfo.length === 0 ? <p className="info-text-register">Sin datos</p> :
                    <table>
                        <thead>
                            <tr>
                                <th>Total</th>
                                <th>Balance</th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                requestsInfo.map((merch) => (
                                    <tr key={merch.registros}>
                                        <th>{merch.total}</th>
                                        <th></th>
                                    </tr>
                                ))
                            }

                        </tbody>
                        <tfoot>
                            <tr>
                                <th></th>
                                <th>${(requestsInfo.reduce((acumulador, item) => acumulador + item.total, 0))}</th>
                            </tr>
                        </tfoot>
                    </table>}
                <h2>Egresos:</h2>
                {expendituresInfo.length === 0 ? <p className="info-text-register">Sin datos</p> :
                    <table>
                        <thead>
                            <tr>
                                <th>Descripción</th>
                                <th>Monto</th>
                                <th>Balance</th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                expendituresInfo.map((exp) => (
                                    <tr key={exp.id_exp}>
                                        <th>{exp.descr}</th>
                                        <th>{exp.amount}</th>
                                        <th></th>
                                    </tr>
                                ))
                            }

                        </tbody>
                        <tfoot>
                            <tr>
                                <th></th>
                                <th></th>
                                <th>${(expendituresInfo.reduce((acumulador, item) => acumulador + item.amount, 0))}</th>
                            </tr>
                        </tfoot>
                    </table>}
            </section>
            <Link to={"/"} className="info-button">Volver</Link>
        </div>
    )
}