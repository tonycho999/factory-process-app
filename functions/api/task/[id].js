// 특정 작업 상태 변경 [PATCH]
export async function onRequestPatch(context) {
  try {
    // URL에서 [id] 파라미터 값을 가져옵니다.
    const taskId = context.params.id; 
    
    // 프론트엔드에서 보낸 변경할 상태값('진행중', '완료' 등)을 파싱합니다.
    const body = await context.request.json();
    const { status } = body;

    if (!status) {
      return new Response(JSON.stringify({ error: "변경할 상태(status) 값이 필요합니다." }), { status: 400 });
    }

    // D1 데이터베이스의 특정 작업 상태 UPDATE
    const info = await context.env.DB.prepare(
      "UPDATE tasks SET status = ? WHERE id = ?"
    )
    .bind(status, taskId)
    .run();

    // 업데이트된 행이 없는 경우 (존재하지 않는 ID)
    if (info.meta.changes === 0) {
      return new Response(JSON.stringify({ error: "작업을 찾을 수 없습니다." }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true, message: "상태가 업데이트되었습니다." }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
