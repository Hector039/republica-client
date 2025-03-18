import { useEffect, useState } from "react";
import { useUser } from "../context/dataContext";
import axios from "../../config/axiosConfig";
import { useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
import { toast } from 'react-toastify';
import Swal from "sweetalert2";
import UserPaymentsHistory from "../System/UserPaymentsHistory";

const urlEvents = "events/"
const urlInscriptions = "inscriptions/alluserinscriptions/"
//const urlDeleteInscriptions = "inscriptions/"
const urlSendInscriptions = "inscriptions/"
const urlMerchRequests = "merchrequests/allusermerch/"
const urlSendMerchRequests = "merchrequests/addmerchrequest/"
//const urlDeleteMerchRequests = "merchrequests/"
const urlGetFeaturesPositions = "utils/openclosefeatures"
const urlUser = "users/"

export default function MasInfo() {
    const [events, setEvents] = useState([])
    const [userInscriptions, setUserInscriptions] = useState([])
    const [merchRequests, setMerchRequests] = useState([])
    const [featureMerchPosition, setFeatureMerchPosition] = useState(0);
    const [featureEventPosition, setFeatureEventPosition] = useState(0);
    const { user, setUser } = useUser();

    function fetchPositions() {
        axios.get(urlGetFeaturesPositions)
            .then(response => {
                setFeatureMerchPosition(response.data[0].feature);
                setFeatureEventPosition(response.data[1].feature);
            })
            .catch(error => {
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                console.log(error)
            })
    }

    function fecthMerch(uid) {
            axios.get(urlMerchRequests + uid, { withCredentials: true })
                .then(response => {
                    setMerchRequests(response.data);
                })
                .catch(error => {
                    console.log(error);
                    toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                })
    }
    function fetchInscr(uid) {
            axios.get(urlInscriptions + uid, { withCredentials: true })
                .then(response => {
                    setUserInscriptions(response.data);
                })
                .catch(error => {
                    console.log(error);
                    toast.error(error);
                })
    }

    function fetchEvents() {
        axios.get(urlEvents, { withCredentials: true })
            .then(response => {
                setEvents(response.data);
            })
            .catch(error => {
                console.log(error);
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            })
    }

    useEffect(() => {
        axios.get(urlUser, { withCredentials: true })
            .then(response => {
                setUser(response.data);
                fetchInscr(response.data.id_user);
                fecthMerch(response.data.id_user);
            })
            .catch(error => {
                console.log(error);
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            })
        fetchEvents();

        fetchPositions();
    }, [])

    const {
        register,
        handleSubmit
    } = useForm({
        mode: "onBlur",
    });


    const sendMerchRequest = (e) => {
        axios.post(urlSendMerchRequests + user.id_user, {
            req_description: e.req_description
        }, { withCredentials: true })
            .then(response => {
                Swal.fire({
                    icon: "success",
                    title: "Se envió tu solicitud correctamente.",
                    showConfirmButton: true
                }).then(response => { fecthMerch(); })
            })
            .catch(error => {
                if (error.response.statusText && error.response.statusText === "Unauthorized") return toast.error(error.response.data.error);
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                console.log(error)
            })
    }
    /* 
        function deleteEvent(eid) {
            axios.delete(urlEvents + eid, { withCredentials: true })
                .then(response => {
                    toast.success('Se eliminó el evento correctamente.');
                    fetchEvents();
                })
                .catch(error => {
                    toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                    console.log(error)
                })
        }
     
        function deleteInscription(iid) {
            axios.delete(urlDeleteInscriptions + iid, { withCredentials: true })
                .then(response => {
                    toast.success('Se eliminó la inscripción correctamente.');
                    fetchInscr();
                })
                .catch(error => {
                    toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                    console.log(error)
                })
        }
    function deleteUserMerchReq(mid) {
            axios.delete(urlDeleteMerchRequests + mid, { withCredentials: true })
                .then(response => {
                    toast.success('Se eliminó la solcitud de encargue correctamente.');
                    fecthMerch();
                })
                .catch(error => {
                    toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                    console.log(error)
                })
        }
    */

    function sendInscription(eid, uid) {
        axios.post(urlSendInscriptions + eid + "/" + uid, { withCredentials: true })
            .then(response => {
                toast.success('Se envió la solicitud de inscripción correctamente.');
                fetchInscr();
            })
            .catch(error => {
                if (error.response.data.code === 4) return toast.error(error.response.data.message);
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                console.log(error)
            })
    }



    return (
        <>
            <UserPaymentsHistory />

            <h2>Encargue de indumentaria</h2>

            {(user && featureMerchPosition) ?
                <form onSubmit={handleSubmit(sendMerchRequest)}>
                    <div className="merch-inputs">
                        <label>Descripción:</label>
                        <select {...register("req_description")}>
                            <option value="Malla" defaultChecked>Malla</option>
                            <option value="Remera">Remera</option>
                            <option value="Sudadera" >Sudadera</option>
                            <option value="Pantalón largo">Pantalón largo</option>
                            <option value="Campera">Campera</option>
                            <option value="Top">Top</option>
                            <option value="Calza corta">Calza corta</option>
                            <option value="Manta">Manta</option>
                            <option value="Colero">Colero</option>
                        </select>
                    </div>
                    <button type="submit" className="cuenta-button" >Enviar solicitud</button>
                </form> :
                <form >
                    <div className="merch-inputs">
                        <label>Contenido no disponible:</label>
                        <select disabled>
                            <option value="Malla" defaultChecked>Malla</option>
                            <option value="Remera">Remera</option>
                            <option value="Sudadera" >Sudadera</option>
                            <option value="Pantalón largo">Pantalón largo</option>
                            <option value="Campera">Campera</option>
                            <option value="Top">Top</option>
                            <option value="Calza corta">Calza corta</option>
                            <option value="Manta">Manta</option>
                            <option value="Colero">Colero</option>
                        </select>
                    </div>
                    <button type="submit" disabled className="cuenta-button" >No disponible</button>
                </form>}

            {merchRequests.length != 0 &&
                <div className="table_container">

                    <table>
                        <thead>
                            <tr>
                                <th>Fecha de la solicitud</th>
                                <th>Descripción</th>
                                <th>Estado</th>
                                <th>Entregó</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                merchRequests.map((request) => (
                                    <tr key={request.id_request}>
                                        <th>{new Date(request.req_date).toLocaleDateString('en-GB')}</th>
                                        <th>{request.req_description}</th>
                                        <th>{request.pay_date ? "PAGÓ" : "PENDIENTE"}</th>
                                        <th>${request.pay_date ? "---" : request.amount}</th>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table></div>}


            {userInscriptions.length != 0 &&
                <div className="table_container">
                    <h2>Inscripciones a torneos</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Fecha de publicación</th>
                                <th>Fecha del evento</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Precio inscripción</th>
                                <th>Estado</th>
                                <th>Entregó</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                userInscriptions.map((event) => (
                                    <tr key={event.id_inscription}>
                                        <th>{new Date(event.publication_date).toLocaleDateString('en-GB')}</th>
                                        <th>{new Date(event.event_date).toLocaleDateString('en-GB')}</th>
                                        <th>{event.event_name}</th>
                                        <th>{event.event_description}</th>
                                        <th>${event.inscription_price}</th>
                                        <th>{event.pay_date ? "PAGÓ" : "PENDIENTE"}</th>
                                        <th>${event.pay_date ? "---" : event.amount}</th>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table></div>}

            <div className="products-container">
                <div className="table_container">
                    <h2>Eventos, Inscripciones y Beneficios</h2>
                    {events.length != 0 && (user && featureEventPosition) ?
                        <table>
                            <thead>
                                <tr>
                                    <th>Fecha de publicación</th>
                                    <th>Fecha del evento</th>
                                    <th>Nombre</th>
                                    <th>Descripción</th>
                                    <th>Precio inscripción</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>

                                {
                                    events.map((event) => (
                                        <tr key={event.id_event}>
                                            <th>{new Date(event.publication_date).toLocaleDateString('en-GB')}</th>
                                            <th>{new Date(event.event_date).toLocaleDateString('en-GB')}</th>
                                            <th>{event.event_name}</th>
                                            <th>{event.event_description}</th>
                                            <th>${event.inscription_price}</th>
                                            <th><button className="boton-quitar-carrito" onClick={() => { sendInscription(event.id_event, user.id_user) }}>Inscribirme</button></th>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table> :
                        <table>
                            <thead>
                                <tr>
                                    <th>Fecha de publicación</th>
                                    <th>Fecha del evento</th>
                                    <th>Nombre</th>
                                    <th>Descripción</th>
                                    <th>Precio inscripción</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr >
                                    <th>dd/mm/aaaa</th>
                                    <th>dd/mm/aaaa</th>
                                    <th>próximamente</th>
                                    <th>xxxxxxxxxxxx</th>
                                    <th>$xxxxxx</th>
                                    <th><button className="boton-quitar-carrito" disabled>No disponible</button></th>
                                </tr>
                            </tbody>
                        </table>
                    }
                </div>
                <NavLink to={"/"} className="info-button">Volver</NavLink>
            </div>

        </>
    )
}