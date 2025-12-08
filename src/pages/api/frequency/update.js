import { getJwtTokenFromReq } from "@/lib/access-token";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Método não permitido. Use PUT." });
  }

  try {
    const token = getJwtTokenFromReq(req);
    if (!token) {
      return res.status(401).json({ error: "Token não encontrado" });
    }

    const { frequency_id } = req.query || {};
    const { amount, date } = req.body || {};

    if (!frequency_id) {
      return res.status(400).json({
        error: "ID da frequência é obrigatório",
      });
    }

    if (!amount && !date) {
      return res.status(400).json({
        error: "Pelo menos um campo deve ser fornecido (amount ou date)",
      });
    }

    // Prepara o body para o backend (apenas campos fornecidos)
    const updateData = {};
    if (amount !== undefined) {
      const amountNum = parseInt(amount, 10);
      if (isNaN(amountNum) || amountNum < 0) {
        return res.status(400).json({
          error: "Amount deve ser um número válido maior ou igual a zero",
        });
      }
      updateData.amount = amountNum;
    }

    if (date !== undefined) {
      // Valida formato da data (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(date)) {
        return res.status(400).json({
          error: "Data deve estar no formato YYYY-MM-DD",
        });
      }
      updateData.date = date;
    }

    // Atualiza a frequência no backend
    const updateRes = await fetch(
      `${process.env.SERVER_URL}/frequency/${frequency_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      }
    );

    if (!updateRes.ok) {
      const errorText = await updateRes.text();
      console.error(
        `Erro ao atualizar frequência: ${updateRes.status} - ${errorText}`
      );
      return res.status(updateRes.status).json({
        error: "Erro ao atualizar frequência",
        details: errorText,
      });
    }

    const frequency = await updateRes.json();
    console.log(`Frequência atualizada:`, frequency);

    return res.status(200).json({
      ok: true,
      frequency: frequency,
    });
  } catch (err) {
    console.error("Erro ao atualizar frequência:", err);
    return res.status(500).json({
      error: "Erro ao comunicar com o servidor.",
      message: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
}

