import { getJwtTokenFromReq } from "@/lib/access-token";
import { getUserId } from "@/lib/user-data";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido. Use POST." });
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

    // Busca as unidades do usuário para pegar o unit_id
    const unitsRes = await fetch(`${process.env.SERVER_URL}/user-unit/${userId}/units`, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });

    if (!unitsRes.ok) {
      const errorText = await unitsRes.text();
      return res.status(unitsRes.status).json({
        error: "Erro ao buscar unidades do usuário",
        details: errorText,
      });
    }

    const units = await unitsRes.json();
    if (!units || units.length === 0) {
      return res.status(400).json({ 
        error: "Usuário não possui unidades associadas"
      });
    }

    const unitId = units[0].id;

    // Dados do corpo da requisição
    const { items, purpose, responsible, date, notes } = req.body;

    // Validações básicas
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
        error: "É necessário informar ao menos um item para saída"
      });
    }

    if (!purpose || !responsible || !date) {
      return res.status(400).json({ 
        error: "Campos obrigatórios: items, purpose, responsible, date"
      });
    }

    // Monta o payload para o backend
    const exitPayload = {
      items: items.map(item => ({
        name: item.name,
        used_quantity: parseInt(item.used_quantity, 10)
      })),
      purpose,
      responsible,
      date, // formato YYYY-MM-DD
      notes: notes || null,
      unit_id: unitId
    };

    // Envia para o backend
    const exitRes = await fetch(`${process.env.SERVER_URL}/storage/exit`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(exitPayload),
    });

    if (!exitRes.ok) {
      const errorData = await exitRes.json().catch(() => ({}));
      console.error("Erro ao registrar saída:", exitRes.status, errorData);
      return res.status(exitRes.status).json({
        error: errorData.detail || "Erro ao registrar saída do estoque",
        details: errorData,
      });
    }

    const exitData = await exitRes.json();
    return res.status(200).json({ 
      ok: true, 
      message: "Saída registrada com sucesso",
      items: exitData
    });

  } catch (err) {
    console.error("Erro ao registrar saída:", err);
    return res.status(500).json({ 
      error: "Erro ao comunicar com o servidor.",
      message: err.message
    });
  }
}
