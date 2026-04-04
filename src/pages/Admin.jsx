import { useState, useEffect } from 'react';
import TaskTable from '../components/TaskTable';

export default function Admin() {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({ title: '', content: '', work_date: '' });

  // DB에서 최신 작업 목록을 가져오는 함수
  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      const data = await response.json();
      setTasks(data); // 화면 업데이트
    } catch (error) {
      console.error("데이터 불러오기 실패:", error);
    }
  };

  // 💡 핵심 변경 부분: 화면이 켜지면 5초마다 자동 갱신
  useEffect(() => {
    fetchTasks(); // 최초 접속 시 1번 실행
    
    // 5초(5000ms)마다 fetchTasks를 몰래 실행해서 표를 최신 상태로 바꿉니다.
    const intervalId = setInterval(fetchTasks, 5000); 
    
    // 다른 화면으로 이동하면 타이머를 꺼서 메모리 낭비를 막습니다.
    return () => clearInterval(intervalId);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errText = await response.text();
        alert(`작업 생성 실패 (서버 원인): ${errText}`);
        return;
      }
      
      setFormData({ title: '', content: '', work_date: '' });
      fetchTasks(); // 내가 생성한 직후에도 표를 즉시 새로고침
    } catch (err) {
      alert(`통신 오류: ${err.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">작업 지시 대시보드</h1>
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md p-6 rounded-lg mb-8 flex flex-col gap-4">
        <input 
          type="text" placeholder="작업 제목" required className="border border-gray-300 p-3 rounded"
          value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} 
        />
        <textarea 
          placeholder="작업 내용" required className="border border-gray-300 p-3 rounded h-32"
          value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} 
        />
        <input 
          type="date" required className="border border-gray-300 p-3 rounded"
          value={formData.work_date} onChange={e => setFormData({...formData, work_date: e.target.value})} 
        />
        <button type="submit" className="bg-blue-600 text-white font-bold p-3 rounded hover:bg-blue-700 transition">작업 지시 생성</button>
      </form>

      <TaskTable tasks={tasks} />
    </div>
  );
}
