import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Admin from './pages/Admin';
import Worker from './pages/Worker';

export default function App() {
  return (
    <BrowserRouter>
      {/* 메뉴바(nav)가 완전히 삭제되었습니다. URL로만 접근 가능합니다. */}
      <main className="p-6">
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="/worker" element={<Worker />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
