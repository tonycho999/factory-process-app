import { useState, useEffect } from 'react';
import TaskTable from '../components/TaskTable';

// 💡 한국 시간(KST) 기준 오늘 날짜를 구하는 함수
const getTodayKST = () => {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
  const kstTime = new Date(utc + (9 * 60 * 60 * 1000));
  return kstTime.toISOString().split('T')[0];
};

export default function Admin() {
  const [tasks, setTasks] = useState([]);
  const [file, setFile] = useState(null);
  
  // 💡 초기값을 오늘 날짜로 고정
  const [formData, setFormData] = useState({ 
    title: '', 
    content: '', 
    work_date: getTodayKST() 
  });

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
    
    // 💡 폼 제출 후 초기화할 때도 날짜는 계속 '오늘'로 유지
    setFormData({ title: '', content: '', work_date: getTodayKST() });
    
    // 파일 상태 및 실제 파일 입력칸(UI) 비우기
    setFile(null);
    document.getElementById('fileInput').value = "";
    
    fetchTasks();
  };

  const approveDelete = async (id) => {
    if(!confirm("정말로 삭제를 승인하시겠습니까? DB에서 영구 삭제됩니다.")) return;
    await fetch(`/api/task/${id}`, { method: 'DELETE' });
    fetchTasks();
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">관리자 대시보드</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-lg mb-8 flex flex-col gap-4">
        <input type="text" placeholder="제목" required className="border p-3 rounded" value={formData.title} onChange={e=>setFormData({...formData, title:e.target.value})} />
        <textarea placeholder="내용" required className="border p-3 rounded h-24" value={formData.content} onChange={e=>setFormData({...formData, content:e.target.value})} />
        
        {/* 💡 날짜 입력칸을 읽기 전용(readOnly)으로 바꾸고, 클릭할 수 없게 디자인 변경 */}
        <input 
          type="date" 
          required 
          className="border p-3 rounded bg-gray-200 text-gray-600 font-bold cursor-not-allowed outline-none" 
          value={formData.work_date} 
          readOnly 
          title="작업일은 오늘 날짜로 고정됩니다."
        />
        
        <div className="border p-3 rounded bg-gray-50">
          <label className="text-sm font-bold text-gray-600 mr-4">📎 도면/지시서 첨부:</label>
          <input id="fileInput" type="file" onChange={e => setFile(e.target.files[0])} />
        </div>
        
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded">작업 지시 생성</button>
      </form>

      <TaskTable tasks={tasks} onApproveDelete={approveDelete} />
    </div>
  );
}
