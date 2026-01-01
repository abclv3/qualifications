import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "전기기사 필기 시험 - 치트키 학습 시스템",
    description: "전기기사 시험 대비 스마트 학습 플랫폼. 문제 풀이와 함께 핵심 치트키를 제공합니다.",
    keywords: ["전기기사", "필기시험", "회로이론", "전기자기학", "전기기기", "전력공학", "자격증"],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                {/* Pretendard 폰트 - 한국어 최적화 프리미엄 폰트 */}
                <link rel="stylesheet" as="style" crossOrigin="anonymous" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css" />
                <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
            </head>
            <body className="antialiased">
                {children}
            </body>
        </html>
    );
}
