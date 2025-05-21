import React from 'react';
import { Button, Form, Input, Upload, Row, Col } from 'antd';
import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';

const AddRoom = () => {
  const [isPending, setIsPending] = React.useState(false);

  const onFinish = (values) => {
    const newValues = {
      ...values,
    };
    mutate(newValues); // Gửi dữ liệu
  };

  const handleImageUpload = (file) => {
    return false; // Ngăn upload mặc định
  };

  const requiredLabel = (text) => (
    <>
      {text} <span className="text-red-500"> *</span>
    </>
  );

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold text-blue-600">Thêm Phòng</h1>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-lg">
        <Form
          name="add-room"
          layout="vertical"
          onFinish={onFinish}
        >
          <Row gutter={[24, 24]}>
            {/* Bên trái - 60% */}
            <Col xs={24} sm={24} md={16} lg={15}>
              <Form.Item
                label={requiredLabel("Tên Phòng")}
                name="room_name"
                rules={[{ required: true, message: 'Tên phòng không được để trống' }]}
              >
                <Input placeholder="VD: Phòng Deluxe" disabled={isPending} />
              </Form.Item>

              {/* Dòng chung cho "Sức Chứa" và "Giá mỗi đêm" */}
              <Row gutter={24}>
                <Col xs={24} sm={12} md={12}>
                  <Form.Item
                    label={requiredLabel("Sức Chứa")}
                    name="capacity"
                    rules={[{ required: true, message: 'Vui lòng nhập sức chứa' }]}
                  >
                    <Input type="number" placeholder="Số người tối đa" disabled={isPending} />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={12}>
                  <Form.Item
                    label={requiredLabel("Giá mỗi đêm")}
                    name="price_per_night"
                    rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
                  >
                    <Input type="number" placeholder="VD: 1500000" disabled={isPending} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Mô Tả"
                name="description"
              >
                <Input.TextArea
                  placeholder="Mô tả chi tiết phòng"
                  rows={4}
                  disabled={isPending}
                />
              </Form.Item>
            </Col>

            {/* Bên phải - 40% */}
            <Col xs={24} sm={24} md={8} lg={9}>
              <Form.Item
                label={requiredLabel("Loại Phòng")}
                name="room_type"
                rules={[{ required: true, message: 'Vui lòng nhập loại phòng' }]}
              >
                <Input placeholder="VD: Giường đôi, căn hộ, suite..." disabled={isPending} />
              </Form.Item>

              <Form.Item
                label="Ảnh Phòng"
                name="imageRoom"
              >
                <Upload
                  name="room_image"
                  listType="picture"
                  showUploadList={false}
                  beforeUpload={handleImageUpload}
                  disabled={isPending}
                >
                  <Button
                    icon={<UploadOutlined />}
                    className="w-full bg-blue-500 text-white hover:bg-blue-600"
                    disabled={isPending}
                  >
                    Chọn Ảnh
                  </Button>
                </Upload>
              </Form.Item>
            </Col>

            {/* Nút Submit */}
            <Col span={24}>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isPending}
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                >
                  {isPending ? <LoadingOutlined /> : 'Thêm Phòng'}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </>
  );
};

export default AddRoom;
