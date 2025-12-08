import { getJwtTokenFromReq } from "@/lib/access-token";

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


    // 2. Pega o parâmetro month da query string (opcional)
    const { month } = req.query;
    
    // 3. Chama a API de relatórios do backend
    let reportUrl = `${process.env.SERVER_URL}/reports/me`;
    if (month) {
      reportUrl += `?month=${encodeURIComponent(month)}`;
    }

    const reportRes = await fetch(reportUrl, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });

    if (!reportRes.ok) {
      const errorText = await reportRes.text();
      console.error(`Erro ao buscar relatório: ${reportRes.status} - ${errorText}`);
      return res.status(reportRes.status).json({
        error: "Erro ao buscar relatório",
        details: errorText,
      });
    }

    const report = await reportRes.json();
    
    return res.status(200).json({ 
      ok: true, 
      report: report
    });
  } catch (err) {
    console.error("Erro ao buscar relatório:", err);
    return res.status(500).json({ 
      error: "Erro ao comunicar com o servidor.",
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
}

