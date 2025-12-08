export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: "Método não permitido. Use POST." });
  }

  const { email} = req.body || {};

  if (!email) {
    return res
      .status(400)
      .json({ error: "Email ausente na requisição." });
  }

  try {
    const fastApiURL = `${process.env.SERVER_URL}/auth/send-code`;
    const response = await fetch(fastApiURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok || !data.message) {
      return res.status(response.status).json({
        error: data.detail || "Falha no envio do código.",
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
