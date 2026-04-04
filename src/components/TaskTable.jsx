export default function TaskTable({ tasks, onApproveDelete }) {
  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="w-full text-left border-collapse bg-white">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="p-4 border-b">작업일</th>
            <th className="p-4 border-b">제목</th>
            <th className="p-4 border-b">내용</th>
            <th className="p-4 border-b text-center">상태</th>
            <th className="p-4 border-b text-center">관리</th> {/* 💡 관리 열 추가 */}
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className={`border-b hover:bg-gray-50 ${task.delete_requested === 1 ? 'bg-red-50' : ''}`}>
              <td className="p-4">{task.work_date}</td>
              <td className="p-4 font-semibold">
                {task.title}
                {/* 관리자 표에서도 첨부파일 확인 가능하도록 링크 제공 */}
                {task.attachment_url && (
                  <a href={task.attachment_url} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-500 text-xs underline">
                    [첨부파일]
                  </a>
                )}
              </td>
              <td className="p-4 text-gray-600 whitespace-pre-wrap">{task.content}</td>
              <td className="p-4 text-center">
                <span className={`px-2 py-1 rounded font-bold text-sm ${
                  task.status === '대기' ? 'bg-yellow-100 text-yellow-800' :
                  task.status === '진행중' ? 'bg-blue-100 text-blue-800' : 
                  'bg-green-100 text-green-800'
                }`}>
                  {task.status}
                </span>
              </td>
              <td className="p-4 text-center">
                {/* 💡 현장에서 삭제 요청이 들어왔을 때만 버튼 활성화 */}
                {task.delete_requested === 1 ? (
                  <button 
                    onClick={() => onApproveDelete(task.id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm animate-pulse"
                  >
                    삭제 승인
                  </button>
                ) : (
                  <span className="text-gray-400 text-sm">-</span>
                )}
              </td>
            </tr>
          ))}
          {tasks.length === 0 && (
            <tr>
              <td colSpan="5" className="p-6 text-center text-gray-500">등록된 작업이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
