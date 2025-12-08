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

    // 2. Busca as unidades do usuário
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
    console.log(`Unidades encontradas para usuário ${userId}:`, units);
    
    if (!units || units.length === 0) {
      return res.status(200).json({ 
        ok: true, 
        frequencies: [],
        unit: null,
        todayFrequency: null,
        message: "Usuário não possui unidades associadas"
      });
    }

    // 3. Usa a primeira unidade do usuário
    const unitId = units[0].id;
    let unit = units[0];
    
    // Tenta buscar detalhes completos da unidade (incluindo capacity se disponível)
    const unitDetailRes = await fetch(`${process.env.SERVER_URL}/units/${unitId}`, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });

    if (unitDetailRes.ok) {
      const unitDetail = await unitDetailRes.json();
      // Mescla os dados, priorizando os detalhes completos
      unit = { ...unit, ...unitDetail };
    }

    // 4. Busca todas as frequências da unidade
    const frequencyRes = await fetch(`${process.env.SERVER_URL}/frequency?unit_id=${unitId}`, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });

    if (!frequencyRes.ok) {
      const errorText = await frequencyRes.text();
      console.error(`Erro ao buscar frequências: ${frequencyRes.status} - ${errorText}`);
      return res.status(frequencyRes.status).json({
        error: "Erro ao buscar frequências",
        details: errorText,
      });
    }

    const frequencies = await frequencyRes.json();
    console.log(`Frequências encontradas para unidade ${unitId}:`, frequencies);

    // 5. Busca frequência de hoje (se existir)
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const todayFrequency = frequencies.find(f => f.date === today) || null;

    return res.status(200).json({ 
      ok: true, 
      frequencies: frequencies || [],
      unit: unit,
      todayFrequency: todayFrequency
    });
  } catch (err) {
    console.error("Erro ao buscar frequências:", err);
    return res.status(500).json({ 
      error: "Erro ao comunicar com o servidor.",
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
}

