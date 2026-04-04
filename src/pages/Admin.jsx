import { useState, useEffect } from 'react';
import TaskTable from '../components/TaskTable'; // 💡 표 컴포넌트 불러오기

export default function Admin() {
  const [tasks, setTasks] = useState([]);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', work_date: '' });

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      setTasks(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchTasks();
    const timer = setInterval(fetchTasks, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let attachment_url = "";

    if (file) {
      const fb = new FormData();
      fb.append('file', file);
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: fb });
      if (uploadRes.ok) {
        const uploadData = await uploadRes.json();
        attachment_url = uploadData.url;
      }
    }

    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, attachment_url }),
    });
    
    setFormData({ title: '', content: '', work_date: '' });
    setFile(null);
    fetchTasks();
  };

  // 💡 삭제 승인 함수
  const approveDelete = async (id) => {
    if(!confirm("정말로 삭제를 승인하시겠습니까? DB에서 영구 삭제됩니다.")) return;
    await fetch(`/api/task/${id}`, { method: 'DELETE' });
    fetchTasks();
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">관리자 대시보드</h1>
      
      {/* 작업 생성 폼 */}
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-lg mb-8 flex flex-col gap-4">
        <input type="text" placeholder="제목" required className="border p-3 rounded" value={formData.title} onChange={e=>setFormData({...formData, title:e.target.value})} />
        <textarea placeholder="내용" required className="border p-3 rounded h-24" value={formData.content} onChange={e=>setFormData({...formData, content:e.target.value})} />
        <input type="date" required className="border p-3 rounded" value={formData.work_date} onChange={e=>setFormData({...formData, work_date:e.target.value})} />
        
        {/* 첨부파일 선택 */}
        <div className="border p-3 rounded bg-gray-50">
          <label className="text-sm font-bold text-gray-600 mr-4">📎 도면/지시서 첨부:</label>
          <input type="file" onChange={e => setFile(e.target.files[0])} />
        </div>
        
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded">작업 지시 생성</button>
      </form>

      {/* 💡 기존 표 복구 및 삭제 승인 권한 전달 */}
      <TaskTable tasks={tasks} onApproveDelete={approveDelete} />
    </div>
  );
}
