import { useState, useEffect } from 'react';

export default function Admin() {
  const [tasks, setTasks] = useState([]);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', work_date: '' });

  const fetchTasks = async () => {
    const res = await fetch('/api/tasks');
    setTasks(await res.json());
  };

  useEffect(() => {
    fetchTasks();
    const timer = setInterval(fetchTasks, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let attachment_url = "";

    // 1. 파일이 있으면 먼저 업로드
    if (file) {
      const fb = new FormData();
      fb.append('file', file);
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: fb });
      const uploadData = await uploadRes.json();
      attachment_url = uploadData.url;
    }

    // 2. 작업 생성
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, attachment_url }),
    });
    alert("작업 지시 완료");
    setFormData({ title: '', content: '', work_date: '' });
    setFile(null);
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
      
      {/* 작업 생성 폼 */}
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded-lg mb-10 flex flex-col gap-3">
        <input type="text" placeholder="제목" required className="border p-2" value={formData.title} onChange={e=>setFormData({...formData, title:e.target.value})} />
        <textarea placeholder="내용" className="border p-2" value={formData.content} onChange={e=>setFormData({...formData, content:e.target.value})} />
        <input type="date" className="border p-2" value={formData.work_date} onChange={e=>setFormData({...formData, work_date:e.target.value})} />
        <input type="file" onChange={e => setFile(e.target.files[0])} className="border p-1" />
        <button className="bg-blue-600 text-white p-2 rounded">작업 지시 생성</button>
      </form>

      {/* 삭제 승인 대기 목록 */}
      <h2 className="text-xl font-bold text-red-600 mb-2">⚠️ 삭제 승인 대기</h2>
      <div className="bg-red-50 p-4 rounded-lg mb-10">
        {tasks.filter(t => t.delete_requested === 1).map(t => (
          <div key={t.id} className="flex justify-between items-center border-b py-2">
            <span>{t.title} (현장 삭제 요청됨)</span>
            <button onClick={() => approveDelete(t.id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">삭제 승인</button>
          </div>
        ))}
      </div>

      {/* 전체 목록 (TaskTable 컴포넌트 호출 등) */}
    </div>
  );
}
