export async function onRequestPost(context) {
  try {
    const formData = await context.request.formData();
    const file = formData.get('file');
    if (!file) return new Response("파일이 없습니다.", { status: 400 });

    const fileName = `${Date.now()}-${file.name}`;
    // R2 저장소에 파일 저장
    await context.env.R2.put(fileName, file);

    return new Response(JSON.stringify({ url: `/api/file/${fileName}` }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}
