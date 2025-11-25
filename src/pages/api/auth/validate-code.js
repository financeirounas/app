export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: "Método não permitido. Use POST." });
  }

  const { code } = req.body || {};

  if (!code) {
    return res
      .status(400)
      .json({ error: "Código ausente na requisição." });
  }

  try {
    const fastApiURL = `${process.env.SERVER_URL}/auth/validate-code`;

    const response = await fetch(fastApiURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    const data = await response.json();

    if (!response.ok || !data.message || !data.reset_password_token) {
      return res.status(response.status).json({
        error: data.detail || "Falha na validação do código.",
      });
    }
    return res.status(200).json({ ok: true, reset_password_token: data.reset_password_token });
  } catch (err) {
    console.error("Erro ao comunicar com o servidor:", err);
    return res
      .status(500)
      .json({ error: "Erro ao comunicar com o servidor." });
  }
}
