import React, { useState } from 'react';
import { Button, Form, Input, Upload, Row, Col, Checkbox, Select, message } from 'antd';
import { LoadingOutlined, UploadOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import instance from './../../../configs/axios';
import "react-quill/dist/quill.snow.css";
import ReactQuill from 'react-quill';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';


const EditRoom = () => {
  const { id } = useParams();
  const [form] = Form.useForm()
  const [value, setValue] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState([]);
  const [isPending, setIsPending] = React.useState(false);
  const queryClient = useQueryClient();
  const { data: hotel } = useQuery({
    queryKey: ['hotel'],
    queryFn: () => instance.get('/hotel')
  })
  const { data: room } = useQuery({
    queryKey: ['room', id],
    queryFn: () => instance.get(`/room/${id}`)
  })
  console.log("room", room?.data?.room);

  const { mutate } = useMutation({
    mutationFn: async (data) => {
      try {
        return await instance.put(`/room/${id}`, data)
      } catch (error) {
        throw new Error((error).message);
      }
    },
    onSuccess: () => {
      messageApi.open({
        type: "success",
        content: "Bạn sửa phòng thành công",
      });
      queryClient.invalidateQueries({
        queryKey: ["room"],
      });
    },
    onError: () => {
      messageApi.open({
        type: "error",
        content: "Bạn sửa phòng thất bại. Vui lòng thử lại sau!",
      });
    },
  })
  useEffect(() => {
    if (room?.data?.room) {
      const roomData = room.data.room;

      // Nếu roomData.hotel là object, lấy _id, nếu đã là string thì giữ nguyên
      const hotelValue = typeof roomData.hotel === 'object' ? roomData.hotel.name : roomData.hotel;

      form.setFieldsValue({
        ...roomData,
        hotel: hotelValue,
      });

      setValue(roomData.text || "");

      if (roomData.images) {
        const files = roomData.images.map((url, index) => ({
          uid: `${index}`,
          name: `images${index}`,
          status: 'done',
          url,
        }));
        setFileList(files);
      }
    }
  }, [room, form]);


  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
  const onFinish = (values) => {
    const imageUrls = fileList
      .filter((file) => file.status === "done")
      .map((file) => file.response?.secure_url);

    const newValues = {
      ...values,
      images: imageUrls,
    };

    console.log("Data being sent:", newValues);
    mutate(newValues);
  };


  const requiredLabel = (text) => (
    <>
      {text} <span className="text-red-500"> *</span>
    </>
  );
  const toolbarOptions = [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block"],
    ["link", "image", "video", "formula"],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ direction: "rtl" }], // text direction

    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],

    ["clean"], // remove formatting button
  ];
  const modules = {
    toolbar: toolbarOptions,
  };
  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold text-blue-600">Sửa Phòng</h1>
      </div>
      {contextHolder}
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <Form
          form={form}
          name="add-hotel"
          layout="vertical"
          onFinish={onFinish}
          validateTrigger="onBlur"
          initialValues={room?.data?.room}
        >
          <Row gutter={[24, 24]}>
            {/* Bên trái - 60% */}
            <Col xs={24} sm={24} md={16} lg={15}>
              <Form.Item
                required={false}
                label={requiredLabel("Tên Phòng")}
                name="nameRoom"
                rules={[{ required: true, message: 'Tên phòng không được để trống' }]}
              >
                <Input placeholder="VD: Phòng Deluxe" disabled={isPending} />
              </Form.Item>

              {/* Dòng chung cho "Sức Chứa" và "Giá mỗi đêm" */}
              <Row gutter={24}>
                <Col xs={24} sm={12} md={12}>
                  <Form.Item
                    required={false}
                    label={requiredLabel("Sức Chứa")}
                    name="capacity"
                    rules={[{ required: true, message: 'Vui lòng nhập sức chứa' }]}
                  >
                    <Input type="number" placeholder="Số người tối đa" disabled={isPending} />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={12}>
                  <Form.Item
                    required={false}
                    label={requiredLabel("Giá mỗi đêm")}
                    name="pricePerNight"
                    rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
                  >
                    <Input type="number" placeholder="VD: 1500000" disabled={isPending} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="Mô tả phòng" name="text" className="mb-16">
                <ReactQuill
                  className="h-[300px]"
                  theme="snow"
                  value={value}
                  onChange={setValue}
                  modules={modules}

                />
              </Form.Item>
            </Col>

            {/* Bên phải - 40% */}
            <Col xs={24} sm={24} md={8} lg={9}>
              <Form.Item
                required={false}
                label={requiredLabel("Loại Phòng")}
                name="roomType"
                rules={[{ required: true, message: 'Vui lòng nhập loại phòng' }]}
              >
                <Input placeholder="VD: Giường đôi, căn hộ, suite..." disabled={isPending} />
              </Form.Item>

              <Form.Item
                name="images"
                rules={[
                  {
                    required: false,
                    message: 'Ảnh phòng bắt buộc phải có',
                  },
                ]}
              >
                <Upload
                  listType="picture-card"
                  action="https://api.cloudinary.com/v1_1/ecommercer2021/image/upload"
                  data={{ upload_preset: 'demo-upload' }}
                  onPreview={handlePreview}
                  onChange={handleChange}
                  fileList={fileList}
                  multiple
                >
                  {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                {previewImage && (
                  <Image
                    wrapperStyle={{ display: 'none' }}
                    preview={{
                      visible: previewOpen,
                      onVisibleChange: (visible) => setPreviewOpen(visible),
                      afterOpenChange: (visible) => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                  />
                )}
              </Form.Item>
              <Form.Item name='amenities'>
                <Checkbox.Group style={{ width: '100%' }} >
                  <Row>
                    <Col span={8}>
                      <Checkbox value="WiFi miễn phí">WiFi miễn phí</Checkbox>
                    </Col>
                    <Col span={8}>
                      <Checkbox value="Dịch vụ phòng">Dịch vụ phòng</Checkbox>
                    </Col>
                    <Col span={8}>
                      <Checkbox value="Hồ bơi">Hồ bơi</Checkbox>
                    </Col>
                    <Col span={8}>
                      <Checkbox value="Miễn phí bữa sáng">Miễn phí bữa sáng</Checkbox>
                    </Col>
                    <Col span={8}>
                      <Checkbox value="View đẹp">View đẹp</Checkbox>
                    </Col>
                  </Row>
                </Checkbox.Group>

              </Form.Item>
              <Form.Item
                required={false}
                name="hotel"
                label={<h1 className="text-md text-center">Khách sạn <span className="text-red-500">*</span></h1>}
                rules={[
                  {
                    required: true,
                    message: "Khách sạn bắt buộc chọn",
                  }
                ]}>
                <Select
                  showSearch
                  placeholder="Chọn khách sạn"
                  optionFilterProp="children"
                >
                  {hotel?.data?.map((h) => (
                    <Option key={h._id} value={h._id}>
                      {h.name}
                    </Option>
                  ))}
                </Select>
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
                  {isPending ? <LoadingOutlined /> : 'Sửa Phòng'}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </>
  );
};

export default EditRoom;
