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
    const { id } = req.query;

    let orderUrl = `${process.env.SERVER_URL}/orders/unit/${id}`;
    

    const orderRes = await fetch(orderUrl, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });

    if (!orderRes.ok) {
      const errorText = await orderRes.text();
      
      return res.status(orderRes.status).json({
        error: "Erro ao buscar pedidos",
        details: errorText,
      });
    }

    const orders = await orderRes.json();
    
    return res.status(200).json({ 
      ok: true, 
      orders: orders
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

