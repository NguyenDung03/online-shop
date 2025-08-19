import { TModalType, TQueryParams } from '@/types/common.type' // Import các kiểu dữ liệu dùng chung
import { useMutation, useQueryClient } from '@tanstack/react-query' // Hook để thao tác với dữ liệu bất đồng bộ
import { Table, notification } from 'antd' // Import Table và notification từ Ant Design
import { createSearchParams, useNavigate } from 'react-router-dom' // Dùng để điều hướng và tạo query string

import { deleteProduct, softDeleteMultipleProduct, softDeleteProduct } from '@/apis/product.api' // Các hàm API thao tác với sản phẩm
import DeleteTable from '@/components/delete-table' // Component xác nhận xoá
import { useAuth } from '@/contexts/auth-context' // Hook lấy thông tin xác thực
import { useQueryParams } from '@/hooks/useQueryParams' // Hook lấy query params từ URL
import { useToggleModal } from '@/hooks/useToggleModal' // Hook quản lý trạng thái modal
import { TProduct } from '@/types/product.type' // Kiểu dữ liệu sản phẩm
import { useState } from 'react' // Hook quản lý state
import FomrProduct from './form/form-product' // Component form sản phẩm (có thể bị typo: FomrProduct -> FormProduct)
import ColumnsTable from './table/columns-table' // Hàm tạo cấu hình cột cho bảng

interface MainProductProps {
  products: TProduct[] // Danh sách sản phẩm
  totalDocs: number // Tổng số sản phẩm
  isLoading?: boolean // Trạng thái loading
  getData?: (type: TModalType, data?: TProduct) => void // Hàm lấy dữ liệu (nếu có)
}

const MainProduct = ({ products, isLoading, getData, totalDocs }: MainProductProps) => {
  const navigate = useNavigate() // Hook điều hướng

  const queryClient = useQueryClient() // Lấy queryClient để invalidate cache
  const queryParams: TQueryParams = useQueryParams() // Lấy params từ URL
  const { _limit, _page } = queryParams // Lấy limit và page từ params

  const { accessToken } = useAuth() // Lấy accessToken từ context

  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false) // State mở modal xoá
  const [rowSelections, setRowSelections] = useState<TProduct[]>([]) // State lưu các sản phẩm được chọn
  const [product, setProduct] = useState<TProduct>() // State lưu sản phẩm đang thao tác
  const { currentModal, onCloseModal, onOpenModal } = useToggleModal<TProduct>() // Quản lý modal chi tiết/sửa

  // Mutation xoá nhiều sản phẩm (soft delete hoặc restore)
  const deleteMultipleMutation = useMutation({
    mutationKey: ['deleteMultipleProduct'], // Key cho mutation
    mutationFn: (params: { id: string | string[]; is_deleted?: boolean }) =>
      softDeleteMultipleProduct(params, accessToken), // Gọi API soft delete nhiều sản phẩm
    onSuccess: (data) => {
      const isCheckRestore = data.message === 'Restore product success!' // Kiểm tra có phải là restore không
      notification.success({
        message: `${isCheckRestore ? 'Khôi phục' : 'Xoá'} sản phẩm thành công`,
        description: `Sản phẩm đã được ${isCheckRestore ? 'khôi phục thành công' : 'xoá vào thùng rác'}`
      })
      queryClient.invalidateQueries({ queryKey: ['products', queryParams] }) // Làm mới dữ liệu sản phẩm
    },
    onError: () => {
      notification.error({
        message: 'Thao tác thất bại!',
        description: 'Có lỗi xảy ra khi xử lý sản phẩm'
      })
    }
  })

  // Hàm xử lý xoá/khôi phục sản phẩm (1 hoặc nhiều)
  const handleDelete = (values: TProduct[] | TProduct, is_deleted?: boolean) => {
    if (Array.isArray(values)) {
      // Nếu là mảng => thao tác nhiều sản phẩm (chỉ hỗ trợ restore nhiều)
      const ids = values.map((item) => item._id)
      deleteMultipleMutation.mutate({ id: ids, is_deleted: false }) // Gọi mutation khôi phục nhiều sản phẩm
    } else {
      const { _id, is_deleted: currentIsDeleted } = values

      if (is_deleted === true && currentIsDeleted) {
        // Nếu sản phẩm đã bị xoá mềm và muốn xoá vĩnh viễn
        deleteProduct(_id, accessToken)
          .then(() => {
            notification.success({
              message: 'Đã xóa vĩnh viễn sản phẩm!',
              description: 'Sản phẩm đã bị xóa vĩnh viễn.'
            })
            queryClient.invalidateQueries({ queryKey: ['products', queryParams] })
          })
          .catch(() => {
            notification.error({
              message: 'Xóa vĩnh viễn sản phẩm không thành công',
              description: 'Có lỗi xảy ra khi xóa vĩnh viễn sản phẩm.'
            })
          })
      } else if (is_deleted === false && currentIsDeleted) {
        // Nếu sản phẩm đã bị xoá mềm và muốn khôi phục
        softDeleteProduct(_id, accessToken)
          .then(() => {
            notification.success({
              message: 'Đã khôi phục sản phẩm!',
              description: 'Sản phẩm đã được khôi phục từ thùng rác.'
            })
            queryClient.invalidateQueries({ queryKey: ['products', queryParams] })
          })
          .catch(() => {
            notification.error({
              message: 'Khôi phục sản phẩm thất bại!',
              description: 'Đã có lỗi xảy ra khi khôi phục sản phẩm.'
            })
          })
      } else if (is_deleted === true && !currentIsDeleted) {
        // Nếu sản phẩm chưa bị xoá mềm và muốn xoá mềm
        softDeleteProduct(_id, accessToken)
          .then(() => {
            notification.success({
              message: 'Đã chuyển sản phẩm vào thùng rác!',
              description: 'Sản phẩm đã bị chuyển vào thùng rác.'
            })
            queryClient.invalidateQueries({ queryKey: ['products', queryParams] })
          })
          .catch(() => {
            notification.error({
              message: 'Xóa mềm sản phẩm thất bại!',
              description: 'Đã có lỗi xảy ra khi chuyển sản phẩm vào thùng rác.'
            })
          })
      }
    }
  }

  // Cấu hình chọn dòng trong bảng
  const rowSelection = {
    onChange: (_: React.Key[], selectedRows: TProduct[]) => {
      setRowSelections(selectedRows) // Lưu các dòng được chọn vào state
    }
  }

  // Lấy cấu hình cột cho bảng, truyền các hàm xử lý vào
  const columns = ColumnsTable({
    onDelete: handleDelete,
    setOpenModalDelete,
    onDetail: setProduct,
    rowSelections,
    getData,
    onOpenModal
  })

  return (
    <div className=''>
      <Table
        loading={isLoading} // Hiển thị loading khi đang tải dữ liệu
        rowKey={(record) => record._id} // Khóa chính của mỗi dòng là _id
        dataSource={products} // Dữ liệu bảng là danh sách sản phẩm
        rowSelection={{
          type: 'checkbox',
          ...rowSelection // Cho phép chọn nhiều dòng
        }}
        columns={columns} // Cấu hình cột
        pagination={{
          current: Number(_page) || 1, // Trang hiện tại
          pageSize: Number(_limit) || 8, // Số sản phẩm mỗi trang
          total: totalDocs, // Tổng số sản phẩm
          onChange: (page, pageSize) => {
            // Khi chuyển trang, cập nhật URL với page và limit mới
            navigate({
              pathname: '/products',
              search: createSearchParams({
                _page: page.toString(),
                _limit: pageSize.toString()
              }).toString()
            })
          },
          showTotal(total, range) {
            // Hiển thị tổng số sản phẩm và khoảng đang xem
            return (
              <div className='flex items-center justify-between w-full mr-auto text-black-second'>
                Hiển thị {range[0]}-{range[1]} sản phẩm của tổng {total} sản phẩm
              </div>
            )
          }
        }}
      />
      <FomrProduct currentData={currentModal} onClose={onCloseModal} /> {/* Modal form sản phẩm */}
      <DeleteTable
        handleDelete={(values, is_deleted) => handleDelete(values, is_deleted)} // Hàm xử lý xoá
        openModalDelete={openModalDelete} // Trạng thái mở modal xoá
        rowSelections={rowSelections} // Các sản phẩm được chọn
        setOpenModalDelete={setOpenModalDelete} // Hàm đóng/mở modal xoá
        selectionSingle={product} // Sản phẩm đang thao tác (nếu chỉ chọn 1)
        text={{
          title: 'Xoá sản phẩm',
          content: 'Bạn có chắc chắn muốn xoá sản phẩm này không? Hành động này không thể hoàn tác?'
        }}
        type={queryParams?.deleted === 'true' ? 'restore' : 'delete'} // Loại thao tác: xoá hay khôi phục
      />
    </div>
  )
}

export default MainProduct // Xuất component
