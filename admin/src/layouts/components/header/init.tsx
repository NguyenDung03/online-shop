import path from '@/configs/path' //  Nhập  đối  tượng  chứa  các  hằng  số  đường  dẫn.
import { MenuProps } from 'antd' //  Nhập  kiểu  dữ  liệu  (type)  cho  props  của  component  Menu  từ  Ant  Design.
import { TFunction } from 'i18next' //  Nhập  kiểu  dữ  liệu  cho  hàm  dịch  't'  từ  i18next.
import { useNavigate } from 'react-router-dom' //  Nhập  hook  để  lấy  hàm  điều  hướng.

//  Hàm  này  tạo  ra  các  mục  cho  dropdown  chọn  ngôn  ngữ.
export const itemsLanguage = (t: TFunction) => {
  const items: MenuProps['items'] = [
    //  Khai  báo  một  mảng  các  mục  menu  theo  đúng  kiểu  của  AntD.
    {
      key: 'en', //  'key'  là  giá  trị  định  danh,  sẽ  được  dùng  để  xử  lý  logic  (ví  dụ:  'en'  cho  tiếng  Anh).
      label: <p className=''>{t('languages.en')}</p> //  'label'  là  nội  dung  hiển  thị,  được  dịch  ra  từ  key  'languages.en'.
    },
    {
      key: 'vi', //  Tương  tự,  'vi'  cho  tiếng  Việt.
      label: <p className=''>{t('languages.vi')}</p> //  Dịch  ra  từ  key  'languages.vi'.
    }
  ]

  return items //  Trả  về  mảng  các  mục  menu  đã  được  cấu  hình.
}

//  Hàm  này  tạo  ra  các  mục  cho  dropdown  của  người  dùng  (profile,  logout...).
export const itemUser = (t: TFunction, navigate: ReturnType<typeof useNavigate>) => {
  const itemsUser: MenuProps['items'] = [
    //  Khai  báo  mảng  các  mục  menu  người  dùng.
    {
      key: '1', //  Key  định  danh  cho  mục  "Profile".
      onClick: () => navigate(`${path.profile}`), //  Khi  click,  gọi  hàm  navigate  để  chuyển  đến  trang  hồ  sơ.
      label: <p className=''>{t('userMenu.profile')}</p> //  Nhãn  hiển  thị,  được  dịch  từ  key  'userMenu.profile'.
    },
    {
      key: '2', //  Key  định  danh  cho  mục  "Logout".
      label: <p className=''>{t('userMenu.logout')}</p> //  Nhãn  hiển  thị,  được  dịch  từ  key  'userMenu.logout'.
      //  Lưu  ý:  Mục  này  chưa  có  hàm  onClick,  vì  vậy  nó  sẽ  không  làm  gì  khi  được  nhấn.
    }
  ]

  return itemsUser //  Trả  về  mảng  các  mục  menu  người  dùng.
}
