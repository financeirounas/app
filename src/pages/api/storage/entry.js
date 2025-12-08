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
    const { name, amount, type, supplier, invoice, responsible, date, initial_quantity } = req.body;

    // Validações básicas
    if (!name || !amount || !type || !responsible || !date || initial_quantity === undefined) {
      return res.status(400).json({ 
        error: "Campos obrigatórios: name, amount, type, responsible, date, initial_quantity"
      });
    }

    // Monta o payload para o backend
    const entryPayload = {
      name,
      amount: parseFloat(amount),
      unit_id: unitId,
      type: type === "Comprado (Verba)" || type === "comprado" ? "comprado" : "doado",
      supplier: supplier || null,
      invoice: invoice || null,
      responsible,
      date, // formato YYYY-MM-DD
      initial_quantity: parseInt(initial_quantity, 10),
      used_quantity: 0
    };

    // Envia para o backend
    const entryRes = await fetch(`${process.env.SERVER_URL}/storage/entry`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(entryPayload),
    });

    if (!entryRes.ok) {
      const errorData = await entryRes.json().catch(() => ({}));
      console.error("Erro ao registrar entrada:", entryRes.status, errorData);
      return res.status(entryRes.status).json({
        error: errorData.detail || "Erro ao registrar entrada no estoque",
        details: errorData,
      });
    }

    const entryData = await entryRes.json();
    return res.status(201).json({ 
      ok: true, 
      message: "Entrada registrada com sucesso",
      item: entryData
    });

  } catch (err) {
    console.error("Erro ao registrar entrada:", err);
    return res.status(500).json({ 
      error: "Erro ao comunicar com o servidor.",
      message: err.message
    });
  }
}
