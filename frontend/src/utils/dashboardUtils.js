export const contarCasosCriticos = (adultos) => {

    return adultos.filter(
        a => a.nivelVulnerabilidad === "Crítico"
    ).length;

};

export const contarVisitasPendientes = (visitas) => {

    return visitas.filter(
        v => v.estado === "Pendiente"
    ).length;

};

export const obtenerDistritos = (adultos) => {

    const contador = {};

    adultos.forEach(adulto => {

        contador[adulto.distrito] =
            (contador[adulto.distrito] || 0) + 1;

    });

    return Object.entries(contador).map(([name,value])=>({

        name,
        value

    }));

};