type FormatTime = (ms: number) => string;

const formatTime: FormatTime = (ms) => {
    const minutes = String(Math.floor(ms / 60000)).padStart(2, "0");
    const seconds = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
    const centiseconds = String(Math.floor((ms % 1000) / 10)).padStart(2, "0");
    return `${minutes}:${seconds}:${centiseconds}`;
};
export default formatTime;