import { BooleanNumber, type IDocumentData } from '@univerjs/core';
import { DEFAULT_SLIDE, type ISlideData } from '@univerjs/slides';

export const DEFAULT_BKIT_SHEET_DATA = {
  id: 'bkit-sheet-workbook',
  name: 'BKIT Sheets - Bảng tính mới',
  appVersion: '1.0.0',
  sheets: {
    sheet1: {
      id: 'sheet1',
      name: 'Trang tính 1',
      rowCount: 100,
      columnCount: 26,
      cellData: {
        0: {
          0: { v: 'BKIT Office' },
          1: { v: 'Bộ Giải Pháp Văn Phòng Toàn Diện 4-trong-1' },
        },
        1: {
          0: { v: 'Phân hệ:' },
          1: { v: 'Bảng tính (Sheets) • Văn bản (Docs) • Trình chiếu (Slides) • Ký & Sửa PDF' },
        },
        2: {
          0: { v: 'Thương hiệu:' },
          1: { v: 'BKIT.VN' },
        },
      },
    },
  },
};

/** Mẫu Bảng lương doanh nghiệp & Trích nộp BHXH */
export const TEMPLATE_SALARY_SHEET_DATA = {
  id: 'bkit-sheet-salary',
  name: 'Bảng Lương Doanh Nghiệp',
  appVersion: '1.0.0',
  sheets: {
    sheet1: {
      id: 'sheet1',
      name: 'Bảng Lương Tháng',
      rowCount: 100,
      columnCount: 26,
      cellData: {
        0: { 2: { v: 'BẢNG THANH TOÁN TIỀN LƯƠNG VÀ CÁC KHOẢN TRÍCH THEO LƯƠNG' } },
        1: { 2: { v: 'Đơn vị: BKIT.VN - Tháng 09/2026' } },
        3: {
          0: { v: 'STT' },
          1: { v: 'Mã NV' },
          2: { v: 'Họ và tên' },
          3: { v: 'Chức danh' },
          4: { v: 'Lương cơ bản' },
          5: { v: 'Ngày công' },
          6: { v: 'Lương thực tế' },
          7: { v: 'Phụ cấp' },
          8: { v: 'BHXH/YT/TN (10.5%)' },
          9: { v: 'Thuế TNCN' },
          10: { v: 'Thực lĩnh (Net)' },
        },
        4: {
          0: { v: 1 },
          1: { v: 'BK001' },
          2: { v: 'Nguyễn Văn An' },
          3: { v: 'Giám đốc công nghệ' },
          4: { v: 35000000 },
          5: { v: 22 },
          6: { v: 35000000 },
          7: { v: 3000000 },
          8: { v: 3675000 },
          9: { v: 2150000 },
          10: { v: 32175000 },
        },
        5: {
          0: { v: 2 },
          1: { v: 'BK002' },
          2: { v: 'Trần Thị Mai' },
          3: { v: 'Kế toán trưởng' },
          4: { v: 22000000 },
          5: { v: 22 },
          6: { v: 22000000 },
          7: { v: 2000000 },
          8: { v: 2310000 },
          9: { v: 850000 },
          10: { v: 20840000 },
        },
        6: {
          0: { v: 3 },
          1: { v: 'BK003' },
          2: { v: 'Lê Hoàng Nam' },
          3: { v: 'Kỹ sư phần mềm' },
          4: { v: 25000000 },
          5: { v: 21 },
          6: { v: 23863636 },
          7: { v: 1500000 },
          8: { v: 2505681 },
          9: { v: 1120000 },
          10: { v: 21737955 },
        },
        7: {
          0: { v: 4 },
          1: { v: 'BK004' },
          2: { v: 'Phạm Thu Trang' },
          3: { v: 'Chuyên viên Marketing' },
          4: { v: 18000000 },
          5: { v: 22 },
          6: { v: 18000000 },
          7: { v: 1200000 },
          8: { v: 1890000 },
          9: { v: 420000 },
          10: { v: 16890000 },
        },
        8: {
          2: { v: 'TỔNG CỘNG' },
          4: { v: 100000000 },
          6: { v: 98863636 },
          7: { v: 7700000 },
          8: { v: 10380681 },
          9: { v: 4540000 },
          10: { v: 91642955 },
        },
      },
    },
  },
};

/** Mẫu Báo giá & Hóa đơn bán hàng */
export const TEMPLATE_INVOICE_SHEET_DATA = {
  id: 'bkit-sheet-invoice',
  name: 'Bảng Báo Giá Dịch Vụ',
  appVersion: '1.0.0',
  sheets: {
    sheet1: {
      id: 'sheet1',
      name: 'Báo Giá',
      rowCount: 100,
      columnCount: 26,
      cellData: {
        0: { 0: { v: 'CÔNG TY TNHH PHẦN MỀM BKIT.VN' }, 5: { v: 'MẪU SỐ: BG-2026/BKIT' } },
        1: { 0: { v: 'Website: https://bkit.vn | Hotline: 1900-BKIT' } },
        3: { 2: { v: 'BẢNG BÁO GIÁ PHẦN MỀM & DỊCH VỤ CÔNG NGHỆ' } },
        4: { 0: { v: 'Kính gửi: Quý Khách hàng / Quý Doanh nghiệp' } },
        5: { 0: { v: 'Ngày báo giá: 14/09/2026 | Hiệu lực: 30 ngày' } },
        7: {
          0: { v: 'STT' },
          1: { v: 'Tên sản phẩm / Dịch vụ' },
          2: { v: 'ĐVT' },
          3: { v: 'Số lượng' },
          4: { v: 'Đơn giá (VNĐ)' },
          5: { v: 'Thành tiền (VNĐ)' },
        },
        8: {
          0: { v: 1 },
          1: { v: 'Bản quyền BKIT Office Pro v1.0 (Vĩnh viễn)' },
          2: { v: 'Máy' },
          3: { v: 10 },
          4: { v: 950000 },
          5: { v: 9500000 },
        },
        9: {
          0: { v: 2 },
          1: { v: 'Gói cài đặt & Đào tạo hướng dẫn sử dụng' },
          2: { v: 'Gói' },
          3: { v: 1 },
          4: { v: 2000000 },
          5: { v: 2000000 },
        },
        10: {
          0: { v: 3 },
          1: { v: 'Bảo trì & Cập nhật tính năng 12 tháng' },
          2: { v: 'Năm' },
          3: { v: 1 },
          4: { v: 1500000 },
          5: { v: 1500000 },
        },
        12: {
          1: { v: 'Cộng tiền hàng:' },
          5: { v: 13000000 },
        },
        13: {
          1: { v: 'Thuế GTGT (VAT 10%):' },
          5: { v: 1300000 },
        },
        14: {
          1: { v: 'TỔNG CỘNG THANH TOÁN:' },
          5: { v: 14300000 },
        },
        15: {
          1: { v: 'Số tiền viết bằng chữ:' },
          2: { v: 'Mười bốn triệu ba trăm nghìn đồng chẵn' },
        },
      },
    },
  },
};

/** Mẫu Sổ quỹ thu chi nội bộ */
export const TEMPLATE_CASHBOOK_SHEET_DATA = {
  id: 'bkit-sheet-cashbook',
  name: 'Sổ Quỹ Tiền Mặt',
  appVersion: '1.0.0',
  sheets: {
    sheet1: {
      id: 'sheet1',
      name: 'Thu Chi Quỹ',
      rowCount: 100,
      columnCount: 26,
      cellData: {
        0: { 2: { v: 'SỔ QUỸ TIỀN MẶT & THEO DÕI THU CHI NỘI BỘ' } },
        1: { 2: { v: 'Đơn vị: BKIT.VN - Niên độ 2026' } },
        3: {
          0: { v: 'Ngày' },
          1: { v: 'Số CT' },
          2: { v: 'Diễn giải nội dung thu chi' },
          3: { v: 'Thu (VNĐ)' },
          4: { v: 'Chi (VNĐ)' },
          5: { v: 'Tồn quỹ (VNĐ)' },
        },
        4: {
          0: { v: '01/09/2026' },
          1: { v: 'DK001' },
          2: { v: 'Số dư tiền mặt đầu kỳ chuyển sang' },
          3: { v: 50000000 },
          4: { v: 0 },
          5: { v: 50000000 },
        },
        5: {
          0: { v: '05/09/2026' },
          1: { v: 'PT012' },
          2: { v: 'Thu tiền bán phần mềm bản quyền BKIT Office' },
          3: { v: 28500000 },
          4: { v: 0 },
          5: { v: 78500000 },
        },
        6: {
          0: { v: '08/09/2026' },
          1: { v: 'PC009' },
          2: { v: 'Chi trả tiền thuê văn phòng và internet tháng 9' },
          3: { v: 0 },
          4: { v: 15000000 },
          5: { v: 63500000 },
        },
        7: {
          0: { v: '12/09/2026' },
          1: { v: 'PC010' },
          2: { v: 'Mua sắm văn phòng phẩm và thiết bị tin học' },
          3: { v: 0 },
          4: { v: 4200000 },
          5: { v: 59300000 },
        },
      },
    },
  },
};

export const DEFAULT_BKIT_DOC_DATA: IDocumentData = {
  id: 'bkit-doc-01',
  title: 'BKIT Docs - Soạn thảo văn bản',
  body: {
    dataStream: 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\r\nĐộc lập - Tự do - Hạnh phúc\r\n\r\nBẢN GHI NHẬN CÔNG VIỆC VĂN PHÒNG\r\nKính gửi: Ban Giám Đốc & Khách Hàng BKIT.VN\r\nPhần mềm BKIT Office cung cấp giải pháp soạn thảo văn bản, lập bảng tính số liệu, thiết kế slide thuyết trình và xử lý hồ sơ PDF trên một nền tảng duy nhất.\r\n',
    textRuns: [
      {
        st: 0,
        ed: 35,
        ts: {
          bl: BooleanNumber.TRUE,
          fs: 14,
        },
      },
      {
        st: 37,
        ed: 63,
        ts: {
          bl: BooleanNumber.TRUE,
          fs: 13,
        },
      },
      {
        st: 66,
        ed: 98,
        ts: {
          bl: BooleanNumber.TRUE,
          fs: 16,
          cl: { rgb: '#ff0000' },
        },
      },
    ],
    paragraphs: [
      { startIndex: 35 },
      { startIndex: 63 },
      { startIndex: 64 },
      { startIndex: 98 },
      { startIndex: 140 },
      { startIndex: 310 },
    ],
  },
  documentStyle: {
    pageSize: {
      width: 595.28,
      height: 841.89,
    },
    marginTop: 54,
    marginBottom: 54,
    marginRight: 54,
    marginLeft: 54,
  },
};

export const DEFAULT_BKIT_SLIDE_DATA: ISlideData = {
  ...DEFAULT_SLIDE,
  id: 'bkit-slide-01',
  title: 'BKIT Slides - Thuyết trình kinh doanh',
};
