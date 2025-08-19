import { ArrowDownSmallIcon, BarsIcon, GlassesIcon } from '@/components/icons' // Nhập các component icon tùy chỉnh của dự án.
import { useAppDispatch, useAppSelector } from '@/stores/hooks' // Nhập các hook đã được gán kiểu cho Redux (dispatch và selector).
import { Dropdown, Form, Input, Space } from 'antd' // Nhập các component giao diện từ thư viện Ant Design.

import { useLanguage } from '@/contexts/language-context' // Nhập hook để sử dụng Language Context.
import { setLanguage as setLanguageRedux } from '@/stores/slices/language.slice' // Nhập action creator để thay đổi ngôn ngữ trong Redux.
import { RootState } from '@/stores/store' // Nhập kiểu dữ liệu (type) của Redux state.
import { useTranslation } from 'react-i18next' // Nhập hook từ thư viện i18next để sử dụng chức năng dịch thuật.
import InfoUser from './info-user' // Nhập component hiển thị thông tin người dùng (avatar, tên...).
import { itemsLanguage } from './init' // Nhập hàm khởi tạo các mục trong dropdown chọn ngôn ngữ.
import Notification from './notification' // Nhập component hiển thị thông báo.
// import { useNavigate } from 'react-router-dom'

const Header = () => {
  // Bắt đầu định nghĩa component Header.
  const { t } = useTranslation() // Lấy hàm 't' để dịch các chuỗi văn bản.
  const { language } = useAppSelector((state: RootState) => state.language) // Lấy state ngôn ngữ hiện tại từ Redux store.
  const { setLanguage } = useLanguage() // Lấy hàm setLanguage từ Language Context.
  const dispath = useAppDispatch() // Lấy hàm dispatch của Redux để gửi action.
  const items = itemsLanguage(t) // Tạo danh sách các mục cho dropdown ngôn ngữ, có truyền hàm `t` để dịch.

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDropdownItemClick = (e: any) => {
    // Hàm xử lý sự kiện khi một mục trong dropdown ngôn ngữ được click.
    const key = e.key // Lấy 'key' của mục được click (ví dụ: 'vi' hoặc 'en').
    setLanguage(key) // Cập nhật ngôn ngữ trong Language Context.
    dispath(setLanguageRedux(key)) // Gửi action để cập nhật ngôn ngữ trong Redux store.
  }

  return (
    // Bắt đầu phần JSX để render giao diện.
    <div className='flex justify-between w-full'>
      {' '}
      {/* Container chính của header, chia làm 2 bên trái/phải. */}
      <div className='flex items-center gap-6'>
        {' '}
        {/* Phần bên trái của header. */}
        <button>
          {' '}
          {/* Nút này có thể dùng để đóng/mở sidebar trên giao diện mobile. */}
          <BarsIcon className='fill-black size-[22px]' />
        </button>
        <Form>
          {' '}
          {/* Form chứa ô tìm kiếm sản phẩm. */}
          <Form.Item name={'product'} className='!mb-0'>
            <Input
              className='rounded-[20px] !bg-gray-third border border-gray-fourth h-[38px] !text-sm w-[388px] focus-within:border-gray-fourth flex-shrink-0 focus:border-gray-fourth hover:border-gray-fourth focus:ring-0'
              prefix={<GlassesIcon className='stroke-gray-fifth' />} // Icon kính lúp bên trong ô input.
              placeholder='Search'
            />
          </Form.Item>
        </Form>
      </div>
      <div className='flex items-center gap-6'>
        {' '}
        {/* Phần bên phải của header. */}
        <Notification /> {/* Component chuông thông báo. */}
        <Dropdown menu={{ items, onClick: (e) => handleDropdownItemClick(e) }}>
          {' '}
          {/* Component Dropdown để chuyển đổi ngôn ngữ. */}
          <button>
            <Space>
              {' '}
              {/* Component Space của AntD để tạo khoảng cách giữa các phần tử. */}
              {language === 'vi' ? t('languages.vi') : t('languages.en')}{' '}
              {/* Hiển thị ngôn ngữ hiện tại đã được dịch. */}
              <ArrowDownSmallIcon height={6} width={10} className='mt-1' /> {/* Icon mũi tên xuống. */}
            </Space>
          </button>
        </Dropdown>
        <InfoUser /> {/* Component hiển thị avatar và thông tin người dùng. */}
      </div>
    </div>
  )
}

export default Header // Xuất component Header để các file khác có thể sử dụng.
