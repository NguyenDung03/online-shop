import {
  // Nhập các component icon từ thư viện Ant Design.
  AppstoreOutlined,
  ShoppingCartOutlined,
  GiftOutlined,
  ShoppingOutlined,
  TagsOutlined,
  UserOutlined
} from '@ant-design/icons'
import { DashboardIcon } from '@/components/icons' // Nhập một component icon tùy chỉnh của dự án.
import path from '@/configs/path' // Nhập đối tượng chứa các hằng số đường dẫn (URL).

// Xuất ra một mảng hằng số 'menus'. Mảng này chính là nguồn dữ liệu cho thanh sidebar.
export const menus = [
  // Mỗi object trong mảng đại diện cho một mục trong menu.
  {
    id: 1, // Mã định danh duy nhất, dùng làm 'key' trong React.
    title: 'Thống kê ', // Tiêu đề hiển thị trên giao diện.
    icon: <DashboardIcon className='fill-inherit' />, // Component icon sẽ được hiển thị.
    link: path.home // Đường dẫn sẽ được điều hướng tới khi click, lấy từ file config.
  },
  {
    id: 2,
    title: 'Các đơn hàng',
    icon: <ShoppingCartOutlined />,
    link: path.orders
  },
  {
    id: 3,
    title: 'Sản phẩm',
    icon: <ShoppingOutlined />,
    link: path.products
  },
  {
    id: 4,
    title: 'Danh mục sản phẩm',
    icon: <AppstoreOutlined />,
    link: path.category
  },
  {
    id: 5,
    title: 'Thương hiệu',
    icon: <TagsOutlined />,
    link: path.brand
  },
  {
    id: 6,
    title: 'Khuyến mãi',
    icon: <GiftOutlined />,
    link: path.voucher
  },
  {
    id: 7,
    title: 'Người dùng',
    icon: <UserOutlined />,
    link: path.users
  }
]
