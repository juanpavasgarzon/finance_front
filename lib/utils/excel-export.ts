import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

interface ExcelColumn {
  header: string;
  key: string;
  width?: number;
  isCurrency?: boolean;
}

interface ExcelSheetData {
  name: string;
  columns: Array<ExcelColumn>;
  rows: Array<Record<string, string | number>>;
  title?: string;
  subtitle?: string;
}

const HEADER_FILL: ExcelJS.Fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF4472C4" } };
const HEADER_FONT: Partial<ExcelJS.Font> = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
const TITLE_FONT: Partial<ExcelJS.Font> = { bold: true, size: 14, color: { argb: "FF333333" } };
const SUBTITLE_FONT: Partial<ExcelJS.Font> = { size: 10, italic: true, color: { argb: "FF64748B" } };
const TOTAL_FILL: ExcelJS.Fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE8E8E8" } };
const STRIPE_FILL: ExcelJS.Fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF8F9FA" } };
const BORDER_THIN: Partial<ExcelJS.Borders> = {
  top: { style: "thin", color: { argb: "FFD0D0D0" } },
  bottom: { style: "thin", color: { argb: "FFD0D0D0" } },
  left: { style: "thin", color: { argb: "FFD0D0D0" } },
  right: { style: "thin", color: { argb: "FFD0D0D0" } },
};
const CURRENCY_FORMAT = "#,##0";

function colLetter(index: number): string {
  let result = "";
  let n = index;

  while (n >= 0) {
    result = String.fromCharCode((n % 26) + 65) + result;
    n = Math.floor(n / 26) - 1;
  }

  return result;
}

export async function exportToExcel(sheets: Array<ExcelSheetData>, filename: string) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Finance";
  workbook.created = new Date();

  sheets.forEach((sheet) => {
    const ws = workbook.addWorksheet(sheet.name, {
      properties: { defaultRowHeight: 22, tabColor: { argb: "FF4472C4" } },
    });

    const lastColLetter = colLetter(sheet.columns.length - 1);
    let currentRow = 1;

    if (sheet.title) {
      ws.mergeCells(`A${currentRow}:${lastColLetter}${currentRow}`);
      const titleCell = ws.getCell(`A${currentRow}`);
      titleCell.value = sheet.title;
      titleCell.font = TITLE_FONT;
      titleCell.alignment = { horizontal: "center", vertical: "middle" };
      ws.getRow(currentRow).height = 36;
      currentRow++;
    }

    if (sheet.subtitle) {
      ws.mergeCells(`A${currentRow}:${lastColLetter}${currentRow}`);
      const subCell = ws.getCell(`A${currentRow}`);
      subCell.value = sheet.subtitle;
      subCell.font = SUBTITLE_FONT;
      subCell.alignment = { horizontal: "center", vertical: "middle" };
      currentRow++;
    }

    if (sheet.title || sheet.subtitle) {
      currentRow++;
    }

    const headerRow = ws.getRow(currentRow);
    headerRow.height = 28;

    sheet.columns.forEach((col, idx) => {
      const cell = headerRow.getCell(idx + 1);
      cell.value = col.header;
      cell.font = HEADER_FONT;
      cell.fill = HEADER_FILL;
      cell.border = BORDER_THIN;
      cell.alignment = { horizontal: "center", vertical: "middle" };
    });

    currentRow++;

    const dataStartRow = currentRow;

    sheet.rows.forEach((row, rowIdx) => {
      const dataRow = ws.getRow(currentRow);

      sheet.columns.forEach((col, colIdx) => {
        const cell = dataRow.getCell(colIdx + 1);
        cell.value = row[col.key] ?? "";

        if (col.isCurrency && typeof cell.value === "number") {
          cell.numFmt = CURRENCY_FORMAT;
        }

        cell.font = { size: 10 };
        cell.alignment = { vertical: "middle", horizontal: col.isCurrency ? "right" : "left" };
        cell.border = BORDER_THIN;

        if (rowIdx % 2 === 1) {
          cell.fill = STRIPE_FILL;
        }
      });

      currentRow++;
    });

    const currencyCols = sheet.columns.filter((c) => c.isCurrency);

    if (currencyCols.length > 0 && sheet.rows.length > 0) {
      currentRow++;
      const totalRow = ws.getRow(currentRow);

      sheet.columns.forEach((col, idx) => {
        const cell = totalRow.getCell(idx + 1);

        if (idx === 0) {
          cell.value = "TOTAL";
          cell.font = { bold: true, size: 11 };
        }

        if (col.isCurrency) {
          const sum = sheet.rows.reduce((acc, r) => acc + (typeof r[col.key] === "number" ? (r[col.key] as number) : 0), 0);
          cell.value = sum;
          cell.numFmt = CURRENCY_FORMAT;
          cell.font = { bold: true, size: 11 };
          cell.alignment = { horizontal: "right", vertical: "middle" };
        }

        cell.fill = TOTAL_FILL;
        cell.border = BORDER_THIN;
      });
    }

    sheet.columns.forEach((col, idx) => {
      ws.getColumn(idx + 1).width = col.width || 18;
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  saveAs(blob, filename);
}
