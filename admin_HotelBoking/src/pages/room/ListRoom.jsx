import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, Button, Popconfirm, notification, Switch } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { AiFillEdit, AiTwotoneDelete } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import instance from './../../../configs/axios';

const ListRoom = () => {
  const [api, contextHolder] = notification.useNotification();
  const queryClient = useQueryClient();

  const openNotification = (pauseOnHover) => (type, message, description) => {
    api.open({
      message,
      description,
      type,
      showProgress: true,
      pauseOnHover,
    });
  };

  // Lấy danh sách phòng
  const { data: room, isLoading, isError } = useQuery({
    queryKey: ['room'],
    queryFn: () => instance.get('/room').then(res => res.data),
  });

  // Xóa phòng
  const deleteRoom = useMutation({
    mutationFn: async (id) => await instance.delete(`/room/${id}`),
    onSuccess: () => {
      openNotification(false)("success", "Xóa thành công", "Phòng đã được xóa");
      queryClient.invalidateQueries({ queryKey: ['room'] });
    },
    onError: () => {
      openNotification(false)("error", "Xóa thất bại", "Đã xảy ra lỗi khi xóa phòng");
    },
  });

  // Bật/tắt phòng
  const toggleStatus = useMutation({
    mutationFn: async ({ id, isAvailable }) =>
      await instance.put(`/updateStatus/${id}`, { isAvailable }),
    onSuccess: () => {
      openNotification(false)("success", "Cập nhật trạng thái thành công", "Trạng thái phòng đã được cập nhật");
      queryClient.invalidateQueries({ queryKey: ['room'] });
    },
    onError: () => {
      openNotification(false)("error", "Cập nhật trạng thái thất bại", "Không thể cập nhật trạng thái phòng");
    },
  });

  const columns = [
    {
      title: 'Tên phòng',
      dataIndex: 'nameRoom',
      key: 'nameRoom',
      width: 250,
    },
    {
      title: 'Tên khách sạn',
      dataIndex: 'hotel',
      key: 'hotel',
      width: 250,
      render: (hotel) => hotel?.name || 'Không có tên',
    },
    {
      title: 'Ảnh phòng',
      dataIndex: 'images',
      key: 'images',
      width: 150,
      render: (images) => {
        const firstImage = Array.isArray(images) && images.length > 0 ? images[0] : '';
        return firstImage ? (
          <img src={firstImage} style={{ width: '90px', height: 'auto' }} alt="Ảnh phòng" />
        ) : (
          'Không có ảnh'
        );
      },
    },
    {
      title: 'Sức chứa',
      dataIndex: 'capacity',
      key: 'capacity',
      width: 100,
    },
    {
      title: 'Loại phòng',
      dataIndex: 'roomType',
      key: 'roomType',
      width: 150,
      filters: [
        { text: 'Phòng Đơn', value: 'Phòng Đơn' },
        { text: 'Phòng Đôi', value: 'Phòng Đôi' },
        { text: 'Phòng Gia Đình', value: 'Phòng Gia Đình' },
        { text: 'Phòng Sang Trọng', value: 'Phòng Sang Trọng' },
      ],
      onFilter: (value, record) => record.roomType.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Giá phòng',
      dataIndex: 'pricePerNight',
      key: 'pricePerNight',
      width: 150,
      render: (price) =>
        new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(price),
    },
    {
      title: 'Dịch vụ',
      dataIndex: 'amenities',
      key: 'amenities',
      width: 150,
      render: (amenities) => {
        if (!Array.isArray(amenities) || amenities.length === 0) {
          return 'Không có tiện nghi';
        }
        return (
          <div>
            {amenities.map((item, index) => (
              <div key={index} style={{ marginBottom: '4px' }}>
                ✅ {item}
              </div>
            ))}
          </div>
        );
      }
    },
    {
      title: 'Mô tả',
      dataIndex: 'text',
      key: 'text',
      render: (_, record) => {
        const limitWords = (text, wordLimit) => {
          const words = String(text || '').split(' ');
          return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') + '...' : text;
        };
        return (
          <div
            dangerouslySetInnerHTML={{
              __html: limitWords(record?.text || '', 20),
            }}
          />
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isAvailable',
      key: 'isAvailable',
      width: 120,
      render: (isAvailable, record) => (
        <Switch
          checked={isAvailable}
          onChange={(checked) => toggleStatus.mutate({ id: record._id, isAvailable: checked })}
          checkedChildren="Bật"
          unCheckedChildren="Tắt"
        />
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <div className="flex gap-2">
          <Link to={`/edit-room/${record._id}`}>
            <Button type="primary">
              <AiFillEdit className="text-xl" />
            </Button>
          </Link>
          <Popconfirm
            onConfirm={() => deleteRoom.mutate(record._id)}
            title="Xóa phòng"
            description="Bạn có chắc chắn muốn xóa phòng này không?"
            okText="Có"
            cancelText="Không"
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          >
            <Button danger>
              <AiTwotoneDelete className="text-lg" />
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  if (isLoading) return <p>Đang tải dữ liệu...</p>;
  if (isError) return <p>Đã xảy ra lỗi khi tải dữ liệu!</p>;

  return (
    <>
      {contextHolder}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-3xl">Quản lý phòng</h1>
      </div>
      <Table
        rowKey="_id"
        dataSource={Array.isArray(room?.rooms) ? room.rooms : []}
        columns={columns}
        scroll={{ x: 'max-content' }}
      />
    </>
  );
};

export default ListRoom;
