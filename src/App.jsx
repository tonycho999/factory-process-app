import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Admin from './pages/Admin';
import Worker from './pages/Worker';

export default function App() {
  return (
    <BrowserRouter>
      {/* 상단 네비게이션 */}
      <nav className="p-4 bg-gray-800 text-white flex gap-6">
        <Link to="/admin" className="font-bold hover:text-blue-300">관리자 (작업 지시)</Link>
        <Link to="/worker" className="font-bold hover:text-green-300">생산라인 (현장)</Link>
      </nav>

      {/* 화면 전환 영역 */}
      <main className="p-6">
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="/worker" element={<Worker />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
