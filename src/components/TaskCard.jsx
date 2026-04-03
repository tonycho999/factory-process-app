export default function TaskCard({ task, onStatusChange }) {
  return (
    <div className="border border-gray-300 rounded-xl p-5 shadow-sm bg-white flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold">{task.title}</h3>
          <span className="text-sm text-gray-500">{task.work_date}</span>
        </div>
        <p className="text-gray-700 mb-6 whitespace-pre-wrap">{task.content}</p>
      </div>

      <div className="flex justify-between items-center mt-4 border-t pt-4">
        <span className="font-bold text-gray-600">현재 상태: {task.status}</span>
        
        {/* 상태에 따른 동적 버튼 렌더링 */}
        <div className="flex gap-2">
          {task.status === '대기' && (
            <button 
              onClick={() => onStatusChange(task.id, '진행중')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              작업 내용 확인 (진행)
            </button>
          )}
          {task.status === '진행중' && (
            <button 
              onClick={() => onStatusChange(task.id, '완료')}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              작업 완료 처리
            </button>
          )}
          {task.status === '완료' && (
            <span className="text-green-600 font-bold py-2 px-4">✓ 완료됨</span>
          )}
        </div>
      </div>
    </div>
  );
}
