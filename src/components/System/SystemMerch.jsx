import { useState } from 'react'
import { useEffect } from "react";
import axios from "../../config/axiosConfig";
import { NavLink } from "react-router-dom";
import { toast } from 'react-toastify';
import { downloadExcel } from "react-export-table-to-excel";

const date = new Date();

const urlMerchRequests = "merchrequests/"
const urlMarkPaidMerchRequests = "merchrequests/updatepaymentstatus/"
const urlUpdateNewMerchRequests = "merchrequests/updatenewrequests"

export default function SystemMerch() {
    const [merchRequests, setMerchReq] = useState([])
    const [amounts, setAmounts] = useState({});

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
        const amount = amounts[mid] || "";

        if (!amount) {
            toast.error("Por favor, ingresa un monto.");
            return;
        }

        axios.put(urlMarkPaidMerchRequests, { mid: mid, payDate: payDate, amount: amount }, { withCredentials: true })
            .then(response => {
                toast.success('Se registró la solicitud correctamente.');
                fetchMerch();
                setAmounts(prev => ({ ...prev, [mid]: "" }));
            })
            .catch(error => {
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                console.log(error)
            })
    }



    function handleDownloadExcel() {
        const header = ["ID usuario", "Nombre", "Apellido", "Email", "Teléfono", "Fecha Solicitud", "Talle", "Cantidad", "Descripcion", "Fecha Solic", "ID Solic"];
        downloadExcel({
            fileName: "Solicitudes",
            sheet: "Solicitudes",
            tablePayload: {
                header,
                body: merchRequests,
            },
        });
    }


    return (
        <div className="system_incs_container">
            <h2>Historial de solicitudes de encargues:</h2>
            {merchRequests.length != 0 ?
                <div className="table_container">
                    <button className="boton-quitar-carrito" onClick={handleDownloadExcel}>Exportar</button>

                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Apellido</th>
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
                                        <th>{merchReq.first_name}</th>
                                        <th>{merchReq.last_name}</th>
                                        <th>{merchReq.tel_contact}</th>
                                        <th>{merchReq.req_date.slice(0, -14)}</th>
                                        <th>{merchReq.size}</th>
                                        <th>{merchReq.quantity}</th>
                                        <th>{merchReq.req_description}</th>
                                        <th>{merchReq.pay_date ? "SI" : "NO"}</th>
                                        <th className="edit-event-buttons-container">
                                            {!merchReq.pay_date && (
                                                <div className="merch-input-container">
                                                    <input
                                                        className="merch-input"
                                                        type="text"
                                                        name="amount"
                                                        placeholder="Monto *"
                                                        inputMode="numeric"
                                                        pattern="\d*"
                                                        title="Solo números."
                                                        value={amounts[merchReq.id_request] || ""}
                                                        onChange={(e) =>
                                                            setAmounts(prev => ({
                                                                ...prev,
                                                                [merchReq.id_request]: e.target.value
                                                            }))
                                                        }
                                                    />
                                                    <button
                                                        type="button"
                                                        className="merch-button"
                                                        onClick={() => markPaidMerchRequest(merchReq.id_request)}
                                                    >
                                                        Registrar pago
                                                    </button>
                                                </div>
                                            )}
                                            <button className="delete-event-button" onClick={() => { deleteMerchRequest(merchReq.id_request) }}>Borrar</button></th>
                                    </tr>
                                ))
                            }


                        </tbody>
                    </table></div> : <p>No se encontraron solicitudes.</p>}

            <NavLink to={"/"} className="info-button" >Volver</NavLink>
        </div>

    )
}
