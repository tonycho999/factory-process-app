import { useState, useEffect } from 'react';
import TaskTable from '../components/TaskTable';

export default function Admin() {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({ title: '', content: '', work_date: '' });

  // API: 전체 작업 가져오기
  const fetchTasks = async () => {
    const response = await fetch('/api/tasks');
    const data = await response.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // API: 새 작업 생성
  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    
    // 폼 초기화 및 목록 새로고침
    setFormData({ title: '', content: '', work_date: '' });
    fetchTasks(); 
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">작업 지시 대시보드</h1>
      
      {/* 작업 생성 폼 */}
      <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded-lg mb-8 flex flex-col gap-3">
        <input 
          type="text" placeholder="작업 제목" required className="border p-2"
          value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} 
        />
        <textarea 
          placeholder="작업 내용" required className="border p-2"
          value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} 
        />
        <input 
          type="date" required className="border p-2"
          value={formData.work_date} onChange={e => setFormData({...formData, work_date: e.target.value})} 
        />
        <button type="submit" className="bg-blue-600 text-white font-bold p-2 rounded">작업 생성</button>
      </form>

      {/* 작업 리스트 표 */}
      <TaskTable tasks={tasks} />
    </div>
  );
}
