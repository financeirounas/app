import { setJwtToken } from "@/lib/access-token";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: "Método não permitido. Use POST." });
  }

  const { email, password } = req.body || {};

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Email ou senha ausente na requisição." });
  }

  try {
    const fastApiURL = `${process.env.SERVER_URL}/auth/login`;
    console.log("Enviando requisição para FastAPI em:", fastApiURL);

    const response = await fetch(fastApiURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok || !data.access_token) {
      return res.status(response.status).json({
        error: data.detail || "Falha no login.",
      });
    }

    setJwtToken(res, data.access_token);

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Erro ao comunicar com o servidor:", err);
    return res
      .status(500)
      .json({ error: "Erro ao comunicar com o servidor." });
  }
}
