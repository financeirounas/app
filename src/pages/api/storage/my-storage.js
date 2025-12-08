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
      return res.status(401).json({ error: "ID do usuárionão encontrado no token" });
    }
    const unitsRes = await fetch(`${process.env.SERVER_URL}/user-unit/${userId}/units`, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });

    if (!unitsRes.ok) {
      const errorText = await unitsRes.text();
      console.error(`Erro ao buscar unidades: ${unitsRes.status} - ${errorText}`);
      return res.status(unitsRes.status).json({
        error: "Erro ao buscar unidades do usuário",
        details: errorText,
      });
    }

    const units = await unitsRes.json();    
    if (!units || units.length === 0) {
      return res.status(200).json({ 
        ok: true, 
        storage: [],
        unit: null,
        message: "Usuário não possui unidades associadas"
      });
    }

    const unitId = units[0].id;
    const storageRes = await fetch(`${process.env.SERVER_URL}/storage?unit_id=${unitId}`, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });

    if (!storageRes.ok) {
      const errorText = await storageRes.text();
      console.error(`Erro ao buscar estoque: ${storageRes.status} - ${errorText}`);
      return res.status(storageRes.status).json({
        error: "Erro ao buscar estoque",
        details: errorText,
      });
    }

    const storage = await storageRes.json();
    return res.status(200).json({ 
      ok: true, 
      storage: storage,
      unit: units[0] 
    });
  } catch (err) {
    console.error("Erro ao buscar estoque:", err);
    return res.status(500).json({ 
      error: "Erro ao comunicar com o servidor.",
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
}



