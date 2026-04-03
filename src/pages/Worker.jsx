import { useState, useEffect } from 'react';
import TaskCard from '../components/TaskCard';

export default function Worker() {
  const [tasks, setTasks] = useState([]);

  // API: 전체 작업 가져오기
  const fetchTasks = async () => {
    const response = await fetch('/api/tasks');
    const data = await response.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
    // 10초마다 자동 갱신 (관리자 화면과 동기화 유지)
    const intervalId = setInterval(fetchTasks, 10000);
    return () => clearInterval(intervalId);
  }, []);

  // API: 작업 상태 변경
  const handleStatusChange = async (taskId, newStatus) => {
    await fetch(`/api/task/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchTasks(); // 상태 변경 직후 목록 즉시 새로고침
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">생산라인 작업 현황</h1>
      
      {/* 카드 그리드 뷰 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} />
        ))}
      </div>
    </div>
  );
}
