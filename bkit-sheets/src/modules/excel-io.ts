/**
 * BKIT Office - Excel & CSV I/O Module
 * Nhập và xuất tệp Excel (.xlsx, .xls) và CSV (.csv) tương thích 100% với Microsoft Excel & Univer Sheets
 */
import * as XLSX from 'xlsx';
import type { IWorkbookData, IWorksheetData } from '@univerjs/core';

export class ExcelIOManager {
  /**
   * Đọc tệp Excel hoặc CSV và chuyển thành cấu trúc IWorkbookData của Univer
   */
  public static async parseExcelFile(file: File): Promise<IWorkbookData> {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array', cellDates: true });

    const sheetsRecord: Record<string, Partial<IWorksheetData>> = {};
    const sheetOrder: string[] = [];

    workbook.SheetNames.forEach((name, index) => {
      const sheetId = `sheet-${index + 1}`;
      sheetOrder.push(sheetId);
      const worksheet = workbook.Sheets[name];

      // Chuyển worksheet thành mảng 2 chiều (Header: 1)
      const aoa = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false, defval: '' }) as any[][];

      const cellData: Record<number, Record<number, { v: any; m?: string }>> = {};
      const maxRows = Math.max(aoa.length, 50);
      let maxCols = 26;

      aoa.forEach((row, rIdx) => {
        if (!cellData[rIdx]) cellData[rIdx] = {};
        if (row.length > maxCols) maxCols = row.length;

        row.forEach((cellVal, cIdx) => {
          if (cellVal !== undefined && cellVal !== null && cellVal !== '') {
            cellData[rIdx][cIdx] = {
              v: cellVal,
              m: String(cellVal),
            };
          }
        });
      });

      sheetsRecord[sheetId] = {
        id: sheetId,
        name: name || `Trang tính ${index + 1}`,
        rowCount: Math.max(maxRows + 10, 100),
        columnCount: Math.max(maxCols + 5, 26),
        cellData: cellData as any,
      };
    });

    const workbookData: IWorkbookData = {
      id: `workbook-${Date.now()}`,
      name: file.name.replace(/\.[^/.]+$/, ''),
      appVersion: '1.0.0',
      locale: 'viVN' as any,
      sheetOrder,
      sheets: sheetsRecord as any,
      styles: {},
    };

    return workbookData;
  }

  /**
   * Xuất dữ liệu Univer Workbook thành tệp .xlsx hoặc .csv tải về máy tính
   */
  public static exportWorkbook(workbookSnapshot: any, format: 'xlsx' | 'csv', customFileName?: string): void {
    const wb = XLSX.utils.book_new();
    const sheets = workbookSnapshot.sheets || {};
    const sheetOrder: string[] = workbookSnapshot.sheetOrder || Object.keys(sheets);

    sheetOrder.forEach((sheetId) => {
      const sheet = sheets[sheetId];
      if (!sheet) return;

      const cellData = sheet.cellData || {};
      const rowKeys = Object.keys(cellData).map(Number).sort((a, b) => a - b);
      const maxRow = rowKeys.length > 0 ? Math.max(...rowKeys) : 0;

      let maxCol = 0;
      rowKeys.forEach((r) => {
        const cols = Object.keys(cellData[r] || {}).map(Number);
        if (cols.length > 0) {
          maxCol = Math.max(maxCol, ...cols);
        }
      });

      const aoa: any[][] = [];
      for (let r = 0; r <= maxRow; r++) {
        const rowArr: any[] = [];
        for (let c = 0; c <= maxCol; c++) {
          const cell = cellData[r]?.[c];
          rowArr.push(cell?.v ?? '');
        }
        aoa.push(rowArr);
      }

      const ws = XLSX.utils.aoa_to_sheet(aoa);
      XLSX.utils.book_append_sheet(wb, ws, sheet.name || 'Sheet1');
    });

    const baseName = customFileName || workbookSnapshot.name || 'BKIT-Office-Sheet';
    const finalName = `${baseName}.${format}`;

    if (format === 'csv') {
      // Với CSV lấy sheet đầu tiên
      const firstSheetName = wb.SheetNames[0] || 'Sheet1';
      const firstWs = wb.Sheets[firstSheetName];
      const csvData = XLSX.utils.sheet_to_csv(firstWs);
      const blob = new Blob(['\uFEFF' + csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = finalName;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      XLSX.writeFile(wb, finalName);
    }
  }
}
