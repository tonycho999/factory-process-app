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

    // 문제가 되던 첨부파일(attachment_url) 변수 제거
    // 폼에서 입력받은 3가지(제목, 내용, 날짜)만 DB에 안전하게 넣습니다.
    const info = await context.env.DB.prepare(
      "INSERT INTO tasks (title, content, work_date) VALUES (?, ?, ?)"
    )
    .bind(title, content, work_date)
    .run();

    return new Response(JSON.stringify({ success: true }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // DB 에러가 발생하면 무조건 상세 원인을 텍스트로 반환
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
