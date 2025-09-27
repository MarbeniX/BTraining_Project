export default function formatReadableDate(dateString: string): string {
    const date = new Date(dateString);

    // Formateo con opciones en español
    return date.toLocaleString('es-MX', {
        weekday: 'long',    // lunes, martes, etc. (puedes quitarlo si no quieres el día)
        year: 'numeric',
        month: 'long',      // junio
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true        // para formato AM/PM
    });
}

