// AdSense 정책: 에러/404 페이지에 광고 컴포넌트 import 금지
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-4 text-gray-600">페이지를 찾을 수 없어요</p>
      <a href="/" className="mt-8 text-blue-500 underline">
        홈으로 돌아가기
      </a>
    </div>
  );
}
