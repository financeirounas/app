export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: "Método não permitido. Use POST." });
  }

  const {password, confirm, token} = req.body || {};

  if (!token) {
    return res
      .status(400)
      .json({ error: "Token ausente na requisição." });
  }

  try {
    const fastApiURL = `${process.env.SERVER_URL}/auth/reset-password`;
    const response = await fetch(fastApiURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, confirm, token }),
    });

    const data = await response.json();

    console.log("Resposta do FastAPI:", data);

    if (!response.ok || !data.message) {
      return res.status(response.status).json({
        error: data.detail || "Falha ao redefinir a senha.",
      });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Erro ao comunicar com o servidor:", err);
    return res
      .status(500)
      .json({ error: "Erro ao comunicar com o servidor." });
  }
}
