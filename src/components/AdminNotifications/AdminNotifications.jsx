import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../../config/axiosConfig";
import { toast } from 'react-toastify';
import { useForm } from "react-hook-form";

const date = new Date();

const urlInscriptionsNewRequests = "inscriptions/newrequests"
const urlInscriptions = "inscriptions/"
const urlMerchNewRequests = "merchrequests/newrequests"
const urlMerchRequests = "merchrequests/"
const urlMarkPaidMerchRequests = "merchrequests/updatepaymentstatus/"

export default function AdminNotifications() {
    const [inscrptionsNewReq, setinscrptionsNewReq] = useState([]);
    const [merchNewReq, setmerchNewReq] = useState([]);
    
        const {
                register,
                handleSubmit,
            } = useForm({
                mode: "onBlur",
            });

    function fetchNewInscr() {
        axios.get(urlInscriptionsNewRequests, { withCredentials: true })
            .then(response => {
                setinscrptionsNewReq(response.data);
            })
            .catch(error => {
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                console.log(error)
            })
    }

    function fetchNewMerchs() {
        axios.get(urlMerchNewRequests, { withCredentials: true })
            .then(response => {
                setmerchNewReq(response.data);
            })
            .catch(error => {
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                console.log(error)
            })
    }

    useEffect(() => {
        fetchNewInscr();
        fetchNewMerchs();
    }, [])

    function deleteInscription(iid) {
        axios.delete(urlInscriptions + iid, { withCredentials: true })
            .then(response => {
                toast.success('Se eliminó la inscripción correctamente.');
                fetchNewInscr()
            })
            .catch(error => {
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                console.log(error)
            })
    }

    function markPaidInscription(iid) {
        const payDate = date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate())
        axios.put(urlInscriptions, { iid: iid, payDate: payDate }, { withCredentials: true })
            .then(response => {
                toast.success('Se registró la inscripción correctamente.');
                fetchNewInscr()
            })
            .catch(error => {
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                console.log(error)
            })
    }

    function deleteMerchRequest(mid) {
        axios.delete(urlMerchRequests + mid, { withCredentials: true })
            .then(response => {
                toast.success('Se eliminó la solicitud correctamente.');
                fetchNewMerchs()
            })
            .catch(error => {
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                console.log(error)
            })
    }

    function markPaidMerchRequest(mid, e) {
        const payDate = date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate())
        axios.put(urlMarkPaidMerchRequests, { mid: mid, payDate: payDate, amount: e.amount }, { withCredentials: true })
            .then(response => {
                toast.success('Se registró la solicitud correctamente.');
                fetchNewMerchs()
            })
            .catch(error => {
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                console.log(error)
            })
    }

    return (
        <div className="carrito">
            <h1>Ultimas solicitudes recibidas</h1>

            {inscrptionsNewReq.length != 0 &&
                <>
                    <h2>Solicitudes de inscripción nuevas:</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Teléfono de contacto</th>
                                <th>Nombre evento</th>
                                <th>Fecha evento</th>
                                <th>Precio</th>
                                <th>Fecha inscripción</th>
                                <th>Pagado</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                inscrptionsNewReq.map((inscription) => (
                                    <tr key={inscription.id_inscription}>
                                        <th>{inscription.first_name}</th>
                                        <th>{inscription.last_name}</th>
                                        <th>{inscription.tel_contact}</th>
                                        <th>{inscription.event_name}</th>
                                        <th>{inscription.event_date.slice(0, -14)}</th>
                                        <th>{inscription.inscription_price}</th>
                                        <th>{inscription.inscription_date.slice(0, -14)}</th>
                                        <th>{inscription.pay_date ? "SI" : "NO"}</th>
                                        <th>{!inscription.pay_date && <button className="edit-event-button" onClick={() => { markPaidInscription(inscription.id_inscription) }}>Registrar pago</button>}
                                            <button className="delete-event-button" onClick={() => { deleteInscription(inscription.id_inscription) }}>Borrar</button></th>
                                    </tr>
                                ))
                            }

                        </tbody>
                    </table>
                </>
            }
            {merchNewReq.length != 0 &&
                <>
                    <h2>Solicitudes de encargues nuevas:</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Email</th>
                                <th>Teléfono de contacto</th>
                                <th>Fecha</th>
                                <th>Talle</th>
                                <th>Cantidad</th>
                                <th>Descripción</th>
                                <th>Pagado</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                merchNewReq.map((merchReq) => (
                                    <tr key={merchReq.id_request}>
                                        <th>{merchReq.first_name}</th>
                                        <th>{merchReq.last_name}</th>
                                        <th>{merchReq.email}</th>
                                        <th>{merchReq.tel_contact}</th>
                                        <th>{merchReq.req_date.slice(0, -14)}</th>
                                        <th>{merchReq.size}</th>
                                        <th>{merchReq.quantity}</th>
                                        <th>{merchReq.req_description}</th>
                                        <th>{merchReq.pay_date ? "SI" : "NO"}</th>
                                        <th>{!merchReq.pay_date &&
                                                <form className="login-form" onSubmit={handleSubmit((e) => markPaidMerchRequest(merchReq.id_request, e))}>
                                                    <input className="merch-input" type="text" name="amount" placeholder="Monto *" inputMode="numeric" pattern="\d*" title="Solo números."  {...register("amount", { required: true })} />
                                                    <button className="merch-button" type="submit">Registrar pago</button>
                                                </form>}

                                            <button className="delete-event-button" onClick={() => { deleteMerchRequest(merchReq.id_request) }}>Borrar</button></th>
                                    </tr>
                                ))
                            }

                        </tbody>
                    </table>
                </>
            }

            <div className="ticket-back-cart-buttons">
                <NavLink to={"/"} className="info-button" >Volver</NavLink>
            </div>

        </div>
    )
}