export default function TaskCard({ task, onStatusChange, onRequestDelete }) {
  return (
    <div className="border border-gray-300 rounded-xl p-5 shadow-sm bg-white flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold">{task.title}</h3>
          <span className="text-sm text-gray-500">{task.work_date}</span>
        </div>
        <p className="text-gray-700 mb-4 whitespace-pre-wrap">{task.content}</p>
        
        {/* 첨부파일이 있을 경우 다운로드 링크 표시 */}
        {task.attachment_url && (
          <div className="mb-4">
            <a 
              href={task.attachment_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 text-sm font-semibold underline"
            >
              📎 첨부파일 보기
            </a>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-4 border-t pt-4">
        <span className="font-bold text-gray-600">상태: {task.status}</span>
        
        <div className="flex gap-2 items-center">
          {task.status === '대기' && (
            <button 
              onClick={() => onStatusChange(task.id, '진행중')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              작업 진행
            </button>
          )}
          
          {task.status === '진행중' && (
            <button 
              onClick={() => onStatusChange(task.id, '완료')}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              작업 완료
            </button>
          )}
          
          {task.status === '완료' && (
            <>
              <span className="text-green-600 font-bold py-2 px-2">✓ 완료됨</span>
              
              {/* 삭제 요청 관련 UI 처리 */}
              {task.delete_requested === 0 ? (
                <button 
                  onClick={() => onRequestDelete(task.id)}
                  className="bg-red-100 hover:bg-red-200 text-red-600 text-xs font-bold py-1 px-2 rounded"
                >
                  삭제 요청
                </button>
              ) : (
                <span className="text-xs text-red-500 italic bg-red-50 p-1 rounded">삭제 승인 대기중</span>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
