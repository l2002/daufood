import { EvidenceBlock } from '../types';

export const EVIDENCE_LIST: EvidenceBlock[] = [
  {
    id: 'hinh-1',
    title: 'Hình 1',
    description: 'Bằng chứng xin nghỉ với lý do hợp lý, không bỏ việc, nghỉ ngang không thông báo',
    images: [
      {
        filename: 'hình 1.jpg',
        src: '/images/hinh-1.jpg',
        alt: 'Hình 1: Bằng chứng xin nghỉ việc với lý do hợp lý qua tin nhắn Zalo',
      },
    ],
  },
  {
    id: 'hinh-2',
    title: 'Hình 2',
    description:
      'Sau khi yêu cầu thanh toán lương cho những ngày đã làm việc, phía nhân sự không giải quyết mà liên tục bơ tin nhắn, đùn đẩy trách nhiệm, sau đó kick tôi khỏi group chat để tránh đối diện. Đây là hành vi né tránh nghĩa vụ trả lương.',
    images: [
      {
        filename: 'hình 2.jpg',
        src: '/images/hinh-2.jpg',
        alt: 'Hình 2: Nhân sự đùn đẩy trách nhiệm, né tránh trả lương và kick khỏi nhóm chat',
      },
    ],
  },
  {
    id: 'hinh-3',
    title: 'Hình 3',
    description:
      'Tin nhắn chị Lan Anh cố đánh đồng việc quên check-out (lỗi thủ tục của người lao động) với việc công ty không trả lương cho ngày đã làm (nghĩa vụ bắt buộc của người sử dụng lao động). Hai việc này hoàn toàn khác nhau. Liên tục đổ lỗi, lấy lý do rằng tôi nghỉ ngang nên trốn tránh việc thanh toán lương.',
    images: [
      {
        filename: 'hình 3.jpg',
        src: '/images/hinh-3.jpg',
        alt: 'Hình 3: Tin nhắn đánh đồng lỗi check-out với việc không trả lương',
      },
    ],
  },
  {
    id: 'hinh-4',
    title: 'Hình 4',
    description: 'Đoạn tin nhắn yêu cầu thanh toán lương, không hề có lời lẽ đe dọa',
    images: [
      {
        filename: 'hình 4.jpg',
        src: '/images/hinh-4.jpg',
        alt: 'Hình 4: Tin nhắn yêu cầu thanh toán tiền lương đúng quy định pháp luật',
      },
    ],
  },
  {
    id: 'hinh-5-6',
    title: 'Hình 5-6',
    description: 'Phía công ty bảo sẽ cho tôi vào blacklist của các doanh nghiệp',
    images: [
      {
        filename: 'hình 5.jpg',
        src: '/images/hinh-5.jpg',
        alt: 'Hình 5: Phía công ty đe dọa đưa tên người lao động vào blacklist của các doanh nghiệp',
        label: 'Hình 5',
      },
      {
        filename: 'hình 6.jpg',
        src: '/images/hinh-6.jpg',
        alt: 'Hình 6: Chi tiết tin nhắn đe dọa đưa vào blacklist và phản hồi từ người lao động',
        label: 'Hình 6',
      },
    ],
  },
];
