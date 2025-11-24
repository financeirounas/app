import formidable from "formidable";
import { uploadToDrive } from "@/lib/google-drive";

export const config = {
  api: {
    bodyParser: false,
  },
}; 

function parseForm(req) {
  const form = formidable({ multiples: false });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { files } = await parseForm(req);
    let file = files.file;
    if (Array.isArray(file)) {
      file = file[0];
    }

    if (!file) {
      return res.status(400).json({ error: "Arquivo não enviado" });
    }

    console.log("DEBUG file recebido do formidable:", {
      filepath: file.filepath,
      originalFilename: file.originalFilename,
      mimetype: file.mimetype,
    });

    if (!file.filepath) {
      return res.status(500).json({
        error:
          "filepath não definido no arquivo. Verifique estrutura retornada por formidable.",
      });
    }

    const result = await uploadToDrive({
      filepath: file.filepath,
      originalName: file.originalFilename,
      mimeType: file.mimetype,
    });

    return res.status(200).json({
      success: true,
      driveFileId: result.id,
      viewUrl: result.viewUrl,
      downloadUrl: result.downloadUrl,
      fileName: file.originalFilename,
      mimeType: file.mimetype,
    });
  } catch (err) {
    console.error("Erro geral na API de upload:", err);
    return res.status(500).json({ error: "Erro no upload" });
  }
}
