'use client';

import { useState } from 'react';
import TiptapEditor from '../components/TiptapEditor';

export default function Home() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [genName, setGenName] = useState('');
  const [genDate, setGenDate] = useState('');
  const [genAppeal, setGenAppeal] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSave = async () => {
  const response = await fetch('http://localhost:8000/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content }),
  });
  const data = await response.json();
  setMessage(data.message);
  setTimeout(() => setMessage(''), 2000); // ← 追加
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    const response = await fetch('http://localhost:8000/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: genName, date: genDate, appeal: genAppeal }),
    });
    const data = await response.json();
    setContent(data.content);
    setIsGenerating(false);
  };

  return (
    <main style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
      <h1>プレスリリースエディタ</h1>

      {/* タイトル入力 */}
      <input
        type="text"
        placeholder="タイトルを入力"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: '100%', padding: '8px', fontSize: '16px', marginBottom: '16px', boxSizing: 'border-box' }}
      />

      {/* Tiptapエディタ */}
      <TiptapEditor onChange={setContent} content={content} />
      {/* 保存ボタン */}
      <button
        onClick={handleSave}
        style={{ marginTop: '16px', padding: '10px 24px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px' }}
      >
        保存する
      </button>

      {/* メッセージ表示 */}
      {message && (
        <p style={{ marginTop: '12px', color: 'green' }}>{message}</p>
      )}

      {/* AI生成フォーム */}
      <div style={{ marginTop: '40px', padding: '24px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <h2>かんたんプレスリリース生成</h2>
        <p style={{ color: '#666', marginBottom: '16px' }}>3つの情報を入力するだけでプレスリリースを自動生成します</p>

        <input
          type="text"
          placeholder="商品・サービス名（例：新型スマートウォッチ）"
          value={genName}
          onChange={(e) => setGenName(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '8px', boxSizing: 'border-box' }}
        />
        <input
          type="text"
          placeholder="リリース日（例：2026年3月7日）"
          value={genDate}
          onChange={(e) => setGenDate(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '8px', boxSizing: 'border-box' }}
        />
        <input
          type="text"
          placeholder="おすすめポイント（例：バッテリーが1週間持つ）"
          value={genAppeal}
          onChange={(e) => setGenAppeal(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '16px', boxSizing: 'border-box' }}
        />

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          style={{ padding: '10px 24px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: isGenerating ? 'not-allowed' : 'pointer', fontSize: '16px' }}
        >
          {isGenerating ? '生成中...' : 'プレスリリースを生成する'}
        </button>
      </div>
    </main>
  );
}