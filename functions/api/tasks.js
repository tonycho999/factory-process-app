// 전체 작업 목록 조회 [GET]
export async function onRequestGet(context) {
  try {
    // context.env.DB는 wrangler.toml에서 설정한 D1 데이터베이스입니다.
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
    // 프론트엔드에서 보낸 JSON 데이터를 파싱합니다.
    const body = await context.request.json();
    const { title, content, work_date, attachment_url } = body;

    // 필수 항목 검사
    if (!title) {
      return new Response(JSON.stringify({ error: "제목(title)은 필수입니다." }), { status: 400 });
    }

    // D1 데이터베이스에 새 작업 INSERT
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
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
