// node-fetchをimport
import fetch from "node-fetch";

export default async function handler(req, res) {
  // request.query.mode でクエリパラメータを取得
  const mode = req.query.mode;

  // microcms js sdk を使ってAPIを叩く
  const { createClient } = require("microcms-js-sdk");
  const client = createClient({
    serviceDomain: "o3i7wt7seb",
    apiKey: process.env.API_KEY,
  });

  const result = await client.get({ endpoint: "blogs" });
  const body = result.contents[0].body;
  const translated = await queryChatGPT(body, mode);

  res.status(200).json({ title: result.contents[0].title, body: translated });
}

async function queryChatGPT(content, mode) {
  // modeがoriginalの場合はそのまま返す
  if (mode === "original") {
    return content;
  }

  // modeがnon-technicalの場合
  let target = "";
  if (mode === "non-technical") {
    target = `- ITリテラシーが低い（技術の専門用語がわからない）
    - 表示速度や運用の効率化など、導入によるメリットを知りたい`;
  } else if (mode === "difference") {
    target = `- 既存のCMSとの違いを知りたい
    - ヘッドレスCMSにいくつ種類があるかも知りたい`;
  }

  const prompt = `HTML構造はそのままに本文だけを変換する。本文は、「ユーザー」にとって理解しやすい内容にする。文字数は変換前と同じくらいの長さにする。
    
  #ユーザー
  ${target}
    
  #変換前
  ${content}
    
  #変換後
  `;
  const apiKey = process.env.OPENAI_API_KEY;
  const url = "https://api.openai.com/v1/chat/completions";

  console.log(prompt);

  const data = {
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const content = await response.json();
    return content.choices[0].message.content;
  } catch (error) {
    console.error("Request failed:", error);
  }
}
