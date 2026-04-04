// 특정 작업 상태 변경 및 삭제 요청 [PATCH]
export async function onRequestPatch(context) {
  try {
    const taskId = context.params.id; 
    const body = await context.request.json();
    const { status, delete_requested } = body;

    // 💡 1. 생산라인에서 '삭제 요청'을 보낸 경우 처리
    if (delete_requested !== undefined) {
      const info = await context.env.DB.prepare(
        "UPDATE tasks SET delete_requested = ? WHERE id = ?"
      )
      .bind(delete_requested, taskId)
      .run();

      if (info.meta.changes === 0) {
        return new Response(JSON.stringify({ error: "작업을 찾을 수 없습니다." }), { status: 404 });
      }
      return new Response(JSON.stringify({ success: true, message: "삭제 요청이 완료되었습니다." }), { status: 200 });
    }

    // 💡 2. 일반적인 상태 변경('진행중', '완료' 등) 처리
    if (!status) {
      return new Response(JSON.stringify({ error: "변경할 상태(status) 값이 필요합니다." }), { status: 400 });
    }

    const info = await context.env.DB.prepare(
      "UPDATE tasks SET status = ? WHERE id = ?"
    )
    .bind(status, taskId)
    .run();

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

// 💡 관리자 삭제 승인 (DB에서 영구 삭제) [DELETE]
export async function onRequestDelete(context) {
  try {
    const taskId = context.params.id;

    // DB에서 해당 id의 작업 데이터를 완전히 삭제합니다.
    const info = await context.env.DB.prepare(
      "DELETE FROM tasks WHERE id = ?"
    )
    .bind(taskId)
    .run();

    if (info.meta.changes === 0) {
      return new Response(JSON.stringify({ error: "삭제할 작업을 찾을 수 없습니다." }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true, message: "작업이 완전히 삭제되었습니다." }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
