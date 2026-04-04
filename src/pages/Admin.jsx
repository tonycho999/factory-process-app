import { useState, useEffect, useRef } from 'react';
import TaskTable from '../components/TaskTable';

const getTodayKST = () => {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
  const kstTime = new Date(utc + (9 * 60 * 60 * 1000));
  return kstTime.toISOString().split('T')[0];
};

export default function Admin() {
  const [tasks, setTasks] = useState([]);
  const [file, setFile] = useState(null);
  
  // 💡 파일 입력칸을 직접 제어하기 위한 ref 생성
  const fileInputRef = useRef(null);
  
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
    
    // 텍스트와 날짜 데이터 초기화
    setFormData({ title: '', content: '', work_date: getTodayKST() });
    
    // 메모리 상의 파일 데이터 지우기
    setFile(null);
    
    // 💡 화면 상의 파일 입력칸 강제 리셋 (처음 화면으로 돌아감)
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    
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
        
        <input 
          type="date" 
          required 
          className="border p-3 rounded bg-gray-200 text-gray-600 font-bold cursor-not-allowed outline-none" 
          value={formData.work_date} 
          readOnly 
          title="작업일은 오늘 날짜로 고정됩니다."
        />
        
        <div className="border p-3 rounded bg-gray-50 flex items-center">
          <label className="text-sm font-bold text-gray-600 mr-4">📎 도면/지시서 첨부:</label>
          <input 
            type="file" 
            ref={fileInputRef} // 💡 생성한 ref를 여기에 연결
            onChange={e => setFile(e.target.files[0])} 
            className="text-sm"
          />
        </div>
        
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded">작업 지시 생성</button>
      </form>

      <TaskTable tasks={tasks} onApproveDelete={approveDelete} />
    </div>
  );
}
