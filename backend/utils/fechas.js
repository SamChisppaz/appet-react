// fecha de hoy mas los dias indicados, en formato "AAAA-MM-DD"
// en este formato las fechas se pueden comparar como texto
function fechaEnDias(dias) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + dias);
    return fecha.toLocaleDateString("en-CA");
}

// fecha de hoy mas los meses indicados, en formato "AAAA-MM-DD"
// si el mes de destino tiene menos dias (por ejemplo 31 de enero + 1 mes), queda en el ultimo dia de ese mes
function fechaEnMeses(meses) {
    const fecha = new Date();
    const diaDeHoy = fecha.getDate();

    // primero se pasa al dia 1 para que setMonth no salte al mes siguiente
    fecha.setDate(1);
    fecha.setMonth(fecha.getMonth() + meses);

    // el dia 0 del mes siguiente es el ultimo dia del mes de destino
    const ultimoDia = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0).getDate();
    fecha.setDate(Math.min(diaDeHoy, ultimoDia));

    return fecha.toLocaleDateString("en-CA");
}

// una jornada nueva se puede crear desde hoy + 1 mes, sin tener en cuenta la hora
function fechaMinimaCreacion() {
    return fechaEnMeses(1);
}

// una jornada esta disponible para los ciudadanos desde hoy + 7 dias, sin tener en cuenta la hora
function fechaMinimaDisponible() {
    return fechaEnDias(7);
}

module.exports = { fechaMinimaCreacion, fechaMinimaDisponible };