import './globals.css';

export const metadata = {
  title: 'Secret Garden — 우리의 하루가 꽃이 됩니다.',
  description: '오늘의 마음을 한 송이 꽃으로 남기는 비밀의 정원',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
