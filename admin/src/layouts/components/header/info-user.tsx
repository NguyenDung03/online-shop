import { itemUser } from './init' //  Nhập  hàm  'itemUser'  để  khởi  tạo  các  mục  trong  dropdown  của  người  dùng.

import { ArrowDownCircleIcon } from '@/components/icons' //  Nhập  component  icon  mũi  tên  xuống  tùy  chỉnh.
import { Dropdown } from 'antd' //  Nhập  component  Dropdown  từ  thư  viện  Ant  Design.
import { useTranslation } from 'react-i18next' //  Nhập  hook  để  sử  dụng  chức  năng  dịch  thuật.
import { useNavigate } from 'react-router-dom' //  Nhập  hook  để  lấy  hàm  điều  hướng  trang.

const InfoUser = () => {
  //  Bắt  đầu  định  nghĩa  component  InfoUser.
  const { t } = useTranslation() //  Lấy  hàm  't'  để  dịch.
  const navigate = useNavigate() //  Lấy  hàm  'navigate'  để  chuyển  trang.
  const items = itemUser(t, navigate) //  Gọi  hàm  'itemUser'  để  tạo  danh  sách  các  mục  cho  dropdown,  truyền  vào  hàm  't'  và  'navigate'.

  return (
    //  Bắt  đầu  phần  JSX  để  render  giao  diện.
    <Dropdown menu={{ items }}>
      {' '}
      {/*  Component  Dropdown  của  AntD,  nhận  các  mục  menu  đã  được  tạo  ở  trên.  */}
      <div className='flex  items-center  gap-4'>
        {' '}
        {/*  Phần  giao  diện  hiển  thị,  khi  click  vào  sẽ  hiện  dropdown.  */}
        <img
          alt='avt'
          src='https://picsum.photos/536/354' //  Ảnh  đại  diện  của  người  dùng,  hiện  đang  là  ảnh  placeholder.
          className='object-cover  size-[50px]  rounded-full  flex-shrink-0'
        />
        <div className='flex  flex-col  gap-1'>
          {' '}
          {/*  Khối  hiển  thị  tên  và  vai  trò  của  người  dùng.  */}
          <p className='text-sm  font-bold'>Moni Roy</p> {/*  Tên  người  dùng,  hiện  đang  được  hardcode.  */}
          <p className='text-xs  font-light'>Admin</p> {/*  Vai  trò,  hiện  đang  được  hardcode.  */}
        </div>
        <ArrowDownCircleIcon height={20} width={20} /> {/*  Icon  mũi  tên  chỉ  xuống.  */}
      </div>
    </Dropdown>
  )
}

export default InfoUser //  Xuất  component  InfoUser  để  các  file  khác  có  thể  sử  dụng.
