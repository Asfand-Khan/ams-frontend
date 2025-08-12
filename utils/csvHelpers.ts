export const convertToCSV = (array: any[]) => {
  if (array.length === 0) return "";

  const keys = Object.keys(array[0]); // CSV headers
  const header = keys.join(","); // join headers with commas
  const rows = array.map(
    (row) => keys.map((k) => `"${row[k] ?? ""}"`).join(",") // wrap in quotes for safety
  );

  return [header, ...rows].join("\n");
};

export const triggerCSVDownload = (csvContent: string, filename: string) => {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};
