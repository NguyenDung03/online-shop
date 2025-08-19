import { FloatButton, Layout } from 'antd' // Nhập các component giao diện từ thư viện Ant Design.
import { Link, Outlet } from 'react-router-dom' // Nhập component Link để điều hướng và Outlet để render các trang con.

import { CounterProvider } from '@/contexts/counter-context' // Nhập Provider cho context 'counter'.
import Header from './components/header' // Nhập component Header tùy chỉnh.
import Sidebar from './components/sidebar' // Nhập component Sidebar tùy chỉnh.

const RootLayout = () => {
  // Định nghĩa component Layout chính của trang quản trị.
  return (
    <Layout className='!h-screen'>
      {' '}
      {/* Thẻ Layout ngoài cùng, chiếm toàn bộ chiều cao màn hình. */}
      <Layout.Sider // Component Sidebar (thanh bên) của Ant Design.
        width={250} // Thiết lập chiều rộng của sidebar là 250px.
        className='!bg-white hidden lg:block' // CSS: nền trắng, ẩn trên màn hình nhỏ, hiện trên màn hình lớn (lg).
        style={{
          // CSS nội tuyến để tùy chỉnh sâu hơn.
          height: '100vh', // Chiều cao sidebar luôn bằng chiều cao của viewport.
          position: 'fixed', // Cố định vị trí sidebar, nó sẽ không bị cuộn theo trang.
          left: 0,
          top: 0,
          overflowY: 'auto' // Cho phép cuộn bên trong sidebar nếu nội dung quá dài.
        }}
      >
        <Sidebar /> {/* Render component Sidebar tùy chỉnh đã import ở trên. */}
      </Layout.Sider>
      {/* Phần Layout chính chứa Header và Content. */}
      <Layout
        style={{
          marginLeft: 250, // Đẩy phần nội dung sang phải một khoảng bằng chiều rộng của sidebar.
          minHeight: '100vh', // Đảm bảo chiều cao tối thiểu là full màn hình.
          overflow: 'auto' // Cho phép cuộn toàn bộ phần nội dung này.
        }}
      >
        <Layout.Header className='!bg-white !px-8'>
          {' '}
          {/* Component Header của Ant Design. */}
          <Header /> {/* Render component Header tùy chỉnh. */}
        </Layout.Header>
        <Layout.Content style={{ padding: 24 }}>
          {' '}
          {/* Component chứa nội dung chính của trang. */}
          <CounterProvider>
            {' '}
            {/* Bọc context Counter, chỉ các component bên trong mới dùng được. */}
            <Outlet />{' '}
            {/* Đây là vị trí quan trọng nhất: các trang con (HomePage, ProductPage...) sẽ được render ở đây. */}
            <Link to={`/messagers`}>
              {' '}
              {/* Bọc nút FloatButton bằng thẻ Link để khi click sẽ chuyển đến trang messagers. */}
              <FloatButton tooltip={<div>Documents</div>} /> {/* Nút nổi hiển thị ở góc màn hình. */}
            </Link>
          </CounterProvider>
        </Layout.Content>
      </Layout>
    </Layout>
  )
}

export default RootLayout // Xuất component để `routes.tsx` có thể sử dụng.
