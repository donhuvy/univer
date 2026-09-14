export interface TemplateItem {
  id: string;
  category: 'sheets' | 'docs' | 'slides' | 'pdf';
  title: string;
  description: string;
  icon: string;
  dataKey?: string;
}

export const TEMPLATES_CATALOG: TemplateItem[] = [
  {
    id: 'sheet_salary',
    category: 'sheets',
    title: 'Bảng Lương & Trích Nộp BHXH',
    description: 'Mẫu bảng lương chuẩn doanh nghiệp Việt Nam: Lương cơ bản, phụ cấp, trích BHXH/YT/TN (10.5%), thuế TNCN và thực lĩnh net.',
    icon: '💰',
    dataKey: 'salary',
  },
  {
    id: 'sheet_invoice',
    category: 'sheets',
    title: 'Bảng Báo Giá & Hóa Đơn Bán Hàng',
    description: 'Biểu mẫu báo giá chuyên nghiệp với công thức tính thuế GTGT (VAT 10%), chiết khấu và tự động đọc tiền thành chữ.',
    icon: '🧾',
    dataKey: 'invoice',
  },
  {
    id: 'sheet_cashbook',
    category: 'sheets',
    title: 'Sổ Quỹ Tiền Mặt & Thu Chi',
    description: 'Bảng theo dõi thu chi quỹ tiền mặt nội bộ theo ngày, phân loại số chứng từ, tính lũy kế tồn quỹ tự động.',
    icon: '📊',
    dataKey: 'cashbook',
  },
  {
    id: 'doc_contract',
    category: 'docs',
    title: 'Hợp Đồng Kinh Tế Dịch Vụ',
    description: 'Mẫu hợp đồng cung cấp dịch vụ & phần mềm với đầy đủ điều khoản pháp lý, thanh toán, bảo hành và chữ ký hai bên.',
    icon: '📜',
    dataKey: 'contract',
  },
  {
    id: 'doc_handover',
    category: 'docs',
    title: 'Biên Bản Bàn Giao Thiết Bị',
    description: 'Biên bản nghiệm thu và bàn giao tài sản, phần cứng, bàn giao tài khoản quản trị hệ thống.',
    icon: '📋',
    dataKey: 'handover',
  },
  {
    id: 'slide_pitch',
    category: 'slides',
    title: 'Slide Thuyết Trình Doanh Nghiệp',
    description: 'Bản trình chiếu thuyết trình công ty, giới thiệu năng lực sản phẩm BKIT Office và lộ trình phát triển.',
    icon: '📽️',
    dataKey: 'pitch',
  },
  {
    id: 'pdf_approval',
    category: 'pdf',
    title: 'Mẫu Đơn Trình Ký Duyệt & Ký Số',
    description: 'Mẫu biểu văn bản hành chính dùng để xem xét phê duyệt, ký chữ ký điện tử và đóng dấu mộc đỏ công ty.',
    icon: '📑',
    dataKey: 'approval',
  },
];
