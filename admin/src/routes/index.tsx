import AuthLayout from '@/layouts/auth-layout' // Nhập layout cho các trang xác thực (login, register).
import CategoryPage from '@/pages/category'      // Nhập component trang quản lý Danh mục.
import HomePage from '@/pages'                   // Nhập component trang chủ (Dashboard).
import IconPage from '@/pages/icons'             // Nhập component trang xem các Icon.
import LoginPage from '@/pages/(authen)/login'   // Nhập component trang Đăng nhập.
import Messagers from '@/pages/messagers'        // Nhập component trang Tin nhắn.
import OrderPage from '@/pages/orders'           // Nhập component trang quản lý Đơn hàng.
import ProductDetail from '@/pages/products/[productId]' // Nhập component trang Chi tiết sản phẩm.
import ProductPage from '@/pages/products'       // Nhập component trang quản lý Sản phẩm.
import RootLayout from '@/layouts'               // Nhập layout chính cho các trang quản trị.
import { createBrowserRouter } from 'react-router-dom' // Nhập hàm để tạo bộ định tuyến từ react-router-dom.
import path from '@/configs/path'                // Nhập đối tượng chứa các hằng số đường dẫn (URL).
import BrandPage from '@/pages/brand'            // Nhập component trang quản lý Thương hiệu.
import VoucherPage from '@/pages/voucher'        // Nhập component trang quản lý Voucher.
import UserPage from '@/pages/users'             // Nhập component trang quản lý Người dùng.
import ProfileCard from '@/pages/profile/profile'// Nhập component trang Hồ sơ cá nhân.

// Sử dụng createBrowserRouter để định nghĩa "bản đồ" cho toàn bộ ứng dụng.
const routes = createBrowserRouter([
  // 1. Route đơn lẻ, không có layout chung.
  {
    path: path.icons, // Đường dẫn đến trang icons.
    element: <IconPage /> // Component sẽ được hiển thị.
  },
  // 2. Nhóm các route chính của trang quản trị, sử dụng RootLayout.
  {
    path: path.home, // Đường dẫn gốc, thường là '/'.
    element: <RootLayout />, // Component Layout này sẽ "bọc" tất cả các trang con bên dưới.
    children: [ // Danh sách các trang con sẽ được hiển thị bên trong RootLayout.
      { index: true, element: <HomePage /> }, // 'index: true' nghĩa là đây là trang mặc định của layout này.
      { path: path.products, element: <ProductPage /> }, // Route cho trang quản lý sản phẩm.
      { path: path.orders, element: <OrderPage /> }, // Route cho trang quản lý đơn hàng.
      { path: path.productDetail, element: <ProductDetail /> }, // Route cho trang chi tiết sản phẩm.
      { path: path.category, element: <CategoryPage /> }, // Route cho trang quản lý danh mục.
      { path: path.brand, element: <BrandPage /> }, // Route cho trang quản lý thương hiệu.
      { path: path.messagers, element: <Messagers /> }, // Route cho trang tin nhắn.
      { path: path.voucher, element: <VoucherPage /> }, // Route cho trang quản lý voucher.
      { path: path.users, element: <UserPage /> }, // Route cho trang quản lý người dùng.
      { path: path.profile, element: <ProfileCard /> } // Route cho trang hồ sơ.
    ]
  },
  // 3. Nhóm các route xác thực, sử dụng AuthLayout.
  {
    path: path.auth, // Đường dẫn gốc cho các trang xác thực, ví dụ '/auth'.
    element: <AuthLayout />, // Layout này sẽ "bọc" các trang con như Login, Register.
    children: [{ path: path.login, element: <LoginPage /> }] // Route cho trang đăng nhập.
  }
])

export default routes // Xuất cấu hình router để sử dụng trong file App.tsx.