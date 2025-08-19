import {
  Button,
  Col,
  Drawer,
  Form,
  Image,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Switch,
  Upload,
  UploadProps,
  message
} from 'antd' // Sử dụng các thành phần UI của Ant Design để xây dựng form và layout

import { CloseOutlined, InboxOutlined, PlusOutlined } from '@ant-design/icons' // Các icon sử dụng trong UI

import { ImageType, TModal, TResponse } from '@/types/common.type' // Các kiểu dữ liệu chung như modal, hình ảnh

import {
  QueryClient,
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  useMutation,
  useQuery
} from '@tanstack/react-query' // Các hook hỗ trợ xử lý gọi API và quản lý cache

import { TProduct, TProductForm, TProductFormEdit } from '@/types/product.type' // Các kiểu dữ liệu liên quan đến sản phẩm

import { addProduct, editProduct } from '@/apis/product.api' // Gọi API để thêm hoặc cập nhật sản phẩm

import { useEffect, useState } from 'react' // Hook React dùng để quản lý state và lifecycle

import { ArrowDownSmallIcon } from '@/components/icons' // Icon tuỳ chỉnh dùng trong Select

import QuillEditor from '@/components/qill-editor' // Component nhập mô tả sản phẩm (rich text)

import { getBrands } from '@/apis/brand.api' // Gọi API lấy danh sách thương hiệu

import { uploadImage } from '@/apis/upload-image.api' // Gọi API upload ảnh lên server

import { useAuth } from '@/contexts/auth-context' // Lấy accessToken từ context đăng nhập

import { useGetCategory } from '@/pages/category/hooks/useCategory' // Gọi danh sách category bằng hook custom

import { useQueryParams } from '@/hooks/useQueryParams' // Lấy query params từ URL (ví dụ trang hiện tại, bộ lọc,...)

interface IFormProductProps {
  currentData: TModal<TProduct> // Dữ liệu của sản phẩm và kiểu modal (add, edit, view)
  onClose: () => void // Hàm đóng drawer
  refetch?: <TPageData>( // Hàm để gọi lại danh sách sản phẩm
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<TResponse<TProduct>, Error>>
}

const { Dragger } = Upload // Lấy component Upload dạng kéo-thả từ AntD

const FomrProduct = ({ currentData, onClose, refetch }: IFormProductProps) => {
  const { accessToken } = useAuth() // Lấy token hiện tại để gọi các API bảo mật
  const queryParams = useQueryParams() // Lấy các query param từ URL
  const [form] = Form.useForm() // Tạo form instance của AntD để quản lý field
  const queryClient = new QueryClient() // Tạo query client để dùng invalidate query sau khi thêm/sửa

  const [value, setValue] = useState<string>('') // Mô tả sản phẩm (dạng rich text)
  const [image, setImage] = useState<ImageType>({ url: '', public_id: '', visiable: false }) // Ảnh sản phẩm

  // ===== Thêm sản phẩm =====
  const createProductMutation = useMutation({
    mutationKey: ['createProduct'],
    mutationFn: (product: TProductForm) => addProduct(product, accessToken),
    onSuccess: () => {
      message.success('Thêm sản phẩm thành công') // Hiển thị thông báo
      onClose() // Đóng drawer
      form.resetFields() // Reset form
      setImage({ url: '', public_id: '', visiable: false }) // Reset hình ảnh
      setValue('') // Reset editor
      refetch && refetch() // Refetch lại danh sách sản phẩm nếu có truyền
      queryClient.invalidateQueries({ queryKey: ['products', queryParams] }) // Làm mới cache danh sách
    },
    onError: () => {
      message.error('Thêm sản phẩm thất bại') // Hiển thị lỗi
    }
  })

  // ===== Cập nhật sản phẩm =====
  const editProductMutation = useMutation({
    mutationKey: ['editProduct'],
    mutationFn: (data: TProductFormEdit) => editProduct(data, accessToken),
    onSuccess: () => {
      message.success('Cập nhật sản phẩm thành công')
      onClose()
      form.resetFields()
      setImage({ url: '', public_id: '', visiable: false })
      setValue('')
      refetch && refetch()
      queryClient.invalidateQueries({ queryKey: ['products', queryParams] })
    },
    onError: () => {
      message.error('Cập nhật sản phẩm thất bại')
    }
  })

  // ===== Upload hình ảnh =====
  const props: UploadProps = {
    name: 'file',
    multiple: false,
    maxCount: 1,
    listType: 'picture',
    accept: 'image/*',
    async customRequest({ file, onSuccess, onError }) {
      const formData = new FormData()
      formData.append('images', file)
      const response = await uploadImage(formData, accessToken)
      const urlInfo: ImageType = response.data.urls[0]
      if (urlInfo) {
        setImage({ url: urlInfo.url, public_id: urlInfo.public_id, visiable: false })
        onSuccess && onSuccess(urlInfo)
      } else {
        onError && onError({ name: 'error', message: 'Lỗi khi upload ảnh' })
      }
    },
    onChange(info) {
      const { status } = info.file
      if (status === 'done') message.success(`${info.file.name} upload thành công`)
      else if (status === 'error') message.error(`${info.file.name} upload thất bại`)
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files)
    }
  }

  // ===== Gọi API lấy danh sách category và brand =====
  const { data, isLoading } = useGetCategory({ enable: currentData.visiable }) // Gọi khi drawer mở
  const categories = data?.data

  const { data: dataBrand, isLoading: isLoadingBrand } = useQuery({
    queryKey: ['brands'],
    queryFn: () => getBrands(accessToken),
    enabled: currentData.visiable
  })
  const brands = dataBrand?.data

  // ===== Submit form =====
  const onSubmit = (data: TProductForm) => {
    if (!data.sizes) {
      message.error('Vui lòng thêm size sản phẩm')
      return
    }

    const dataProduct: TProductForm = {
      ...data,
      sale: data.sale || 0,
      status: data.status ? 'active' : 'inactive',
      images: [{ public_id: image.public_id, url: image.url }]
    }

    if (currentData.type === 'add') createProductMutation.mutate(dataProduct)
    if (currentData.type === 'edit') editProductMutation.mutate({ ...dataProduct, _id: currentData?.currentData!._id })
  }

  // ===== Nếu là edit thì tự động fill dữ liệu vào form =====
  useEffect(() => {
    const { currentData: dataProduct } = currentData
    if (currentData.type === 'edit' && Boolean(dataProduct)) {
      form.setFieldsValue({
        nameProduct: dataProduct?.nameProduct,
        price: dataProduct?.price,
        brand: dataProduct?.brand?._id,
        category: dataProduct?.category?._id,
        sale: dataProduct?.sale,
        status: dataProduct?.status === 'active',
        sizes: dataProduct?.sizes,
        desc: dataProduct?.desc
      })
      setImage({
        url: dataProduct?.images[0].url ?? '',
        public_id: dataProduct?.images[0].public_id ?? '',
        visiable: true
      })
    }
  }, [currentData, form])

  return (
    <Drawer
      title={currentData.type === 'add' ? 'Thêm sản phẩm' : 'Cập nhật lại sản phẩm'}
      onClose={onClose}
      open={currentData.visiable}
      width={800}
      extra={
        <Space>
          <Button size='large' onClick={onClose}>
            Đóng sản phẩm
          </Button>
          <Button
            size='large'
            type='primary'
            onClick={() => form.submit()}
            disabled={createProductMutation.isLoading}
            loading={createProductMutation.isLoading}
          >
            {currentData.type === 'add' ? 'Thêm sản phẩm' : 'Cập nhật lại sản phẩm'}
          </Button>
        </Space>
      }
    >
      {currentData.type === 'view' ? null : (
        <Form layout='vertical' form={form} onFinish={onSubmit}>
          <Row gutter={40}>
            <Col span={12}>
              <Form.Item
                name='nameProduct'
                label='Tên sản phẩm'
                rules={[{ required: true, message: 'Tên sản phẩm là bắt buộc' }]}
              >
                <Input size='large' placeholder='Tên sản phẩm' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name='price'
                label='Giá sản phẩm'
                rules={[{ required: true, message: 'Giá sản phẩm là bắt buộc' }]}
              >
                <InputNumber className='w-full' size='large' placeholder='Giá sản phẩm' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name='brand'
                label='Thương hiệu sản phẩm'
                rules={[{ required: true, message: 'Thương hiệu là bắt buộc' }]}
              >
                <Select
                  loading={isLoadingBrand}
                  size='large'
                  suffixIcon={<ArrowDownSmallIcon />}
                  placeholder='Thương hiệu sản phẩm'
                  options={brands?.map((brand) => ({ value: brand._id, label: brand.nameBrand }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name='category'
                label='Danh mục sản phẩm'
                rules={[{ required: true, message: 'Danh mục là bắt buộc' }]}
              >
                <Select
                  loading={isLoading}
                  size='large'
                  suffixIcon={<ArrowDownSmallIcon />}
                  placeholder='Danh mục sản phẩm'
                  options={categories?.map((cat) => ({ value: cat._id, label: cat.nameCategory }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name='sale'
                label='Giá khuyến mại'
                rules={[
                  {
                    validator(_, value) {
                      const price = form.getFieldValue('price')
                      if (!value || value < price) return Promise.resolve()
                      return Promise.reject(new Error('Giá khuyến mại phải nhỏ hơn giá gốc'))
                    }
                  }
                ]}
              >
                <InputNumber className='w-full' size='large' placeholder='Giá khuyến mại' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name='status' label='Trạng thái sản phẩm'>
                <Switch />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label='Size sản phẩm'>
                <Form.List name='sizes'>
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <Space key={key} style={{ display: 'flex' }} align='baseline'>
                          <Form.Item {...restField} name={[name, 'size']} rules={[{ required: true }]}>
                            <Input size='large' placeholder='Size' />
                          </Form.Item>
                          <Form.Item {...restField} name={[name, 'quantity']} rules={[{ required: true }]}>
                            <InputNumber size='large' placeholder='Số lượng' />
                          </Form.Item>
                          <Form.Item {...restField} name={[name, 'color']} rules={[{ required: true }]}>
                            <Input size='large' placeholder='Màu' />
                          </Form.Item>
                          <CloseOutlined onClick={() => remove(name)} />
                        </Space>
                      ))}
                      <Form.Item>
                        <Button type='dashed' size='large' onClick={() => add()} block icon={<PlusOutlined />}>
                          Thêm size mới
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name='desc' label='Mô tả sản phẩm'>
                <QuillEditor value={value} onChange={(val) => setValue(val)} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name='images'
                label='Hình ảnh sản phẩm'
                rules={[{ required: true, message: 'Hình ảnh là bắt buộc' }]}
              >
                <Dragger {...props}>
                  <p className='ant-upload-drag-icon'>
                    <InboxOutlined />
                  </p>
                  <p className='ant-upload-text'>Click hoặc kéo thả ảnh</p>
                </Dragger>
              </Form.Item>
              {image.visiable && (
                <Image src={image.url} alt={image.public_id} className='!w-[120px] !h-[120px] rounded-md' />
              )}
            </Col>
          </Row>
        </Form>
      )}
    </Drawer>
  )
}

export default FomrProduct
