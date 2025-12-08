import { getJwtTokenFromReq } from "@/lib/access-token";
import { getUserId } from "@/lib/user-data";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ error: "Método não permitido. Use GET." });
  }

  try {
    const token = getJwtTokenFromReq(req);
    if (!token) {
      return res.status(401).json({ error: "Token não encontrado" });
    }

    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({ error: "ID do usuário não encontrado no token" });
    }


    const fastApiURL = `${process.env.SERVER_URL}/user-unit/${userId}/units`;
    const response = await fetch(fastApiURL, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro ao buscar unidades: ${response.status} - ${errorText}`);
      return res.status(response.status).json({
        error: "Erro ao buscar unidades do usuário",
        details: errorText,
      });
    }

    const data = await response.json();
    console.log(`Unidades encontradas para usuário ${userId}:`, data);
    const units = Array.isArray(data) ? data : [];
    return res.status(200).json({ ok: true, units: units });
  } catch (err) {
    console.error("Erro ao buscar unidades:", err);
    return res.status(500).json({ 
      error: "Erro ao comunicar com o servidor.",
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
}
