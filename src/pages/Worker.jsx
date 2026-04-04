import { useState, useEffect } from 'react';
import TaskCard from '../components/TaskCard';

export default function Worker() {
  const [tasks, setTasks] = useState([]);

  // DB에서 최신 작업 목록을 가져오는 함수
  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("데이터 불러오기 실패:", error);
    }
  };

  // 화면 접속 시 10초마다 자동으로 데이터를 갱신 (Polling)
  useEffect(() => {
    fetchTasks();
    const intervalId = setInterval(fetchTasks, 10000);
    return () => clearInterval(intervalId);
  }, []);

  // 작업 상태(진행중, 완료) 변경 요청 함수
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await fetch(`/api/task/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchTasks(); // 변경 직후 즉시 새로고침
    } catch (error) {
      alert("상태 변경 중 오류가 발생했습니다.");
    }
  };

  // 관리자에게 삭제를 요청하는 함수
  const requestDelete = async (taskId) => {
    if (!confirm("관리자에게 이 작업의 삭제를 요청하시겠습니까?")) return;
    
    try {
      await fetch(`/api/task/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delete_requested: 1 }),
      });
      alert("삭제 요청을 보냈습니다.");
      fetchTasks();
    } catch (error) {
      alert("삭제 요청 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">생산라인 작업 현황</h1>
      
      {/* 작업 카드들을 그리드 형태로 배치 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onStatusChange={handleStatusChange} 
            onRequestDelete={requestDelete} 
          />
        ))}
      </div>
    </div>
  );
}
