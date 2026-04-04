// 전체 작업 목록 조회 [GET]
export async function onRequestGet(context) {
  try {
    const { results } = await context.env.DB.prepare(
      "SELECT * FROM tasks ORDER BY created_at DESC"
    ).all();

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// 새 작업 생성 [POST]
export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    
    const title = body.title;
    const content = body.content;
    const work_date = body.work_date;
    // 💡 첨부파일 URL 추가 (파일이 없으면 null로 안전하게 처리)
    const attachment_url = body.attachment_url || null;

    if (!title) {
      return new Response(JSON.stringify({ error: "제목은 필수입니다." }), { status: 400 });
    }

    // 💡 DB INSERT 부분에 attachment_url 추가
    const info = await context.env.DB.prepare(
      "INSERT INTO tasks (title, content, work_date, attachment_url) VALUES (?, ?, ?, ?)"
    )
    .bind(title, content, work_date, attachment_url)
    .run();

    return new Response(JSON.stringify({ success: true, id: info.meta.last_row_id }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
