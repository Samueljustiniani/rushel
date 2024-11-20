document.addEventListener("DOMContentLoaded", function() {
    // Definir fechas importantes de los ODS
    const odsFecha = [
        { month: 0, day: 26, message: "Día Mundial de la Educación Ambiental." },
        { month: 0, day: 28, message: "Día Mundial de la Reducción de Emisiones de CO₂ (ODS 13)" },
        { month: 1, day: 2, message: "Día Mundial de los Humedales (ODS 6 y 15)" },
        { month: 1, day: 20, message: "Día Mundial de la Justicia Social (ODS 10 y 16)" },
        { month: 2, day: 8, message: "Día Internacional de la Mujer (ODS 5)" },
        { month: 2, day: 22, message: "Día Mundial del Agua (ODS 6)" },
        { month: 2, day: 24, message: "Día Mundial de la Tuberculosis (ODS 3)" },
        { month: 3, day: 7, message: "Día Mundial de la Salud (ODS 3)" },
        { month: 3, day: 22, message: "Día de la Tierra (ODS 13 y 15)" },
        { month: 3, day: 25, message: "Día Mundial del Paludismo (ODS 3)" },
        { month: 4, day: 14, message: "Día Internacional de las Familias (ODS 1 y 16)" },
        { month: 4, day: 22, message: "Día Internacional de la Diversidad Biológica (ODS 15)" },
        { month: 5, day: 5, message: "Día Mundial del Medio Ambiente (ODS 13 y 15)" },
        { month: 5, day: 8, message: "Día Mundial de los Océanos (ODS 14)" },
        { month: 5, day: 17, message: "Día Mundial de Lucha contra la Desertificación y la Sequía (ODS 15)" },
        { month: 6, day: 11, message: "Día Mundial de la Población (ODS 11)" },
        { month: 6, day: 15, message: "Día Mundial de las Habilidades de la Juventud (ODS 4 y 8)" },
        { month: 7, day: 9, message: "Día Internacional de los Pueblos Indígenas (ODS 10)" },
        { month: 7, day: 12, message: "Día Internacional de la Juventud (ODS 4 y 8)" },
        { month: 7, day: 19, message: "Día Mundial de la Asistencia Humanitaria (ODS 16)" },
        { month: 8, day: 8, message: "Día Internacional de la Alfabetización (ODS 4)" },
        { month: 8, day: 15, message: "Día Internacional de la Democracia (ODS 16)" },
        { month: 8, day: 21, message: "Día Internacional de la Paz (ODS 16)" },
        { month: 8, day: 26, message: "Día Internacional para la Eliminación Total de las Armas Nucleares (ODS 16)" },
        { month: 9, day: 1, message: "Día Internacional de las Personas Mayores (ODS 10)" },
        { month: 9, day: 5, message: "Día Mundial de los Docentes (ODS 4)" },
        { month: 9, day: 16, message: "Día Mundial de la Alimentación (ODS 2)" },
        { month: 9, day: 17, message: "Día Internacional para la Erradicación de la Pobreza (ODS 1)" },
        { month: 10, day: 16, message: "Día Internacional para la Tolerancia (ODS 16)" },
        { month: 10, day: 20, message: "Día Universal del Niño (ODS 1, 3, 4, 10)" },
        { month: 11, day: 1, message: "Día Mundial de la Lucha contra el Sida (ODS 3)" },
        { month: 11, day: 3, message: "Día Internacional de las Personas con Discapacidad (ODS 10)" },
        { month: 11, day: 10, message: "Día de los Derechos Humanos (ODS 16)" },
        { month: 11, day: 18, message: "Día Internacional del Migrante (ODS 10 y 16)" },
    ];

    // Obtener la fecha actual
    const today = new Date();
    const currentMonth = today.getMonth();  // mes actual
    const currentDay = today.getDate();     // día actual

    // Buscar si la fecha actual coincide con una fecha de ODS
    const odsEvent = odsFecha.find(date => date.month === currentMonth && date.day === currentDay);

    // Mostrar el mensaje si la fecha coincide
    const messageElement = document.getElementById("dateMessage");
    if (odsEvent) {
        messageElement.innerText = `Hoy es ${today.toLocaleDateString()} - ${odsEvent.message}`;

        setTimeout(() => {
            messageElement.style.display = "none";  
        }, 5000);  
    } else {
        messageElement.innerText = "Hoy no es una fecha importante de los ODS.";

        setTimeout(() => {
            messageElement.style.display = "none";  
        }, 5000);
    }
});
