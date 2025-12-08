import { clearJwtToken } from "@/lib/access-token";

export default async function handler(req, res) {
  console.log("---------Iniciando logout do usuário.");  
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: "Método não permitido. Use POST." });
  }

  try {
    clearJwtToken(res);
    return res.status(200).json({ ok: true });
  } catch (err) {
    try {
      clearJwtToken(res);
    } catch (cookieError) {
      console.error("Erro ao remover cookie:", cookieError);
    }
    return res.status(200).json({ ok: true });
  }
}
