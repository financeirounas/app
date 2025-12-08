export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "Código ausente na requisição." });
  }

  try {
    const fastApiURL = process.env.SERVER_URL + "/auth/verify-email";

    const response = await fetch(fastApiURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);

  } catch (err) {
    console.error("Erro ao comunicar com o FastAPI:", err);
    return res.status(500).json({ error: "Erro interno ao validar e-mail." });
  }
}
