import { useState, useEffect } from 'react';
import TaskCard from '../components/TaskCard';
// Worker.jsx 내부의 상태 변경 함수
const requestDelete = async (taskId) => {
  if(!confirm("관리자에게 이 작업의 삭제를 요청하시겠습니까?")) return;
  await fetch(`/api/task/${taskId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ delete_requested: 1 }), // 삭제 요청 보냄
  });
  alert("삭제 요청을 보냈습니다.");
  fetchTasks();
};

// 작업 카드 UI 부분 (TaskCard.jsx 내부)
{task.status === '완료' && (
  <div className="flex gap-2">
    <span className="text-green-600 font-bold">✓ 완료됨</span>
    {task.delete_requested === 0 && (
      <button onClick={() => requestDelete(task.id)} className="text-xs bg-gray-200 p-1 rounded">삭제 요청</button>
    )}
    {task.delete_requested === 1 && (
      <span className="text-xs text-red-500 italic">삭제 승인 대기중...</span>
    )}
  </div>
)}
