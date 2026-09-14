import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';

export class PDFEditorManager {
  private currentPdfBytes: Uint8Array | null = null;
  private currentPdfDoc: PDFDocument | null = null;
  private signatureDataUrl: string | null = null;

  init(): void {
    this.bindEvents();
  }

  private bindEvents(): void {
    const inputPdf = document.getElementById('input-pdf-file') as HTMLInputElement | null;
    const inputSigImage = document.getElementById('input-sig-image') as HTMLInputElement | null;
    const btnOpenPdf = document.getElementById('btn-open-pdf');
    const btnSign = document.getElementById('btn-pdf-sign');
    const btnStamp = document.getElementById('btn-pdf-stamp');
    const btnTextAnnot = document.getElementById('btn-pdf-text');
    const btnRotatePdf = document.getElementById('btn-pdf-rotate');
    const btnExportPdf = document.getElementById('btn-export-pdf');
    const btnNewBlankPdf = document.getElementById('btn-new-blank-pdf');
    const btnUploadSig = document.getElementById('btn-upload-sig-img');

    btnOpenPdf?.addEventListener('click', () => inputPdf?.click());
    inputPdf?.addEventListener('change', (e) => this.handleFileSelect(e));

    btnUploadSig?.addEventListener('click', () => inputSigImage?.click());
    inputSigImage?.addEventListener('change', (e) => this.handleSignatureImageUpload(e));

    btnNewBlankPdf?.addEventListener('click', () => this.createNewBlankPdf());
    btnSign?.addEventListener('click', () => this.openSignatureModal());
    btnStamp?.addEventListener('click', () => this.openStampPicker());
    btnTextAnnot?.addEventListener('click', () => this.promptTextAnnotation());
    btnRotatePdf?.addEventListener('click', () => this.rotateCurrentPage());
    btnExportPdf?.addEventListener('click', () => this.exportPdf());

    this.setupSignaturePad();
  }

  async createNewBlankPdf(): Promise<void> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontNorm = await pdfDoc.embedFont(StandardFonts.Helvetica);

    page.drawText('CONG HOA XA HOI CHU NGHIA VIET NAM', {
      x: 170,
      y: 800,
      size: 13,
      font: fontBold,
      color: rgb(0, 0, 0),
    });
    page.drawText('Doc lap - Tu do - Hanh phuc', {
      x: 220,
      y: 782,
      size: 11,
      font: fontNorm,
      color: rgb(0, 0, 0),
    });
    page.drawLine({
      start: { x: 230, y: 775 },
      end: { x: 365, y: 775 },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    page.drawText('BKIT Office - Van Ban & Ho So Dien Tu', {
      x: 180,
      y: 730,
      size: 15,
      font: fontBold,
      color: rgb(0.9, 0.1, 0.1),
    });
    page.drawText(`Ngay khoi tao: ${new Date().toLocaleDateString('vi-VN')} | He thong BKIT.VN`, {
      x: 50,
      y: 690,
      size: 10,
      font: fontNorm,
      color: rgb(0.4, 0.4, 0.4),
    });

    const pdfBytes = await pdfDoc.save();
    this.loadPdfBytes(pdfBytes, 'tai-lieu-moi.pdf');
  }

  private async handleFileSelect(event: Event): Promise<void> {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      await this.loadPdfBytes(bytes, file.name);
    } catch (err) {
      alert('Không thể đọc tệp PDF: ' + err);
    }
  }

  private async handleSignatureImageUpload(event: Event): Promise<void> {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      if (dataUrl) {
        this.signatureDataUrl = dataUrl;
        await this.applySignatureToPdf();
      }
    };
    reader.readAsDataURL(file);
  }

  async loadPdfBytes(bytes: Uint8Array, fileName: string): Promise<void> {
    try {
      this.currentPdfBytes = bytes;
      this.currentPdfDoc = await PDFDocument.load(bytes);

      const docTitle = document.getElementById('doc-title');
      if (docTitle) docTitle.textContent = fileName;

      const pageCount = this.currentPdfDoc.getPageCount();
      const infoText = document.getElementById('pdf-info-text');
      if (infoText) infoText.textContent = `Tệp: ${fileName} | ${pageCount} trang`;

      // Render PDF preview via Blob URL
      const blob = new Blob([bytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const frame = document.getElementById('pdf-preview-frame') as HTMLIFrameElement | null;
      if (frame) {
        frame.src = url;
      }

      const emptyView = document.getElementById('pdf-empty-view');
      const activeView = document.getElementById('pdf-active-view');
      emptyView?.classList.add('hidden');
      activeView?.classList.remove('hidden');
    } catch (err) {
      alert('Lỗi nạp PDF: ' + err);
    }
  }

  private setupSignaturePad(): void {
    const canvas = document.getElementById('canvas-signature') as HTMLCanvasElement | null;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isDrawing = false;
    ctx.lineWidth = 2.8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#002b80'; // Xanh mực bút ký chuẩn

    const getPos = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    canvas.addEventListener('mousedown', (e) => {
      isDrawing = true;
      const pos = getPos(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    });

    canvas.addEventListener('mousemove', (e) => {
      if (!isDrawing) return;
      const pos = getPos(e);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    });

    window.addEventListener('mouseup', () => {
      isDrawing = false;
    });

    document.getElementById('btn-clear-sig')?.addEventListener('click', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    document.getElementById('btn-save-sig')?.addEventListener('click', () => {
      this.signatureDataUrl = canvas.toDataURL('image/png');
      this.hideSignatureModal();
      this.applySignatureToPdf();
    });

    document.getElementById('btn-close-sig')?.addEventListener('click', () => {
      this.hideSignatureModal();
    });
  }

  private openSignatureModal(): void {
    if (!this.currentPdfDoc) {
      alert('Vui lòng mở một tệp PDF trước khi chèn chữ ký.');
      return;
    }
    const modal = document.getElementById('modal-signature');
    modal?.classList.remove('hidden');
  }

  private hideSignatureModal(): void {
    const modal = document.getElementById('modal-signature');
    modal?.classList.add('hidden');
  }

  private async applySignatureToPdf(): Promise<void> {
    if (!this.currentPdfDoc || !this.signatureDataUrl) return;

    try {
      const isPng = this.signatureDataUrl.includes('image/png');
      let imageObj;
      if (isPng) {
        imageObj = await this.currentPdfDoc.embedPng(this.signatureDataUrl);
      } else {
        imageObj = await this.currentPdfDoc.embedJpg(this.signatureDataUrl);
      }

      const pages = this.currentPdfDoc.getPages();
      const lastPage = pages[pages.length - 1]; // Ký vào trang cuối

      const { width } = lastPage.getSize();
      lastPage.drawImage(imageObj, {
        x: width - 210,
        y: 80,
        width: 150,
        height: 65,
      });

      const updatedBytes = await this.currentPdfDoc.save();
      await this.loadPdfBytes(updatedBytes, 'tai-lieu-da-ky.pdf');
      alert('Đã chèn chữ ký điện tử vào góc dưới trang tài liệu thành công!');
    } catch (err) {
      alert('Không thể chèn chữ ký: ' + err);
    }
  }

  openStampPicker(): void {
    if (!this.currentPdfDoc) {
      alert('Vui lòng mở một tệp PDF trước khi đóng dấu.');
      return;
    }

    const stampOptions = ['ĐÃ DUYỆT', 'ĐÃ THU TIỀN', 'MẬT - CONFIDENTIAL', 'BẢN SAO CHÍNH THỨC'];
    const choice = prompt(
      'Chọn loại con dấu cần đóng:\n1: ĐÃ DUYỆT\n2: ĐÃ THU TIỀN\n3: MẬT - CONFIDENTIAL\n4: BẢN SAO CHÍNH THỨC\n(Nhập số 1-4 hoặc gõ nội dung dấu tùy ý):',
      '1'
    );

    if (!choice) return;
    let selectedStamp = choice;
    if (choice === '1') selectedStamp = stampOptions[0];
    else if (choice === '2') selectedStamp = stampOptions[1];
    else if (choice === '3') selectedStamp = stampOptions[2];
    else if (choice === '4') selectedStamp = stampOptions[3];

    this.applyStamp(selectedStamp);
  }

  async applyStamp(stampText: string): Promise<void> {
    if (!this.currentPdfDoc) return;

    try {
      const pages = this.currentPdfDoc.getPages();
      const firstPage = pages[0];
      const { width, height } = firstPage.getSize();
      const font = await this.currentPdfDoc.embedFont(StandardFonts.HelveticaBold);

      const stampWidth = 180;
      const stampHeight = 44;
      const x = width - 220;
      const y = height - 110;

      firstPage.drawRectangle({
        x,
        y,
        width: stampWidth,
        height: stampHeight,
        borderColor: rgb(0.9, 0.1, 0.1),
        borderWidth: 2.5,
        rotate: degrees(-12),
      });

      firstPage.drawText(stampText + ' • BKIT', {
        x: x + 10,
        y: y + 14,
        size: 11,
        font,
        color: rgb(0.9, 0.1, 0.1),
        rotate: degrees(-12),
      });

      const updatedBytes = await this.currentPdfDoc.save();
      await this.loadPdfBytes(updatedBytes, 'tai-lieu-da-dong-dau.pdf');
      alert(`Đã đóng dấu mộc "${stampText}" lên trang tài liệu thành công!`);
    } catch (err) {
      alert('Không thể đóng dấu: ' + err);
    }
  }

  async promptTextAnnotation(): Promise<void> {
    if (!this.currentPdfDoc) {
      alert('Vui lòng mở một tệp PDF trước khi thêm ghi chú.');
      return;
    }

    const note = prompt('Nhập nội dung văn bản / ghi chú cần chèn vào PDF:');
    if (!note) return;

    try {
      const pages = this.currentPdfDoc.getPages();
      const firstPage = pages[0];
      const font = await this.currentPdfDoc.embedFont(StandardFonts.Helvetica);

      firstPage.drawText(note, {
        x: 50,
        y: 120,
        size: 12,
        font,
        color: rgb(0.1, 0.2, 0.8),
      });

      const updatedBytes = await this.currentPdfDoc.save();
      await this.loadPdfBytes(updatedBytes, 'tai-lieu-them-ghi-chu.pdf');
      alert('Đã chèn ghi chú vào trang PDF thành công!');
    } catch (err) {
      alert('Lỗi chèn ghi chú: ' + err);
    }
  }

  async rotateCurrentPage(): Promise<void> {
    if (!this.currentPdfDoc) {
      alert('Vui lòng mở một tệp PDF trước khi xoay.');
      return;
    }

    try {
      const pages = this.currentPdfDoc.getPages();
      const firstPage = pages[0];
      const currentRotation = firstPage.getRotation().angle;
      firstPage.setRotation(degrees((currentRotation + 90) % 360));

      const updatedBytes = await this.currentPdfDoc.save();
      await this.loadPdfBytes(updatedBytes, 'tai-lieu-xoay.pdf');
      alert('Đã xoay trang PDF 90 độ!');
    } catch (err) {
      alert('Lỗi xoay trang: ' + err);
    }
  }

  async exportPdf(): Promise<void> {
    if (!this.currentPdfDoc) {
      alert('Không có tệp PDF nào đang mở để xuất.');
      return;
    }

    try {
      const bytes = await this.currentPdfDoc.save();
      const blob = new Blob([bytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `BKIT-Export-${Date.now()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Lỗi xuất tệp PDF: ' + err);
    }
  }
}
