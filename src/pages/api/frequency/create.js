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

    const { amount, date } = req.body || {};

    if (!amount || !date) {
      return res.status(400).json({
        error: "Campos obrigatórios ausentes",
        details: "amount e date são obrigatórios",
      });
    }

    const userId = getUserId(req);

    if (!userId) {
      return res
        .status(401)
        .json({ error: "ID do usuário não encontrado no token" });
    }

    // 2. Busca as unidades do usuário
    const unitsRes = await fetch(
      `${process.env.SERVER_URL}/user-unit/${userId}/units`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!unitsRes.ok) {
      const errorText = await unitsRes.text();
      console.error(
        `Erro ao buscar unidades: ${unitsRes.status} - ${errorText}`
      );
      return res.status(unitsRes.status).json({
        error: "Erro ao buscar unidades do usuário",
        details: errorText,
      });
    }

    const units = await unitsRes.json();

    if (!units || units.length === 0) {
      return res.status(400).json({
        error: "Usuário não possui unidades associadas",
      });
    }

    // 3. Usa a primeira unidade do usuário
    const unitId = units[0].id;

    // 4. Valida se amount é um número válido
    const amountNum = parseInt(amount, 10);
    if (isNaN(amountNum) || amountNum < 0) {
      return res.status(400).json({
        error: "Amount deve ser um número válido maior ou igual a zero",
      });
    }

    // 5. Valida formato da data (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({
        error: "Data deve estar no formato YYYY-MM-DD",
      });
    }

    // 6. Cria a frequência no backend
    const createRes = await fetch(`${process.env.SERVER_URL}/frequency`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        unit_id: unitId,
        amount: amountNum,
        date: date,
      }),
    });

    if (!createRes.ok) {
      const errorText = await createRes.text();
      console.error(
        `Erro ao criar frequência: ${createRes.status} - ${errorText}`
      );
      return res.status(createRes.status).json({
        error: "Erro ao criar frequência",
        details: errorText,
      });
    }

    const frequency = await createRes.json();
    console.log(`Frequência criada:`, frequency);

    return res.status(200).json({
      ok: true,
      frequency: frequency,
    });
  } catch (err) {
    console.error("Erro ao criar frequência:", err);
    return res.status(500).json({
      error: "Erro ao comunicar com o servidor.",
      message: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
}
