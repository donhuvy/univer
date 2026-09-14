import { IUniverInstanceService, LocaleType, LogLevel, Univer, UniverInstanceType } from '@univerjs/core';
import { UniverFormulaEnginePlugin } from '@univerjs/engine-formula';
import { UniverRenderEnginePlugin } from '@univerjs/engine-render';
import { UniverUIPlugin } from '@univerjs/ui';

// Docs Plugins
import { UniverDocsPlugin } from '@univerjs/docs';
import { UniverDocsUIPlugin } from '@univerjs/docs-ui';

// Sheets Plugins
import { UniverSheetsPlugin } from '@univerjs/sheets';
import { UniverSheetsUIPlugin } from '@univerjs/sheets-ui';
import { UniverSheetsFormulaPlugin } from '@univerjs/sheets-formula';
import { UniverSheetsFormulaUIPlugin } from '@univerjs/sheets-formula-ui';
import { UniverSheetsNumfmtPlugin } from '@univerjs/sheets-numfmt';
import { UniverSheetsDataValidationPlugin } from '@univerjs/sheets-data-validation';
import { UniverSheetsDataValidationUIPlugin } from '@univerjs/sheets-data-validation-ui';
import { UniverSheetsConditionalFormattingPlugin } from '@univerjs/sheets-conditional-formatting';
import { UniverSheetsConditionalFormattingUIPlugin } from '@univerjs/sheets-conditional-formatting-ui';
import { UniverSheetsFilterPlugin } from '@univerjs/sheets-filter';
import { UniverSheetsFilterUIPlugin } from '@univerjs/sheets-filter-ui';
import { UniverSheetsSortPlugin } from '@univerjs/sheets-sort';
import { UniverSheetsSortUIPlugin } from '@univerjs/sheets-sort-ui';
import { UniverSheetsHyperLinkPlugin } from '@univerjs/sheets-hyper-link';
import { UniverSheetsHyperLinkUIPlugin } from '@univerjs/sheets-hyper-link-ui';
import { UniverSheetsNotePlugin } from '@univerjs/sheets-note';
import { UniverSheetsNoteUIPlugin } from '@univerjs/sheets-note-ui';
import { UniverSheetsZenEditorPlugin } from '@univerjs/sheets-zen-editor';
import { UniverSheetsDrawingPlugin } from '@univerjs/sheets-drawing';
import { UniverSheetsDrawingUIPlugin } from '@univerjs/sheets-drawing-ui';

// Slides & Drawing Plugins
import { UniverDrawingPlugin } from '@univerjs/drawing';
import { UniverDrawingUIPlugin } from '@univerjs/drawing-ui';
import { UniverSlidesPlugin } from '@univerjs/slides';
import { UniverSlidesUIPlugin } from '@univerjs/slides-ui';

// Styles
import '@univerjs/design/lib/index.css';
import '@univerjs/ui/lib/index.css';
import '@univerjs/docs-ui/lib/index.css';
import '@univerjs/sheets-ui/lib/index.css';
import '@univerjs/sheets-formula-ui/lib/index.css';
import '@univerjs/drawing-ui/lib/index.css';
import '@univerjs/sheets-drawing-ui/lib/index.css';
import '@univerjs/sheets-filter-ui/lib/index.css';
import '@univerjs/sheets-conditional-formatting-ui/lib/index.css';
import '@univerjs/sheets-data-validation-ui/lib/index.css';
import '@univerjs/sheets-sort-ui/lib/index.css';
import '@univerjs/sheets-hyper-link-ui/lib/index.css';
import '@univerjs/sheets-note-ui/lib/index.css';
import '@univerjs/slides-ui/lib/index.css';

// Locales (vi-VN)
import DesignViVN from '@univerjs/design/locale/vi-VN';
import UIPropertiesViVN from '@univerjs/ui/locale/vi-VN';
import DocsUIViVN from '@univerjs/docs-ui/locale/vi-VN';
import SheetsViVN from '@univerjs/sheets/locale/vi-VN';
import SheetsUIViVN from '@univerjs/sheets-ui/locale/vi-VN';
import SheetsFormulaUIViVN from '@univerjs/sheets-formula-ui/locale/vi-VN';
import SheetsDrawingUIViVN from '@univerjs/sheets-drawing-ui/locale/vi-VN';
import SheetsDataValidationUIViVN from '@univerjs/sheets-data-validation-ui/locale/vi-VN';
import SheetsConditionalFormattingUIViVN from '@univerjs/sheets-conditional-formatting-ui/locale/vi-VN';
import SheetsFilterUIViVN from '@univerjs/sheets-filter-ui/locale/vi-VN';
import SheetsSortUIViVN from '@univerjs/sheets-sort-ui/locale/vi-VN';
import SheetsHyperLinkUIViVN from '@univerjs/sheets-hyper-link-ui/locale/vi-VN';
import SheetsNoteUIViVN from '@univerjs/sheets-note-ui/locale/vi-VN';
import SlidesUIViVN from '@univerjs/slides-ui/locale/vi-VN';

// Locales (en-US)
import DesignEnUS from '@univerjs/design/locale/en-US';
import UIPropertiesEnUS from '@univerjs/ui/locale/en-US';
import DocsUIEnUS from '@univerjs/docs-ui/locale/en-US';
import SheetsEnUS from '@univerjs/sheets/locale/en-US';
import SheetsUIEnUS from '@univerjs/sheets-ui/locale/en-US';
import SheetsFormulaUIEnUS from '@univerjs/sheets-formula-ui/locale/en-US';
import SheetsDrawingUIEnUS from '@univerjs/sheets-drawing-ui/locale/en-US';
import SheetsDataValidationUIEnUS from '@univerjs/sheets-data-validation-ui/locale/en-US';
import SheetsConditionalFormattingUIEnUS from '@univerjs/sheets-conditional-formatting-ui/locale/en-US';
import SheetsFilterUIEnUS from '@univerjs/sheets-filter-ui/locale/en-US';
import SheetsSortUIEnUS from '@univerjs/sheets-sort-ui/locale/en-US';
import SheetsHyperLinkUIEnUS from '@univerjs/sheets-hyper-link-ui/locale/en-US';
import SheetsNoteUIEnUS from '@univerjs/sheets-note-ui/locale/en-US';
import SlidesUIEnUS from '@univerjs/slides-ui/locale/en-US';

import { LicensingManager } from './licensing';
import { setupAboutDialog } from './about-dialog';
import { setupFileMenu } from './file-menu';
import { PDFEditorManager } from './modules/pdf-editor';
import { TEMPLATES_CATALOG } from './modules/templates';
import {
  DEFAULT_BKIT_SHEET_DATA,
  DEFAULT_BKIT_DOC_DATA,
  DEFAULT_BKIT_SLIDE_DATA,
  TEMPLATE_SALARY_SHEET_DATA,
  TEMPLATE_INVOICE_SHEET_DATA,
  TEMPLATE_CASHBOOK_SHEET_DATA,
} from './modules/sample-data';
import {
  numberToVietnameseWords,
  changeTextCase,
  removeVietnameseAccents,
  convertTCVN3ToUnicode,
} from './modules/vietnamese-tools';

type OfficeMode = 'sheets' | 'docs' | 'slides' | 'pdf';

async function bootstrap() {
  console.log('[BKIT Office] Khởi tạo bộ ứng dụng văn phòng toàn diện...');

  // 1. Kiểm tra bản quyền & About dialog
  const licensing = new LicensingManager();
  await licensing.init();
  setupAboutDialog();

  // 2. Khởi tạo PDF Editor Manager
  const pdfManager = new PDFEditorManager();
  pdfManager.init();

  // 3. Khởi tạo Lõi Univer Engine
  const viVN = {
    ...DesignViVN,
    ...UIPropertiesViVN,
    ...DocsUIViVN,
    ...SheetsViVN,
    ...SheetsUIViVN,
    ...SheetsFormulaUIViVN,
    ...SheetsDrawingUIViVN,
    ...SheetsDataValidationUIViVN,
    ...SheetsConditionalFormattingUIViVN,
    ...SheetsFilterUIViVN,
    ...SheetsSortUIViVN,
    ...SheetsHyperLinkUIViVN,
    ...SheetsNoteUIViVN,
    ...SlidesUIViVN,
  };

  const enUS = {
    ...DesignEnUS,
    ...UIPropertiesEnUS,
    ...DocsUIEnUS,
    ...SheetsEnUS,
    ...SheetsUIEnUS,
    ...SheetsFormulaUIEnUS,
    ...SheetsDrawingUIEnUS,
    ...SheetsDataValidationUIEnUS,
    ...SheetsConditionalFormattingUIEnUS,
    ...SheetsFilterUIEnUS,
    ...SheetsSortUIEnUS,
    ...SheetsHyperLinkUIEnUS,
    ...SheetsNoteUIEnUS,
    ...SlidesUIEnUS,
  };

  const univer = new Univer({
    locale: LocaleType.VI_VN,
    locales: {
      [LocaleType.VI_VN]: viVN,
      [LocaleType.EN_US]: enUS,
    },
    logLevel: LogLevel.WARN,
  });

  // Core Plugins
  univer.registerPlugin(UniverRenderEnginePlugin);
  univer.registerPlugin(UniverFormulaEnginePlugin);
  univer.registerPlugin(UniverUIPlugin, {
    container: 'sheet-container',
    header: true,
    toolbar: true,
    footer: true,
  });

  // Docs Plugins
  univer.registerPlugin(UniverDocsPlugin);
  univer.registerPlugin(UniverDocsUIPlugin);

  // Sheets Plugins
  univer.registerPlugin(UniverSheetsPlugin);
  univer.registerPlugin(UniverSheetsUIPlugin);
  univer.registerPlugin(UniverSheetsFormulaPlugin);
  univer.registerPlugin(UniverSheetsFormulaUIPlugin);
  univer.registerPlugin(UniverSheetsNumfmtPlugin);
  univer.registerPlugin(UniverSheetsConditionalFormattingPlugin);
  univer.registerPlugin(UniverSheetsConditionalFormattingUIPlugin);
  univer.registerPlugin(UniverSheetsDataValidationPlugin);
  univer.registerPlugin(UniverSheetsDataValidationUIPlugin);
  univer.registerPlugin(UniverSheetsFilterPlugin);
  univer.registerPlugin(UniverSheetsFilterUIPlugin);
  univer.registerPlugin(UniverSheetsSortPlugin);
  univer.registerPlugin(UniverSheetsSortUIPlugin);
  univer.registerPlugin(UniverSheetsHyperLinkPlugin);
  univer.registerPlugin(UniverSheetsHyperLinkUIPlugin);
  univer.registerPlugin(UniverSheetsNotePlugin);
  univer.registerPlugin(UniverSheetsNoteUIPlugin);
  univer.registerPlugin(UniverSheetsZenEditorPlugin);

  // Drawing & Slides Plugins
  univer.registerPlugin(UniverDrawingPlugin);
  univer.registerPlugin(UniverDrawingUIPlugin);
  univer.registerPlugin(UniverSheetsDrawingPlugin);
  univer.registerPlugin(UniverSheetsDrawingUIPlugin);
  univer.registerPlugin(UniverSlidesPlugin);
  univer.registerPlugin(UniverSlidesUIPlugin);

  // Tạo sẵn các Unit cho Bảng tính, Văn bản và Trình chiếu
  let currentSheetUnit = univer.createUnit(UniverInstanceType.UNIVER_SHEET, DEFAULT_BKIT_SHEET_DATA);
  const docUnit = univer.createUnit(UniverInstanceType.UNIVER_DOC, DEFAULT_BKIT_DOC_DATA);
  const slideUnit = univer.createUnit(UniverInstanceType.UNIVER_SLIDE, DEFAULT_BKIT_SLIDE_DATA);

  // Lấy Instance Service để chuyển đổi active document
  const injector = (univer as any).__getInjector();
  const instanceService = injector.get(IUniverInstanceService) as IUniverInstanceService;

  // Thiết lập Menu Tệp (Hỗ trợ mở/xuất Excel .xlsx, CSV, v.v.)
  setupFileMenu(
    univer,
    () => currentSheetUnit,
    (newUnit) => {
      currentSheetUnit = newUnit;
      instanceService.focusUnit(newUnit.getUnitId());
      switchOfficeMode('sheets');
    }
  );

  // 4. Quản lý Chuyển đổi 4 Phân hệ (4-in-1 App Switcher)
  let currentMode: OfficeMode = 'sheets';
  const containerSheet = document.getElementById('sheet-container');
  const containerPdf = document.getElementById('container-pdf');
  const docTitle = document.getElementById('doc-title');
  const statusModeText = document.getElementById('status-mode-text');

  const tabs: Record<OfficeMode, HTMLElement | null> = {
    sheets: document.getElementById('tab-sheets'),
    docs: document.getElementById('tab-docs'),
    slides: document.getElementById('tab-slides'),
    pdf: document.getElementById('tab-pdf'),
  };

  function switchOfficeMode(mode: OfficeMode) {
    currentMode = mode;
    Object.values(tabs).forEach((btn) => btn?.classList.remove('active'));
    tabs[mode]?.classList.add('active');

    if (mode === 'pdf') {
      containerSheet?.classList.add('hidden');
      containerPdf?.classList.remove('hidden');
      if (docTitle) docTitle.textContent = 'Trình ký & Chỉnh sửa PDF';
      if (statusModeText) statusModeText.textContent = 'Phân hệ: Ký & Sửa PDF';
    } else {
      containerPdf?.classList.add('hidden');
      containerSheet?.classList.remove('hidden');

      if (mode === 'sheets') {
        instanceService.focusUnit(currentSheetUnit.getUnitId());
        if (docTitle) docTitle.textContent = 'BKIT Sheets - Bảng tính';
        if (statusModeText) statusModeText.textContent = 'Phân hệ: Bảng tính thông minh';
      } else if (mode === 'docs') {
        instanceService.focusUnit(docUnit.getUnitId());
        if (docTitle) docTitle.textContent = 'BKIT Docs - Văn bản';
        if (statusModeText) statusModeText.textContent = 'Phân hệ: Soạn thảo văn bản';
      } else if (mode === 'slides') {
        instanceService.focusUnit(slideUnit.getUnitId());
        if (docTitle) docTitle.textContent = 'BKIT Slides - Trình chiếu';
        if (statusModeText) statusModeText.textContent = 'Phân hệ: Trình chiếu thuyết trình';
      }
    }
  }

  tabs.sheets?.addEventListener('click', () => switchOfficeMode('sheets'));
  tabs.docs?.addEventListener('click', () => switchOfficeMode('docs'));
  tabs.slides?.addEventListener('click', () => switchOfficeMode('slides'));
  tabs.pdf?.addEventListener('click', () => switchOfficeMode('pdf'));

  // Mặc định mở Bảng tính
  switchOfficeMode('sheets');

  // 5. Thư viện Biểu mẫu Doanh nghiệp (Templates)
  setupTemplatesModal((mode, dataKey) => {
    if (dataKey === 'salary') {
      const salaryUnit = univer.createUnit(UniverInstanceType.UNIVER_SHEET, TEMPLATE_SALARY_SHEET_DATA);
      currentSheetUnit = salaryUnit;
      instanceService.focusUnit(salaryUnit.getUnitId());
      if (docTitle) docTitle.textContent = 'Bảng Lương Doanh Nghiệp';
      switchOfficeMode('sheets');
    } else if (dataKey === 'invoice') {
      const invoiceUnit = univer.createUnit(UniverInstanceType.UNIVER_SHEET, TEMPLATE_INVOICE_SHEET_DATA);
      currentSheetUnit = invoiceUnit;
      instanceService.focusUnit(invoiceUnit.getUnitId());
      if (docTitle) docTitle.textContent = 'Bảng Báo Giá Dịch Vụ';
      switchOfficeMode('sheets');
    } else if (dataKey === 'cashbook') {
      const cashUnit = univer.createUnit(UniverInstanceType.UNIVER_SHEET, TEMPLATE_CASHBOOK_SHEET_DATA);
      currentSheetUnit = cashUnit;
      instanceService.focusUnit(cashUnit.getUnitId());
      if (docTitle) docTitle.textContent = 'Sổ Quỹ Tiền Mặt';
      switchOfficeMode('sheets');
    } else if (dataKey === 'approval') {
      switchOfficeMode('pdf');
      pdfManager.createNewBlankPdf();
    } else {
      switchOfficeMode(mode);
    }
  });

  // 6. Tiện ích Tiếng Việt (Vietnamese Business Utilities)
  setupVietnameseTools();

  // 7. Bảng Tra cứu Phím tắt (Shortcuts Cheatsheet)
  setupShortcutsModal();

  // 8. Chế độ Tối / Sáng (Dark Mode Toggle)
  const btnTheme = document.getElementById('btn-theme-toggle');
  btnTheme?.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
  });

  // 9. Zoom Controls (Thanh trạng thái)
  setupZoomControls();

  console.log('[BKIT Office] Hệ sinh thái văn phòng 4-trong-1 đã sẵn sàng!');
}

function setupTemplatesModal(onSelectTemplate: (mode: OfficeMode, dataKey?: string) => void): void {
  const btnOpen = document.getElementById('btn-open-templates');
  const btnActionTemplates = document.getElementById('action-templates');
  const modal = document.getElementById('modal-templates');
  const btnClose = document.getElementById('btn-close-templates');
  const grid = document.getElementById('templates-grid');

  const openModal = () => modal?.classList.remove('hidden');
  const closeModal = () => modal?.classList.add('hidden');

  btnOpen?.addEventListener('click', openModal);
  btnActionTemplates?.addEventListener('click', openModal);
  btnClose?.addEventListener('click', closeModal);

  if (grid) {
    grid.innerHTML = TEMPLATES_CATALOG.map(
      (t) => `
      <div class="template-item" data-category="${t.category}" data-key="${t.dataKey || ''}">
        <span class="template-icon">${t.icon}</span>
        <div class="template-title">${t.title}</div>
        <div class="template-desc">${t.description}</div>
      </div>
    `
    ).join('');

    grid.querySelectorAll('.template-item').forEach((item) => {
      item.addEventListener('click', () => {
        const cat = item.getAttribute('data-category') as OfficeMode;
        const key = item.getAttribute('data-key') || undefined;
        if (cat) {
          onSelectTemplate(cat, key);
          closeModal();
        }
      });
    });
  }
}

function setupVietnameseTools(): void {
  const btnOpen = document.getElementById('btn-vi-tools');
  const modal = document.getElementById('modal-vi-tools');
  const btnClose = document.getElementById('btn-close-vi-tools');

  btnOpen?.addEventListener('click', () => modal?.classList.remove('hidden'));
  btnClose?.addEventListener('click', () => modal?.classList.add('hidden'));

  // Tool 1: Đọc số thành chữ
  const inputNum = document.getElementById('input-vi-number') as HTMLInputElement | null;
  const btnConvert = document.getElementById('btn-convert-number');
  const resultWords = document.getElementById('result-vi-words');
  const btnCopy = document.getElementById('btn-copy-words');

  const handleConvert = () => {
    const val = inputNum?.value || '';
    if (!val) {
      if (resultWords) resultWords.textContent = 'Vui lòng nhập số cần đọc.';
      return;
    }
    const words = numberToVietnameseWords(val);
    if (resultWords) resultWords.textContent = words;
  };

  btnConvert?.addEventListener('click', handleConvert);
  inputNum?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleConvert();
  });

  btnCopy?.addEventListener('click', () => {
    const text = resultWords?.textContent;
    if (text && text !== 'Chưa có dữ liệu') {
      navigator.clipboard.writeText(text);
      alert('Đã sao chép kết quả vào bộ nhớ đệm!');
    }
  });

  // Tool 2: Chuyển đổi kiểu chữ
  const inputTxt = document.getElementById('input-vi-text') as HTMLTextAreaElement | null;
  document.getElementById('btn-case-upper')?.addEventListener('click', () => {
    if (inputTxt) inputTxt.value = changeTextCase(inputTxt.value, 'upper');
  });
  document.getElementById('btn-case-lower')?.addEventListener('click', () => {
    if (inputTxt) inputTxt.value = changeTextCase(inputTxt.value, 'lower');
  });
  document.getElementById('btn-case-title')?.addEventListener('click', () => {
    if (inputTxt) inputTxt.value = changeTextCase(inputTxt.value, 'title');
  });
  document.getElementById('btn-case-noaccent')?.addEventListener('click', () => {
    if (inputTxt) inputTxt.value = removeVietnameseAccents(inputTxt.value);
  });
  document.getElementById('btn-case-tcvn3')?.addEventListener('click', () => {
    if (inputTxt) inputTxt.value = convertTCVN3ToUnicode(inputTxt.value);
  });
}

function setupShortcutsModal(): void {
  const btnOpen = document.getElementById('btn-shortcuts');
  const modal = document.getElementById('modal-shortcuts');
  const btnClose = document.getElementById('btn-close-shortcuts');

  const openModal = () => modal?.classList.remove('hidden');
  const closeModal = () => modal?.classList.add('hidden');

  btnOpen?.addEventListener('click', openModal);
  btnClose?.addEventListener('click', closeModal);

  // Nhấn F1 để mở bảng trợ giúp phím tắt
  window.addEventListener('keydown', (e) => {
    if (e.key === 'F1') {
      e.preventDefault();
      openModal();
    }
  });
}

function setupZoomControls(): void {
  let zoomLevel = 100;
  const zoomVal = document.getElementById('zoom-val');
  const sheetContainer = document.getElementById('sheet-container');

  const updateZoom = () => {
    if (zoomVal) zoomVal.textContent = `${zoomLevel}%`;
    if (sheetContainer) {
      sheetContainer.style.transformOrigin = '0 0';
      sheetContainer.style.transform = zoomLevel === 100 ? 'none' : `scale(${zoomLevel / 100})`;
    }
  };

  document.getElementById('btn-zoom-in')?.addEventListener('click', () => {
    if (zoomLevel < 200) {
      zoomLevel += 10;
      updateZoom();
    }
  });

  document.getElementById('btn-zoom-out')?.addEventListener('click', () => {
    if (zoomLevel > 50) {
      zoomLevel -= 10;
      updateZoom();
    }
  });

  document.getElementById('btn-zoom-reset')?.addEventListener('click', () => {
    zoomLevel = 100;
    updateZoom();
  });
}

window.addEventListener('DOMContentLoaded', bootstrap);
