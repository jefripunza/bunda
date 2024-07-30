export const formatRupiah = (angka: number, prefix: string) => {
  const value = parseFloat(String(angka));
  const valueString = value.toFixed(2);
  const number_string = String(angka).replace(/[^,\d]/g, ""),
    split = number_string.split(","),
    sisa = split[0].length % 3,
    ribuan = split[0].substr(sisa).match(/\d{3}/gi);
  let rupiah = split[0].substr(0, sisa);
  if (ribuan) {
    const separator = sisa ? "." : "";
    rupiah += separator + ribuan.join(".");
  }
  rupiah = split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
  if (valueString.includes(".")) {
    const [, decimal] = valueString.split(".");
    rupiah += `,${decimal.padEnd(2, "0")}`;
  } else {
    rupiah += ",00";
  }
  return prefix === undefined ? rupiah : rupiah ? prefix + rupiah : "";
};
