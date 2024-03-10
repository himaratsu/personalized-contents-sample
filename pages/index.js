import { Inter } from "next/font/google";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  // fetchを使って /fetch にリクエスト
  const [data, setData] = useState(null);
  const [mode, setMode] = useState("original");
  const [loading, setLoading] = useState(false);

  const request = async (mode) => {
    console.log("-------------------");
    console.log(mode);
    setMode(mode);
    setLoading(true);
    const res = await fetch(`/api/fetch?mode=${mode}`);
    const data = await res.json();
    setData(data);
    setLoading(false);
  };

  useEffect(() => {
    request("original");
  }, []);

  // データが取得できたら表示
  if (data) {
    return (
      <main className="container mx-auto bg-white p-32">
        <div className="flex *:px-4 first:*:pl-0 last:*:pr-0 divide-x text-sm mb-12 text-gray-700 cursor-pointer">
          <a
            onClick={() => {
              request("original");
            }}
            className={mode === "original" ? "font-bold underline" : ""}
          >
            オリジナル
          </a>
          <a
            onClick={() => {
              request("non-technical");
            }}
            className={
              mode === "non-technical"
                ? "font-bold underline"
                : "hover:underline"
            }
          >
            技術に詳しくない人向け
          </a>
          <a
            onClick={() => {
              request("difference");
            }}
            className={
              mode === "difference" ? "font-bold underline" : "hover:underline "
            }
          >
            既存のCMSとの違いを知りたい人向け
          </a>
        </div>
        <h1 className="text-3xl font-semibold mb-8">{data.title}</h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: data.body }}></div>
        )}
      </main>
    );
  }

  // データが取得できるまでローディング
  return <main className="">Loading...</main>;
}
