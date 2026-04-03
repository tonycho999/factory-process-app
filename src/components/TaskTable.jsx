export default function TaskTable({ tasks }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-3">작업일</th>
            <th className="border p-3">제목</th>
            <th className="border p-3">내용</th>
            <th className="border p-3 text-center">상태</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className="hover:bg-gray-50">
              <td className="border p-3">{task.work_date}</td>
              <td className="border p-3 font-semibold">{task.title}</td>
              <td className="border p-3 text-gray-600">{task.content}</td>
              <td className="border p-3 text-center">
                <span className={`px-2 py-1 rounded font-bold text-sm ${
                  task.status === '대기' ? 'bg-yellow-100 text-yellow-800' :
                  task.status === '진행중' ? 'bg-blue-100 text-blue-800' : 
                  'bg-green-100 text-green-800'
                }`}>
                  {task.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
