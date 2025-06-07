import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, Button, Popconfirm, notification } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { AiFillEdit, AiTwotoneDelete, AiOutlinePlusCircle } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import instance from './../../../configs/axios';

const ListHotel = () => {
  const [api, contextHolder] = notification.useNotification();
  const queryClient = useQueryClient();

  // Thông báo
  const openNotification = (pauseOnHover) => (type, message, description) => {
    api.open({
      message,
      description,
      type,
      showProgress: true,
      pauseOnHover,
    });
  };

  // Lấy danh sách khách sạn
  const { data: hotel, isLoading, isError } = useQuery({
    queryKey: ['hotel'],
    queryFn: () => instance.get('/hotel').then(res => res.data),
  });

  // Xóa khách sạn
  const { mutate } = useMutation({
    mutationFn: async (id) => await instance.delete(`/hotel/${id}`),
    onSuccess: () => {
      openNotification(false)("success", "Bạn Xóa Thành Công", "Bạn Đã Xóa Thành Công");
      queryClient.invalidateQueries({ queryKey: ['hotel'] });
    },
    onError: () => {
      openNotification(false)("error", "Bạn Xóa Thất Bại", "Bạn Đã Xóa Thất Bại");
    },
  });

  const columns = [
    {
      title: 'Tên Khách Sạn',
      dataIndex: 'name',
      key: 'name',
      width: 250,
    },
    {
      title: 'Ảnh Dịch Vụ',
      dataIndex: 'photos',
      key: 'photos',
      width: 150,
      render: (photos) => {
        const firstImage = Array.isArray(photos) && photos.length > 0 ? photos[0] : '';
        return firstImage ? (
          <img src={firstImage} style={{ width: '90px', height: 'auto' }} alt="Ảnh phụ" />
        ) : (
          'Không có ảnh nào'
        );
      },
    },
    {
      title: 'Số Điện Thoại',
      dataIndex: 'contact',
      width: 150,
      key: 'contact',
    },
    {
      title: 'Loại Khách Sạn',
      dataIndex: 'type',
      width: 150,
      key: 'type',
      filters: [
        { text: 'Khách Sạn', value: 'hotel' },
        { text: 'Khu nghỉ dưỡng', value: 'resort' },
        { text: 'Biệt thự', value: 'villa' },
        { text: 'Nhà nghỉ giá rẻ', value: 'hostel' },
        { text: 'Căn Hộ', value: 'apartment' },
      ],
      onFilter: (value, record) => record.type.includes(value),
      render: (_, record) => {
        const typeMap = {
          hotel: 'Khách Sạn',
          resort: 'Khu nghỉ dưỡng',
          villa: 'Biệt thự',
          hostel: 'Nhà nghỉ giá rẻ',
          apartment: 'Căn Hộ',
        };
        return typeMap[record.type] || record.type;
      },
    },
    {
      title: 'Địa Chỉ',
      key: 'fullAddress',
      width: 300,
      dataIndex: 'address',
      filters: [
        { text: 'Hà Nội', value: 'Hà Nội' },
        { text: 'Hồ Chí Minh', value: 'Hồ Chí Minh' },
        { text: 'Quận 1', value: 'Quận 1' },
        { text: 'Gò Vấp', value: 'Gò Vấp' },
      ],
      onFilter: (value, record) => {
        const { address, ward, district, city } = record;
        const fullAddress = `${address || ''} ${ward || ''} ${district || ''} ${city || ''}`.toLowerCase();
        return fullAddress.includes(value.toLowerCase());
      },
      render: (_, record) => {
        const { address, ward, district, city } = record;
        return `${address || ''}, ${ward || ''}, ${district || ''}, ${city || ''}`;
      }
    },
    {
      title: 'Mô Tả',
      dataIndex: 'description',
      key: 'description',
      render: (_, product) => {
        const limitWords = (text, wordLimit) => {
          const words = String(text || '').split(' ');
          return words.length > wordLimit
            ? words.slice(0, wordLimit).join(' ') + '...'
            : text;
        };

        return (
          <div
            dangerouslySetInnerHTML={{
              __html: limitWords(product?.description || '', 20),
            }}
          />
        );
      },
    },
    {
      title: 'Hành Động',
      fixed: 'right',
      width: 150,
      render: (_, hotel) => (
        <div>
          <Link to={`/edit-hotel/${hotel._id}`}>
            <Button type="primary" className="mr-2">
              <AiFillEdit className="text-xl" />
            </Button>
          </Link>
          <Popconfirm
            onConfirm={() => mutate(hotel._id)}
            title="Xóa Sản Phẩm"
            description="Bạn có chắc chắn muốn xóa sản phẩm này không?"
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
      <div className="flex items-center justify-between mb-5">
        <h1 className='text-3xl text-balance'>Quản lý khách sạn</h1>
      </div>
      {contextHolder}
      <Table
        rowKey="_id"
        dataSource={Array.isArray(hotel) ? hotel : []}
        columns={columns}
        scroll={{ x: 'max-content' }}
      />
    </>
  );
};

export default ListHotel;
