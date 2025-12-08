export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "E-mail é obrigatório." });
  }

  try {
    const fastApiURL =
      process.env.SERVER_URL + "/auth/send-code-verify-email";

    const response = await fetch(fastApiURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.detail || data.error || "Erro ao enviar novo código.",
      });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("Erro ao comunicar com FastAPI:", err);
    return res
      .status(500)
      .json({ error: "Erro interno ao enviar novo código." });
  }
}
