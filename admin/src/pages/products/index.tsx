import { createSearchParams, useNavigate } from 'react-router-dom' // Dùng để tạo query string và điều hướng trang
import { memo, useEffect, useState } from 'react' // React hooks và tối ưu component

import FomrProduct from './components/form/form-product' // Form thêm/sửa sản phẩm
import MainProduct from './components/main-product' // Component hiển thị danh sách sản phẩm
import Navbar from '@/components/navbar' // Thanh navbar có ô tìm kiếm và nút thêm
import { TProduct } from '@/types/product.type' // Kiểu dữ liệu sản phẩm
import { TResponse } from '@/types/common.type' // Kiểu dữ liệu phản hồi API
import { Tabs } from 'antd' // Tabs từ thư viện Ant Design
import type { TabsProps } from 'antd' // Kiểu props cho Tabs
import _ from 'lodash' // Thư viện hỗ trợ thao tác object
import { getProducts } from '@/apis/product.api' // Hàm gọi API lấy sản phẩm
import { useAuth } from '@/contexts/auth-context' // Lấy accessToken từ context người dùng
import { useQuery } from '@tanstack/react-query' // Hook để fetch data từ API
import { useQueryParams } from '@/hooks/useQueryParams' // Hook lấy query string hiện tại trên URL
import { useToggleModal } from '@/hooks/useToggleModal' // Hook mở/đóng modal, có lưu state

const ProductPage = () => {
  const { accessToken } = useAuth() // Lấy token từ context (để gọi API có xác thực)

  const queryParams = useQueryParams() // Lấy query string hiện tại từ URL

  const [products, setProducts] = useState<TProduct[]>([]) // State lưu danh sách sản phẩm
  const navigate = useNavigate() // Dùng để điều hướng bằng code

  const { currentModal, onCloseModal, onOpenModal } = useToggleModal<TProduct>() // Quản lý modal và dữ liệu bên trong

  // useQuery gọi API lấy sản phẩm và quản lý trạng thái (loading, error, data)
  const { data, isError, isLoading, isSuccess, isFetching, refetch } = useQuery<TResponse<TProduct>, Error>({
    queryKey: ['products', queryParams], // Key cache theo query string
    queryFn: () => getProducts(accessToken, queryParams), // Hàm gọi API
    keepPreviousData: true // Giữ lại data cũ khi query thay đổi để tránh nháy UI
  })

  useEffect(() => {
    if (isSuccess) {
      setProducts(data.docs) // Khi có data, cập nhật state products
    }
  }, [isSuccess, data]) // Chạy lại khi isSuccess hoặc data thay đổi

  const [inputValue, setInputValue] = useState<string>('') // State input tìm kiếm

  const handleSearch = (value: string) => {
    setInputValue(value) // Cập nhật giá trị ô tìm kiếm
    navigate({
      pathname: '/products',
      search: createSearchParams({
        ...queryParams,
        _page: '1',
        q: value // Gắn giá trị tìm kiếm vào query string
      }).toString()
    })
  }

  const handleChangeTab = (key: string) => {
    // Xử lý chuyển tab => cập nhật lại URL tương ứng với từng trạng thái sản phẩm
    switch (key) {
      case '1':
        navigate({
          pathname: '/products',
          search: createSearchParams({
            _page: '1',
            _limit: '8',
            tab: key
          }).toString()
        })
        break
      case '2':
        navigate({
          pathname: '/products',
          search: createSearchParams({
            ...queryParams,
            _page: '1',
            status: 'active',
            deleted: 'false',
            tab: key
          }).toString()
        })
        break
      case '3':
        navigate({
          pathname: '/products',
          search: createSearchParams({
            ...queryParams,
            _page: '1',
            status: 'inactive',
            deleted: 'false',
            tab: key
          }).toString()
        })
        break
      case '4': {
        const newQueryParams = _.omit(queryParams, 'status') // Xoá trường "status" khỏi query nếu có
        navigate({
          pathname: '/products',
          search: createSearchParams({
            ...newQueryParams,
            _page: '1',
            deleted: 'true',
            tab: key
          }).toString()
        })
        break
      }
      default:
        navigate({
          pathname: '/products',
          search: createSearchParams({
            ...queryParams,
            _page: '1',
            deleted: 'true',
            tab: key
          }).toString()
        })
        break
    }
  }

  useEffect(() => {
    if (queryParams.q) {
      setInputValue(queryParams.q) // Nếu có query "q" trên URL thì gán vào ô tìm kiếm
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Chạy 1 lần khi load component

  if (isError) {
    return <div>Error</div> // Nếu lỗi gọi API
  }

  if (isLoading) {
    return <div>Loading...</div> // Nếu đang tải dữ liệu lần đầu
  }

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Tất cả sản phẩm',
      children: (
        <MainProduct
          totalDocs={data.totalDocs}
          isLoading={isFetching || isLoading}
          products={products}
          getData={onOpenModal} // Dùng để mở form edit khi click item
        />
      )
    },
    {
      key: '2',
      label: 'Sản phẩm đang hoạt động',
      children: <MainProduct totalDocs={data.totalDocs} isLoading={isFetching || isLoading} products={products} />
    },
    {
      key: '3',
      label: 'Sản phẩm không hoạt động',
      children: <MainProduct totalDocs={data.totalDocs} isLoading={isFetching || isLoading} products={products} />
    },
    {
      key: '4',
      label: 'Sản phẩm đã xoá',
      children: <MainProduct totalDocs={data.totalDocs} isLoading={isFetching || isLoading} products={products} />
    }
  ] // Danh sách các tab và nội dung bên trong

  return (
    <div className='bg-gray-third py-[30px] px-[30px] '>
      <Navbar
        button={{
          title: 'Thêm sản phẩm', // Nút thêm sản phẩm
          size: 'large',
          className: 'bg-[#14532D] text-white border-[#14532D] hover:bg-[#14532D]',
          onClick: () => onOpenModal('add') // Mở form modal để thêm sản phẩm mới
        }}
        input={{
          placeholder: 'Search for product', // Input tìm kiếm
          onSearch: (value) => handleSearch(value), // Gọi khi bấm enter hoặc icon tìm
          value: inputValue, // Giá trị ô tìm kiếm
          onChange: (value) => setInputValue(value) // Gán lại input
        }}
      />

      <div>
        <Tabs defaultActiveKey={queryParams.tab || '1'} items={items} onChange={(value) => handleChangeTab(value)} />
        {/* Hiển thị tab sản phẩm tương ứng với trạng thái */}
      </div>

      {/* form add/edit product nằm ở cuối, luôn sẵn sàng hiển thị */}
      <FomrProduct currentData={currentModal} onClose={onCloseModal} refetch={refetch} />
    </div>
  )
}

export default memo(ProductPage) // Dùng memo để tránh render lại nếu props không đổi
