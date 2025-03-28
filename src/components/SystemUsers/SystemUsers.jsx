import { NavLink } from "react-router-dom";
import axios from "../../config/axiosConfig";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { downloadExcel } from "react-export-table-to-excel";
import { toast } from 'react-toastify';

const urlUsers = "users/usersclean"
const urlChangeStatus = "users/changeuserstatus"
const urlChangeGroup = "users/changeusergroup"
const urlChangeFee = "users/changeuserfee"

export default function SystemUsers() {
    const [users, setUsers] = useState([])

    const {
        register,
        handleSubmit,
    } = useForm({
        mode: "onBlur",
    });

    const {
        register: register2
    } = useForm({
        mode: "onBlur",
    });

    const {
        register: register3
    } = useForm({
        mode: "onBlur",
    });

    const {
        register: register4
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

    function changeUserStatus(e, uid) {
        const newStatus = parseInt(e);
        axios.post(urlChangeStatus, { uid: uid, userStatus: newStatus }, { withCredentials: true })
            .then(response => {
                toast.success('Se cambió el estado del usuario.');
                setUsers(prevUsers =>
                    prevUsers.map(user =>
                        user.id_user === uid ? { ...user, user_status: newStatus } : user
                    )
                );
            })
            .catch(error => {
                console.log(error);
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            })
    }

    function changeUserFee(e, uid) {
        const newFee = parseInt(e);
        axios.post(urlChangeFee, { uid: uid, userFee: newFee }, { withCredentials: true })
            .then(response => {
                toast.success('Se cambió la tarifa del usuario.');
                setUsers(prevUsers =>
                    prevUsers.map(user =>
                        user.id_user === uid ? { ...user, id_fee: newFee } : user
                    )
                );
            })
            .catch(error => {
                console.log(error);
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            })
    }

    function changeUserGroup(e, uid) {
        const newGroup = parseInt(e);
        axios.post(urlChangeGroup, { uid: uid, newUserGroup: newGroup }, { withCredentials: true })
            .then(response => {
                toast.success('Se cambió el grupo del usuario.');
                setUsers(prevUsers =>
                    prevUsers.map(user =>
                        user.id_user === uid ? { ...user, user_group: newGroup } : user
                    )
                );
            })
            .catch(error => {
                console.log(error);
                toast.error('Ocurrió un error inesperado. Intenta de nuevo');
            })
    }



    function handleDownloadExcel() {
        const header = ["ID usuario", "Nombre", "Apellido", "Email", "Nacimiento", "password encriptado", "DNI", "Es admin", "Estatus", "Fecha Ingreso", "Tarifa", "Telefono", "Grupo"];
        downloadExcel({
            fileName: "Usuarios",
            sheet: "Usuarios",
            tablePayload: {
                header,
                body: users,
            },
        });
    }


    return (
        <div className="carrito">
            <h1>Gestión de usuarios</h1>

            <form onSubmit={handleSubmit(getUsers)} className="checkout-form">
                <label>Buscar por:
                    <select {...register("search")}>
                        <option value="last_name" defaultChecked>Apellido</option>
                        <option value="first_name">Nombre</option>
                        <option value="dni">DNI</option>
                        <option value="user_group">Grupo</option>
                        <option value="user_status">Estado (0 o 1)</option>
                        <option value="TODO" >Todo</option>
                    </select>
                </label>
                <label>Comienza con:
                    <input type="text" name="value" placeholder="Ingresa tu búsqueda..." {...register("value")} />
                </label>
                <button type="submit" className="cuenta-button">Buscar</button>
            </form>

            {users.length != 0 &&
                    <div className="table_container">
                    <button className="boton-quitar-carrito" onClick={handleDownloadExcel}>Exportar</button>
                        <table >
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Apellido</th>
                                    <th>Nacimiento</th>
                                    <th>DNI</th>
                                    <th>Teléfono</th>
                                    <th>Registrado</th>
                                    <th>Estado</th>
                                    <th>Tarifa</th>
                                    <th>Grupo</th>
                                </tr>
                            </thead>
                            <tbody>

                                {
                                    users.map((user) => (
                                        <tr key={user.id_user}>
                                            <th>{user.first_name}</th>
                                            <th>{user.last_name}</th>
                                            <th>{new Date(user.birth_date).toLocaleDateString('en-GB')}</th>
                                            <th>{user.dni}</th>
                                            <th>{user.tel_contact}</th>
                                            <th>{new Date(user.register_date).toLocaleDateString('en-GB')}</th>
                                            <th><select {...register2(`status_${user.id_user}`)} value={user.user_status}
                                                onChange={e => { changeUserStatus(e.target.value, user.id_user) }} >
                                                <option value="1">Activo</option>
                                                <option value="0">Inactivo</option>
                                            </select></th>
                                            <th><select {...register3(`userFee_${user.id_user}`)} value={String(user.id_fee)}
                                                onChange={e => { changeUserFee(e.target.value, user.id_user) }}>
                                                <option value="1">Escuelita</option>
                                                <option value="2">Esc Hnos x2</option>
                                                <option value="3">Esc Hnos x3</option>
                                                <option value="4">Competencia</option>
                                                <option value="5">Competencia x2</option>
                                                <option value="6">Comp + Esc</option>
                                                <option value="7">Amigo</option>
                                            </select></th>
                                            <th><select {...register4(`newUserGroup_${user.id_user}`)} value={String(user.user_group)}
                                                onChange={e => { changeUserGroup(e.target.value, user.id_user) }}>
                                                <option value="1">peques 1</option>
                                                <option value="2">peques 2</option>
                                                <option value="3">gimnasia 1</option>
                                                <option value="4">gimnasia 2</option>
                                                <option value="5">gimnasia 3</option>
                                                <option value="6">gimnasia 4</option>
                                                <option value="7">gimnasia 5</option>
                                                <option value="8">entrenamiento 1</option>
                                                <option value="9">entrenamiento 2</option>
                                            </select></th>
                                        </tr>
                                    ))
                                }

                            </tbody>
                        </table>
                    </div>
            }
            <NavLink to={`/`} className="info-button">Volver</NavLink>


        </div>
    )
}