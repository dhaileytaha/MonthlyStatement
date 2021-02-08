type RowContent = string | Date | number | null | undefined;
export type CSVRow = RowContent[];
export type CSVRows = CSVRow[];

/**
 * Convert the provided rows as an CSV file with the given name.
 * Then download the created file
 */
export const exportToCSV = (filename: string, rows: CSVRows) => {
  const processRow = function (row: CSVRow) {
    let finalVal = '';
    for (let j = 0; j < row.length; j++) {
      const content = row[j];
      let innerValue = content == null ? '' : content.toString();
      if (content instanceof Date) {
        innerValue = content.toLocaleString();
      }
      let result = innerValue.replace(/"/g, '""');
      if (result.search(/("|,|\n)/g) >= 0) {
        result = '"' + result + '"';
      }
      if (j > 0) {
        finalVal += ',';
      }
      finalVal += result;
    }
    return finalVal + '\n';
  };

  let csvFile = '';
  for (let i = 0; i < rows.length; i++) {
    csvFile += processRow(rows[i]);
  }

  const blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, filename);
  } else {
    const link = document.createElement('a');
    if (link.download !== undefined) {
      // feature detection
      // Browsers that support HTML5 download attribute
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
};
