export async function onRequestGet(context) {
  try {
    // URL에서 [id] 부분(파일명)을 가져옵니다.
    const filename = context.params.id; 
    
    if (!filename) {
      return new Response("파일명이 필요합니다.", { status: 400 });
    }

    // 💡 핵심: wrangler.toml에서 바인딩한 'R2' 저장소에서 파일을 꺼냅니다.
    const fileObject = await context.env.R2.get(filename);

    if (!fileObject) {
      return new Response("파일을 찾을 수 없습니다.", { status: 404 });
    }

    // 💡 브라우저가 파일을 이미지나 문서로 인식하게 하려면 헤더 설정이 중요합니다.
    // R2에 저장될 때 R2가 자동으로 파일 타입을 알고 있으므로, 이를 그대로 전달합니다.
    const contentType = fileObject.httpMetadata?.contentType || 'application/octet-stream';

    // 파일 데이터를 브라우저에 스트림 형태로 직접 쏩니다. (빠릅니다!)
    return new Response(fileObject.body, {
      headers: {
        'Content-Type': contentType,
        // Optional: Cache 설정을 추가하여 로딩 속도를 높일 수 있습니다.
        // 'Cache-Control': 'max-age=604800, public',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
