import React, { useState } from 'react'
import { useEffect } from "react";
import axios from "../../config/axiosConfig";
import { NavLink } from "react-router-dom";
import { toast } from 'react-toastify';

const date = new Date();

const urlMerchRequests = "merchrequests/"
const urlMarkPaidMerchRequests = "merchrequests/updatepaymentstatus/"
const urlUpdateNewMerchRequests = "merchrequests/updatenewrequests"

export default function SystemMerch() {
    const [merchRequests, setMerchReq] = useState([])

    function fetchMerch() {
        axios.get(urlMerchRequests, { withCredentials: true })
        .then(response => {
            setMerchReq(response.data);
        })
        .catch(error => {
            toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            console.log(error)
        })
    }
    
    useEffect(() => {
        fetchMerch();
    }, []);

    
    useEffect(() => {
        function axiosData() {
            axios.get(urlUpdateNewMerchRequests, { withCredentials: true })
                .catch(error => {
                    toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                    console.log(error)
                })
        }
        axiosData();
    }, [])


    function deleteMerchRequest(mid) {
        axios.delete(urlMerchRequests + mid, { withCredentials: true })
            .then(response => {
                toast.success('Se eliminó la solicitud correctamente.');
                fetchMerch();
            })
            .catch(error => {
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                console.log(error)
            })
    }

    function markPaidMerchRequest(mid) {
        const payDate = date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate())
        axios.put(urlMarkPaidMerchRequests, { mid: mid, payDate: payDate}, { withCredentials: true })
            .then(response => {
                toast.success('Se registró la solicitud correctamente.');
                fetchMerch();
            })
            .catch(error => {
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                console.log(error)
            })
    }

    return (
        <>
            <h2>Historial de solicitudes de encargues:</h2>
            {merchRequests.length ? <table>
                <thead>
                    <tr>
                        <th>ID de usuario</th>
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
                        merchRequests.map((merchReq) => (
                            <tr key={merchReq.id_request}>
                                <th>{merchReq.id_user}</th>
                                <th>{merchReq.first_name}</th>
                                <th>{merchReq.last_name}</th>
                                <th>{merchReq.email}</th>
                                <th>{merchReq.tel_contact}</th>
                                <th>{merchReq.req_date.slice(0, -14)}</th>
                                <th>{merchReq.size}</th>
                                <th>{merchReq.quantity}</th>
                                <th>{merchReq.req_description}</th>
                                <th>{merchReq.pay_date ? "SI" : "NO"}</th>
                                <th className="edit-event-buttons-container">{!merchReq.pay_date && <button className="edit-event-button" onClick={() => { markPaidMerchRequest(merchReq.id_request) }}>Registrar pago</button>}
                                <button className="delete-event-button" onClick={() => { deleteMerchRequest(merchReq.id_request) }}>Borrar</button></th>
                            </tr>
                        ))
                    }


                </tbody>
            </table> : <p>No se encontraron solicitudes.</p>}
            <NavLink to={"/"} className="info-button" >Volver</NavLink>
        </>

    )
}
