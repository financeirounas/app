import fs from "fs";

async function getAccessToken() {
  const params = new URLSearchParams();
  params.append("client_id", process.env.GOOGLE_CLIENT_ID);
  params.append("client_secret", process.env.GOOGLE_CLIENT_SECRET);
  params.append("refresh_token", process.env.GOOGLE_REFRESH_TOKEN);
  params.append("grant_type", "refresh_token");

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!res.ok) {
    const data = await res.text();
    console.error("Erro ao buscar access token:", data);
    throw new Error("Falha ao gerar access token do Google");
  }

  const data = await res.json();
  return data.access_token;
}

export async function uploadToDrive({ filepath, originalName, mimeType }) {
  const accessToken = await getAccessToken();

  const fileBuffer = await fs.promises.readFile(filepath);
  const boundary = "-------314159265358979323846";

  const metadata = {
    name: originalName,
    parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
  };

  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartBody =
    delimiter +
    "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
    JSON.stringify(metadata) +
    delimiter +
    `Content-Type: ${mimeType}\r\n\r\n`;

  const body = Buffer.concat([
    Buffer.from(multipartBody, "utf8"),
    fileBuffer,
    Buffer.from(closeDelimiter, "utf8"),
  ]);

  
  const uploadRes = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": `multipart/related; boundary=${boundary}`,
      },
      body,
    }
  );

  if (!uploadRes.ok) {
    console.error(await uploadRes.text());
    throw new Error("Erro ao enviar arquivo ao Google Drive");
  }

  const fileData = await uploadRes.json();

  
  await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileData.id}/permissions`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role: "reader", type: "anyone" }),
    }
  );

  
  const infoRes = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileData.id}?fields=id,webViewLink,webContentLink`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  const info = await infoRes.json();

  return {
    id: info.id,
    viewUrl: info.webViewLink,
    downloadUrl: info.webContentLink,
  };
}
