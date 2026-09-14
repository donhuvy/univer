import type { Univer } from '@univerjs/core';
import { ExcelIOManager } from './modules/excel-io';

export function setupFileMenu(univer: Univer, getActiveWorkbook: () => any, onWorkbookLoaded?: (newUnit: any) => void): void {
  const btnFile = document.getElementById('btn-menu-file');
  const fileDropdown = document.getElementById('menu-file-dropdown');

  // Toggle dropdown
  btnFile?.addEventListener('click', (e) => {
    e.stopPropagation();
    fileDropdown?.classList.toggle('hidden');
  });

  // Close when clicking outside
  document.addEventListener('click', () => {
    fileDropdown?.classList.add('hidden');
  });

  // File action handlers
  document.getElementById('action-new')?.addEventListener('click', () => {
    if (confirm('Tạo tài liệu mới? Các dữ liệu chưa lưu sẽ được làm mới.')) {
      window.location.reload();
    }
  });

  // Lưu dự án (.bkit.json)
  document.getElementById('action-save')?.addEventListener('click', () => {
    try {
      const workbook = getActiveWorkbook();
      const data = workbook?.save ? workbook.save() : workbook;
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${document.getElementById('doc-title')?.textContent || 'bkit-sheet'}.bkit.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Không thể lưu tệp: ' + err);
    }
  });

  // Xuất Excel .xlsx
  document.getElementById('action-export-xlsx')?.addEventListener('click', () => {
    try {
      const workbook = getActiveWorkbook();
      const snapshot = workbook?.save ? workbook.save() : workbook;
      const title = document.getElementById('doc-title')?.textContent || 'BKIT-Bang-Tinh';
      ExcelIOManager.exportWorkbook(snapshot, 'xlsx', title);
    } catch (err) {
      alert('Không thể xuất file Excel: ' + err);
    }
  });

  // Xuất CSV .csv
  document.getElementById('action-export-csv')?.addEventListener('click', () => {
    try {
      const workbook = getActiveWorkbook();
      const snapshot = workbook?.save ? workbook.save() : workbook;
      const title = document.getElementById('doc-title')?.textContent || 'BKIT-Du-Lieu';
      ExcelIOManager.exportWorkbook(snapshot, 'csv', title);
    } catch (err) {
      alert('Không thể xuất file CSV: ' + err);
    }
  });

  // Mở tệp Excel (.xlsx, .xls, .csv, .json)
  document.getElementById('action-open')?.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls,.csv,.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv')) {
          const workbookData = await ExcelIOManager.parseExcelFile(file);
          // Tạo unit mới từ dữ liệu Excel vừa đọc
          const newUnit = (univer as any).createUnit(2, workbookData); // 2 = UNIVER_SHEET
          if (onWorkbookLoaded) {
            onWorkbookLoaded(newUnit);
          }
          alert(`Đã nhập dữ liệu Excel thành công: ${file.name}`);
        } else if (file.name.endsWith('.json')) {
          const content = await file.text();
          const data = JSON.parse(content);
          const newUnit = (univer as any).createUnit(2, data);
          if (onWorkbookLoaded) {
            onWorkbookLoaded(newUnit);
          }
          alert(`Đã nạp dự án BKIT thành công: ${file.name}`);
        }
        const docTitle = document.getElementById('doc-title');
        if (docTitle) docTitle.textContent = file.name;
      } catch (err) {
        alert('Lỗi nạp tệp: ' + err);
      }
    };
    input.click();
  });

  document.getElementById('action-print')?.addEventListener('click', () => {
    window.print();
  });
}
