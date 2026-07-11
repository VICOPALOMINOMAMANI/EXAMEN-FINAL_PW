import api from "./api";

export const login = async (correo, password) => {

    const response = await api.get("/usuarios");

    const usuario = response.data.find(
        u =>
            u.correo === correo &&
            u.password === password &&
            u.estado === "Activo"
    );

    return usuario;

};