import { useEffect, useState } from 'react' // Nhập các hook cơ bản của React.
import { Button, Card } from 'antd' // Nhập component Button và Card từ Ant Design.
import { io, Socket } from 'socket.io-client' // Nhập thư viện Socket.IO client để giao tiếp real-time.
import { Bar, Line } from 'react-chartjs-2' // Nhập các component biểu đồ (Cột và Dòng) từ thư viện react-chartjs-2.
import {
  // Nhập các thành phần cần thiết từ thư viện chart.js.
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ArcElement,
  BarElement
} from 'chart.js'
import { cn } from '@/utils/cn' // Nhập hàm tiện ích để nối class CSS.
import Forecast from './forecast/forecast' // Nhập component con 'Forecast'.
import LeadPrediction from './prediction/leadPrediction' // Nhập component con 'LeadPrediction'.
import BusinessStrategy from './BusinessStrategy/BusinessStrategy' // Nhập component con 'BusinessStrategy'.

// Đăng ký các thành phần của Chart.js để có thể sử dụng được các loại biểu đồ và tính năng tương ứng.
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement)

const HomePage = () => {
  // Bắt đầu định nghĩa component HomePage (Trang chủ).
  const [socketClient, setSocketClient] = useState<Socket | null>(null) // Tạo state để lưu đối tượng kết nối socket.

  useEffect(() => {
    // Effect này chạy 1 lần khi component được render lần đầu.
    const newSocket = io('http://localhost:8080') // Khởi tạo một kết nối mới đến server socket tại địa chỉ này.
    setSocketClient(newSocket) // Lưu đối tượng kết nối vào state.
  }, [])

  useEffect(() => {
    // Effect này lắng nghe sự kiện từ socket.
    if (!socketClient) return // Nếu chưa có kết nối socket thì không làm gì.
    socketClient.on('send-data', (data: string) => {
      // Lắng nghe sự kiện tên là 'send-data'.
      console.log('🚀 ~ socketClient.on ~ data:', data) // Khi có dữ liệu, log ra console.
    })
  }, [socketClient]) // Effect này sẽ chạy lại nếu `socketClient` thay đổi.

  useEffect(() => {
    // Một effect khác để lắng nghe một sự kiện khác.
    if (!socketClient) return
    socketClient.on('add-product', (data: string) => {
      // Lắng nghe sự kiện 'add-product'.
      console.log('🚀 ~ socketClient.on ~ data:', data)
    })
  }, [socketClient])

  const data = {
    // Dữ liệu cho biểu đồ đường (Line chart).
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'], // Nhãn cho trục X.
    datasets: [
      // Mảng các bộ dữ liệu, mỗi object là một đường trên biểu đồ.
      {
        label: 'Doanh thu', // Tên của bộ dữ liệu.
        data: [12000000, 15000000, 17000000, 14000000, 19000000, 22000000], // Dữ liệu tương ứng với các nhãn.
        borderColor: '#14532D', // Màu của đường.
        backgroundColor: 'rgba(20, 83, 45, 0.2)', // Màu nền dưới đường.
        tension: 0.4 // Độ cong của đường.
      },
      {
        label: 'Lợi nhuận',
        data: [10000000, 13000000, 16000000, 11000000, 18000000, 21000000],
        borderColor: '#b04e4e',
        backgroundColor: 'rgba(176, 78, 78, 0.2)',
        tension: 0.4
      },
      {
        label: 'Chi tiêu',
        data: [8000000, 9000000, 12000000, 15000000, 14000000, 18000000],
        borderColor: '#3b5998',
        backgroundColor: 'rgba(59, 89, 152, 0.2)',
        tension: 0.4
      }
    ]
  }

  const barData = {
    // Dữ liệu cho biểu đồ cột (Bar chart).
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
    datasets: [
      {
        label: 'Doanh thu',
        data: [12000000, 15000000, 17000000, 14000000, 19000000, 22000000],
        backgroundColor: '#14532D'
      },
      {
        label: 'Lợi nhuận',
        data: [10000000, 13000000, 16000000, 11000000, 18000000, 21000000],
        backgroundColor: '#b04e4e'
      },
      {
        label: 'Chi tiêu',
        data: [8000000, 9000000, 12000000, 15000000, 14000000, 18000000],
        backgroundColor: '#3b5998'
      }
    ]
  }

  const options: ChartOptions<'line'> = {
    // Cấu hình (options) cho biểu đồ.
    responsive: true, // Cho phép biểu đồ tự điều chỉnh kích thước theo container.
    plugins: {
      // Cấu hình cho các plugin.
      legend: { position: 'top' as const }, // Vị trí của chú thích (legend).
      title: {
        // Cấu hình cho tiêu đề biểu đồ.
        display: true, // Hiển thị tiêu đề.
        text: 'Thống kê tài chính',
        font: { size: 22, weight: 'bold' },
        color: '#14532D'
      }
    },
    scales: {
      // Cấu hình cho các trục tọa độ.
      y: {
        // Trục Y.
        ticks: {
          // Các vạch chia trên trục.
          callback: (tickValue) => {
            // Hàm để định dạng lại nhãn của vạch chia.
            if (typeof tickValue === 'number') {
              return tickValue.toLocaleString() // Chuyển số 12000000 thành "12,000,000" cho dễ đọc.
            }
            return tickValue
          }
        }
      }
    }
  }

  const cardStyle: React.CSSProperties = {
    // Định nghĩa style cho thẻ Card bằng CSS-in-JS.
    padding: '40px',
    margin: '20px auto',
    boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.15)',
    borderRadius: '16px',
    maxWidth: '1000px',
    backgroundColor: '#ffffff',
    textAlign: 'center'
  }

  return (
    // Bắt đầu phần JSX để render giao diện.
    <div className='bg-gray-100 py-10 px-6'>
      {' '}
      {/* Container chính của trang. */}
      <Card style={cardStyle}>
        {' '}
        {/* Thẻ Card chứa các biểu đồ. */}
        <h2 className='text-xl font-bold text-gray-700 mb-8'>Thống kê doanh thu</h2>
        <Line data={data} options={options} /> {/* Render biểu đồ đường, truyền vào data và options. */}
        <h2 className='text-xl font-bold text-gray-700 mt-12 mb-4'>Biểu đồ Cột</h2>
        <Bar data={barData} /> {/* Render biểu đồ cột. */}
        <Button
          className={cn(
            // Sử dụng hàm 'cn' để nối các class TailwindCSS.
            'px-5 py-2 mt-8 rounded-lg text-lg font-semibold text-white bg-green-900 hover:bg-green-700 transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-green-800'
          )}
        >
          Tải thêm dữ liệu
        </Button>
      </Card>
      {/* Render các component con đã được import. */}
      <LeadPrediction />
      <Forecast />
      <BusinessStrategy />
    </div>
  )
}

export default HomePage // Xuất component để sử dụng ở file routes.tsx.
