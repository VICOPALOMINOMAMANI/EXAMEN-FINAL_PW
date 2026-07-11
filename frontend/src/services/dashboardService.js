import api from "./api";

export const obtenerDashboard = async () => {

    const [
        adultos,
        voluntarios,
        visitas,
        alertas
    ] = await Promise.all([

        api.get("/adultosMayores"),
        api.get("/voluntarios"),
        api.get("/visitas"),
        api.get("/alertas")

    ]);

    return {

        adultos: adultos.data,
        voluntarios: voluntarios.data,
        visitas: visitas.data,
        alertas: alertas.data

    };

};