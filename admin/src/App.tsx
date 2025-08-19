// style react quill
import 'react-quill/dist/quill.snow.css'        // Nhập file CSS để trình soạn thảo văn bản (React Quill) hiển thị đẹp.

import { RouterProvider } from 'react-router-dom'   // Component từ thư viện React Router để quản lý các đường dẫn (route).
import { AuthProvider } from './contexts/auth-context' // Provider do bạn tạo, cung cấp thông tin đăng nhập cho toàn ứng dụng.
import { LanguageProvider } from './contexts/language-context' // Provider do bạn tạo, cung cấp thông tin ngôn ngữ.
import routes from './routes'                       // Nhập đối tượng chứa tất cả cấu hình route của web.
import { useAppSelector } from './stores/hooks'     // Hook của Redux để lấy dữ liệu từ state.
import { RootState } from './stores/store'          // Kiểu dữ liệu (TypeScript) mô tả toàn bộ state của Redux.

function App() {
  // Lấy dữ liệu từ Redux store bằng hook `useAppSelector`.
  const { language } = useAppSelector((state: RootState) => state.language) // Lấy state ngôn ngữ.
  const { accessToken } = useAppSelector((state: RootState) => state.auth)   // Lấy state token xác thực.

  return (
    // "Bọc" các Provider theo cấu trúc lồng nhau.
    <LanguageProvider languageLocal={language}>      {/* Lớp ngoài: Cung cấp context ngôn ngữ cho toàn bộ ứng dụng. */}
      <AuthProvider token={accessToken}>            {/* Lớp giữa: Cung cấp context xác thực người dùng. */}
        <RouterProvider router={routes} />          {/* Lớp trong cùng: Hiển thị trang tương ứng với URL hiện tại. */}
      </AuthProvider>
    </LanguageProvider>
  )
}
export default App // Xuất component `App` để các file khác (như main.tsx) có thể import và sử dụng.