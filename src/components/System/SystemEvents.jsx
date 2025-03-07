import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
import axios from "../../config/axiosConfig";
import { toast } from 'react-toastify';

const urlEvents = "events/"

export default function SystemEvents() {
    const [events, setEvents] = useState([]);

    const {
        register,
        handleSubmit,
        reset
    } = useForm({
        mode: "onBlur",
    });

    function fetchEvents() {
        axios.get(urlEvents, { withCredentials: true })
            .then(response => {
                setEvents(response.data);
            })
            .catch(error => {
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                console.log(error)
            })
    }

    useEffect(() => {
        fetchEvents();
    }, []);

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

    const newEvent = (e) => {
        axios.post(urlEvents, {
            event_date: e.event_date,
            event_name: e.event_name,
            event_description: e.event_description,
            inscription_price: e.inscription_price
        }, { withCredentials: true })
            .then(response => {
                toast.success('Se creó el evento correctamente.');
                fetchEvents();
            })
            .catch(error => {
                if (error.response.statusText && error.response.statusText === "Unauthorized") return toast.error(error.response.data.error);
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
                console.log(error)
            })
    }

    return (
            <div className="sistema-container">
                <h1>Crear eventos:</h1>

                <div className="altas">
                    <form onSubmit={handleSubmit(newEvent)} className="checkout-form">
                        <input type="date" name="event_date" placeholder="Fecha del evento *" {...register("event_date", { required: true })} />
                        <input type="text" name="event_name" placeholder="Nombre del evento *" {...register("event_name", { required: true })} />
                        <input type="text" name="event_description" placeholder="Descripción *" {...register("event_description", { required: true })} />
                        <input type="number" name="inscription_price" placeholder="Precio de inscripción *" min={"0"} defaultValue={"0"} {...register("inscription_price")} />

                        <div className="sistema-bajas-modif-botones">
                            <button type="submit" className="cuenta-button">Registrar evento</button>
                            <button type="reset" className="boton-quitar-carrito" onClick={reset}>Reset</button>
                        </div>
                    </form>
                </div>

                <div className="bajas-modif-main">

                    {
                        !events.length ?

                            <p className="text-info">No se encontraron eventos</p> :
                            <>
                                <h2>Listado de eventos:</h2>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Fecha publicación</th>
                                            <th>Fecha Evento</th>
                                            <th>Nombre</th>
                                            <th>Decripción</th>
                                            <th>Precio</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {
                                            events.map((event) => (
                                                <tr key={event.id_event}>
                                                    <th>{event.publication_date.slice(0, -14)}</th>
                                                    <th>{event.event_date.slice(0, -14)}</th>
                                                    <th>{event.event_name}</th>
                                                    <th>{event.event_description}</th>
                                                    <th>{event.inscription_price}</th>
                                                    <th className="edit-event-buttons-container"> <button className="delete-event-button" onClick={() => { deleteEvent(event.id_event) }}>Borrar</button>
                                                        {<NavLink to={`/updateevent/${event.id_event}`} className="edit-event-button" >Editar</NavLink>}</th>
                                                </tr>
                                            ))
                                        }

                                    </tbody>
                                </table>
                            </>
                    }
                </div>
                <NavLink to={"/"} className="info-button" >Volver</NavLink>
            </div>
    )
}