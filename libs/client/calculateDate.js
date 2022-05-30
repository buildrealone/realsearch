export default function calculateDate({ year, month, day }) {
    return String(new Date(year, month, day).toLocaleDateString()).split("/")[2] + "-" + String(new Date(year, month, day).toLocaleDateString()).split("/")[0].padStart(2, "0") + "-" + String(new Date(year, month, day).toLocaleDateString()).split("/")[1].padStart(2, "0");
}