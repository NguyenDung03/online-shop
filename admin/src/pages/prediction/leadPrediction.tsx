import React, { useEffect, useState } from 'react' // Import React và các hook cần thiết
import axios from 'axios' // Thư viện gọi API
import { Card, Spin, Row, Col, Typography, Pagination } from 'antd' // Import các component từ Ant Design

const { Title, Text } = Typography // Destructure các component con trong Typography

interface Lead {
  // Interface định nghĩa kiểu dữ liệu của một khách hàng tiềm năng
  user_id: string
  email: string
  address: string
  phone: string
  total_spent: number
  order_count: number
}

const LeadPrediction: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]) // Danh sách khách hàng tiềm năng
  const [loading, setLoading] = useState(true) // Trạng thái loading khi tải dữ liệu
  const [currentPage, setCurrentPage] = useState(1) // Trang hiện tại của phân trang
  const [totalLeads, setTotalLeads] = useState(0) // Tổng số khách hàng (dùng cho phân trang)
  const leadsPerPage = 6 // Số khách hàng hiển thị mỗi trang

  useEffect(() => {
    setLoading(true) // Bắt đầu tải, hiển thị loading
    const apiUrl = `http://localhost:5000/predicted-leads?page=${currentPage}&limit=${leadsPerPage}` // Tạo URL API theo trang

    console.log('API URL:', apiUrl) // In ra URL API để debug

    axios
      .get(apiUrl) // Gửi request GET đến API
      .then((res) => {
        console.log('API Response:', res.data) // In response từ API để debug
        if (res.data && res.data.length) {
          setLeads(res.data) // Cập nhật danh sách khách hàng
          setTotalLeads(res.data.length) // Cập nhật tổng số khách hàng
        } else {
          setLeads([]) // Nếu không có dữ liệu thì clear danh sách
          setTotalLeads(0)
        }
        setLoading(false) // Kết thúc tải
      })
      .catch((err) => {
        console.error('Lỗi khi tải khách hàng tiềm năng:', err.response || err.message || err) // Bắt lỗi và log ra
        setLeads([]) // Clear danh sách khi lỗi
        setTotalLeads(0)
        setLoading(false) // Kết thúc tải
      })
  }, [currentPage]) // useEffect sẽ chạy lại khi currentPage thay đổi

  const handlePageChange = (page: number) => {
    setCurrentPage(page) // Cập nhật trang khi người dùng chọn phân trang
  }

  return (
    <div className='p-10 bg-gray-100 h-auto rounded-xl'>
      {' '}
      {/* Container chính */}
      <Title level={2} className='text-center text-gray-800 mb-8 font-semibold'>
        {' '}
        {/* Tiêu đề */}
        Potential Customer List
      </Title>
      {loading ? ( // Nếu đang loading thì hiển thị spinner
        <div className='flex justify-center items-center h-64'>
          <Spin size='large' />
        </div>
      ) : leads.length === 0 ? ( // Nếu không có khách hàng thì hiển thị thông báo
        <div className='text-center text-gray-800 text-xl'>Không tìm thấy khách hàng nào.</div>
      ) : (
        <>
          {' '}
          {/* Nếu có dữ liệu thì hiển thị danh sách khách hàng */}
          <Row gutter={[16, 16]} justify='center'>
            {leads.map(
              (
                lead // Lặp qua từng khách hàng và render Card
              ) => (
                <Col xs={24} sm={12} md={8} lg={6} key={lead.user_id}>
                  <Card
                    title={
                      <Text strong className='text-xl text-gray-800'>
                        {lead.email}
                      </Text>
                    }
                    bordered={false}
                    className='bg-white shadow-md rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg h-full'
                  >
                    <div className='space-y-4'>
                      <p className='text-gray-600'>
                        📍 <Text type='secondary'>Địa chỉ:</Text> {lead.address || 'Không có'} {/* Địa chỉ */}
                      </p>
                      <p className='text-gray-600'>
                        📞 <Text type='secondary'>SĐT:</Text> {lead.phone || 'Không có'} {/* Số điện thoại */}
                      </p>
                      <p className='text-gray-600'>
                        🛍️ <Text type='secondary'>Số đơn hàng:</Text> {lead.order_count} {/* Số đơn hàng đã đặt */}
                      </p>
                      <p className='text-gray-600'>
                        💰 <Text type='secondary'>Tổng chi tiêu:</Text> {lead.total_spent.toLocaleString()}đ{' '}
                        {/* Tổng số tiền đã chi */}
                      </p>
                    </div>
                  </Card>
                </Col>
              )
            )}
          </Row>
          {/* Component phân trang */}
          <div className='flex justify-center mt-8'>
            <Pagination
              current={currentPage} // Trang hiện tại
              pageSize={leadsPerPage} // Số item mỗi trang
              total={totalLeads} // Tổng số item
              onChange={handlePageChange} // Xử lý khi đổi trang
              showSizeChanger={false} // Không cho thay đổi số item mỗi trang
              className='text-gray-800'
              style={{
                backgroundColor: '#fff',
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid #ddd'
              }}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default LeadPrediction // Export component để sử dụng bên ngoài
