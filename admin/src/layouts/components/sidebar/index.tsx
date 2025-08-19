import { Link, useLocation } from 'react-router-dom' // Nhập component Link để điều hướng và hook useLocation để lấy thông tin URL hiện tại.
import { useEffect, useState } from 'react' // Nhập các hook cơ bản của React.
import Logo from '@/assets/images/LogoProject.png' // Nhập file ảnh logo của dự án.
import { Menu } from 'antd' // Nhập component Menu từ thư viện Ant Design.
import { cn } from '@/utils/cn' // Nhập hàm tiện ích 'cn' để nối các class CSS có điều kiện.
import { menus } from './menu' // Nhập dữ liệu (cấu hình) cho các mục trong menu.

const Sidebar = () => {
  const location = useLocation() // Lấy thông tin về địa chỉ URL hiện tại.
  const pathName = location.pathname // Trích xuất đường dẫn từ URL (ví dụ: '/products').

  const [activeSidebar, setActiveSidebar] = useState<number>(1) // Tạo một state để theo dõi mục menu nào đang được chọn (active).

  useEffect(() => {
    // Hook này sẽ chạy 1 lần duy nhất khi component được render lần đầu.
    const menuIndex = menus.findIndex((menu) => menu.link === pathName) // Tìm index của mục menu có đường dẫn trùng với URL hiện tại.
    setActiveSidebar(menuIndex + 1) // Cập nhật state active để làm nổi bật mục menu tương ứng.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Mảng rỗng `[]` đảm bảo effect chỉ chạy 1 lần.

  return (
    <div
      className='h-screen border-r border-r-gray-light scrollbar-hide' // Container chính của sidebar.
      style={{ overflowY: 'auto', position: 'sticky', top: 0 }} // Cho phép cuộn và giữ sidebar ở vị trí cố định trên cùng.
    >
      <section className='flex items-center justify-center w-full h-header'>
        {' '}
        {/* Phần hiển thị logo ở trên cùng. */}
        <div className='h-16 w-32 font-semibold flex items-center justify-center text-3xl'>
          <div className='text-xl'>
            <img src={Logo} alt='' /> {/* Hiển thị ảnh logo. */}
          </div>
        </div>
      </section>

      {/* menu */}
      <Menu defaultSelectedKeys={['1']} defaultOpenKeys={['sub1']} mode='inline' className='mt-5'>
        {' '}
        {/* Component Menu của AntD. */}
        {menus.map(
          (
            menu,
            index // Lặp qua mảng dữ liệu 'menus' để render ra từng mục menu.
          ) => (
            <Menu.Item
              className='relative !rounded-none !bg-white w-full'
              key={menu.id} // Key là bắt buộc và duy nhất cho mỗi phần tử trong vòng lặp.
              onClick={() => setActiveSidebar(index + 1)} // Khi click vào một mục, cập nhật lại state active.
            >
              <Link to={menu.link} className='flex items-center justify-center w-full h-full'>
                {' '}
                {/* Bọc mỗi mục bằng thẻ Link để điều hướng. */}
                {/* Đây là vạch màu xanh bên trái để chỉ thị mục đang active. */}
                <div
                  className={cn('absolute top-0 bottom-0 left-0 w-1 h-full rounded-r-md', {
                    // Hàm 'cn' nối class.
                    'bg-green-900': activeSidebar === index + 1 // Class 'bg-green-900' chỉ được áp dụng khi mục này active.
                  })}
                ></div>
                {/* Đây là phần thân chính của mục menu. */}
                <div
                  className={cn('w-full px-4 rounded-md text-black flex items-center !gap-3 fill-black', {
                    // Hàm 'cn' nối class.
                    'text-white bg-green-900 fill-white': activeSidebar === index + 1 // Các class này chỉ được áp dụng khi mục này active.
                  })}
                >
                  {menu.icon} {/* Hiển thị icon của mục menu. */}
                  <span className='!mx-0 text-inherit'>{menu.title}</span> {/* Hiển thị tiêu đề của mục menu. */}
                </div>
              </Link>
            </Menu.Item>
          )
        )}
      </Menu>
    </div>
  )
}

export default Sidebar
