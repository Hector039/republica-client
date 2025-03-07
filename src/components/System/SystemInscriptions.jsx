import { useState } from 'react'
import { useEffect } from "react";
import axios from "../../config/axiosConfig";
import { NavLink } from "react-router-dom";
import { toast } from 'react-toastify';
import { downloadExcel } from "react-export-table-to-excel";

const date = new Date();

const urlInscriptions = "inscriptions/"
const urlUpdateNewInscriptionsNewRequests = "inscriptions/updatenewrequests"

export default function SystemInscriptions() {
    const [inscriptionsReq, setinscriptionsReq] = useState([]);

    function fetchInscriptions() {
        axios.get(urlInscriptions, { withCredentials: true })
            .then(response => {
                setinscriptionsReq(response.data);
            })
            .catch(error => {
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                console.log(error);
            });
    }

    useEffect(() => {
        fetchInscriptions();
    }, []);

    useEffect(() => {
        function axiosData() {
            axios.get(urlUpdateNewInscriptionsNewRequests, { withCredentials: true })
                .catch(error => {
                    console.log(error)
                })
        }
        axiosData();
    }, [])


    function deleteInscription(iid) {
        axios.delete(urlInscriptions + iid, { withCredentials: true })
            .then(response => {
                toast.success('Se eliminó la inscripción correctamente.');
                fetchInscriptions();
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
                fetchInscriptions();
            })
            .catch(error => {
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                console.log(error)
            })
    }

    
    function handleDownloadExcel() {
        const header = ["ID usuario", "Nombre", "Apellido", "Email", "Teléfono", "evento", "Fecha", "Precio", "Fecha Inscrp", "Fecha Pago", "ID Insc"];
        downloadExcel({
            fileName: "Inscripciones",
            sheet: "Inscripciones",
            tablePayload: {
                header,
                body: inscriptionsReq,
            },
        });
    }

    return (
        <div className="system_incs_container">
            <h2>Historial de solicitudes de inscripción:</h2>
            {inscriptionsReq.length != 0 ?
                <div className="table_container">
                <button className="boton-quitar-carrito" onClick={handleDownloadExcel}>Exportar</button>
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Teléfono de contacto</th>
                                <th>Nombre evento</th>
                                <th>Fecha evento</th>
                                <th>Precio inscripción</th>
                                <th>Fecha inscripción</th>
                                <th>Pagado</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                inscriptionsReq.map((inscription) => (
                                    <tr key={inscription.id_inscription}>
                                        <th>{inscription.first_name}</th>
                                        <th>{inscription.last_name}</th>
                                        <th>{inscription.tel_contact}</th>
                                        <th>{inscription.event_name}</th>
                                        <th>{inscription.event_date.slice(0, -14)}</th>
                                        <th>{inscription.inscription_price}</th>
                                        <th>{inscription.inscription_date.slice(0, -14)}</th>
                                        <th>{inscription.pay_date ? "SI" : "NO"}</th>
                                        <th className="inscriptions-buttons-container">{!inscription.pay_date && <button className="mark-paid-button" onClick={() => { markPaidInscription(inscription.id_inscription) }}>Registrar pago</button>}
                                            <button className="delete-event-button" onClick={() => { deleteInscription(inscription.id_inscription) }}>Borrar</button></th>
                                    </tr>
                                ))
                            }

                        </tbody>
                    </table> </div> : <p>No se encontraron inscripciones a eventos.</p>}
            <NavLink to={"/"} className="info-button" >Volver</NavLink>
        </div>
    )
}
