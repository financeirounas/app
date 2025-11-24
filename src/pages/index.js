// pages/index.js
import { useState } from "react";
import Header from "@/components/header";

export default function Home() {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/files/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Erro no upload");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <Header />

      <h2>Upload para Google Drive</h2>

      <input
        type="file"
        accept="application/pdf,image/png,image/jpeg"
        onChange={handleFileChange}
        disabled={uploading}
      />

      {uploading && <p>Enviando arquivo...</p>}

      {error && <p style={{ color: "red" }}>Erro: {error}</p>}

      {result && (
        <div style={{ marginTop: 16 }}>
          <p>
            <strong>Upload concluído!</strong>
          </p>
          <p>File ID: {result.driveFileId}</p>
          <p>
            Visualizar:{" "}
            <a href={result.viewUrl} target="_blank" rel="noreferrer">
              Abrir no Drive
            </a>
          </p>
          <p>
            Download:{" "}
            <a href={result.downloadUrl} target="_blank" rel="noreferrer">
              Baixar
            </a>
          </p>
        </div>
      )}
    </main>
  );
}
