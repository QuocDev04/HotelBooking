import React, { useState } from 'react';
import { Button, Form, Input, Upload, Row, Col, Radio, Select, message, Image } from 'antd';
import { LoadingOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import instance from './../../../configs/axios';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "react-quill/dist/quill.snow.css";
import ReactQuill from 'react-quill';

const EditHotel = () => {
    const { id } = useParams();
    const [value, setValue] = useState("");

    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const { data: hotel } = useQuery({
        queryKey: ['hotel', id],
        queryFn: async () => instance.get(`/hotel/${id}`)
    })
    useEffect(() => {
        if (hotel?.data) {
            form.setFieldsValue(hotel.data);

            // Cập nhật các trường liên quan đến select
            if (hotel.data.city) {
                setSelectedCity(hotel.data.city);
            }
            if (hotel.data.district) {
                setSelectedDistrict(hotel.data.district);
            }

            // Nếu có ảnh thì cũng cập nhật fileList như bạn đang làm
            if (hotel.data.photos) {
                setFileList(
                    hotel.data.photos.map((url, index) => ({
                        uid: index.toString(),
                        name: `photos${index}`,
                        status: "done",
                        url: url,
                    }))
                );
            }
        }
    }, [hotel, form]);

    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationFn: async (data) => {
            try {
                return await instance.put(`/hotel/${id}`, data);
            } catch (error) {
                console.error("Error adding hotel:", error);
                throw error; // Rethrow the error to be caught by onError
            }
        },
        onSuccess: () => {
            messageApi.open({
                type: "success",
                content: "Bạn sửa dịch vụ thành công",
            });
            queryClient.invalidateQueries({
                queryKey: ["hotel"],
            });
        },
        onError: () => {
            messageApi.open({
                type: "error",
                content: "Bạn sửa dịch vụ thất bại. Vui lòng thử lại sau!",
            });
        },
    }); const locationData = [
        {
            name: 'Hà Nội',
            districts: [
                { name: 'Ba Đình', wards: ['Phúc Xá', 'Trúc Bạch', 'Vĩnh Phúc'] },
                { name: 'Cầu Giấy', wards: ['Dịch Vọng', 'Nghĩa Tân', 'Yên Hòa'] },
            ],
        },
        {
            name: 'Hồ Chí Minh',
            districts: [
                { name: 'Quận 1', wards: ['Bến Nghé', 'Bến Thành', 'Nguyễn Thái Bình'] },
                { name: 'Gò Vấp', wards: ['Phường 1', 'Phường 3', 'Phường 5'] },
            ],
        },
    ];

    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);

    const cities = locationData.map((city) => ({
        label: city.name,
        value: city.name,
    }));

    const districts =
        selectedCity
            ? locationData.find((city) => city.name === selectedCity)?.districts.map((district) => ({
                label: district.name,
                value: district.name,
            })) || []
            : [];

    const wards =
        selectedCity && selectedDistrict
            ? locationData
                .find((city) => city.name === selectedCity)
                ?.districts.find((district) => district.name === selectedDistrict)
                ?.wards.map((ward) => ({
                    label: ward,
                    value: ward,
                })) || []
            : [];

    const onCityChange = (value) => {
        setSelectedCity(value);
        setSelectedDistrict(null);
        form.setFieldsValue({ district: undefined, ward: undefined });
    };

    const onDistrictChange = (value) => {
        setSelectedDistrict(value);
        form.setFieldsValue({ ward: undefined });
    };

    const onFinish = (values) => {
        const imageUrls = fileList
            .filter((file) => file.status === "done") // Lọc chỉ các ảnh đã tải lên thành công
            .map((file) => file.response?.secure_url); // Lấy URL từ phản hồi

        const newValues = {
            ...values,
            photos: imageUrls,
        };
        mutate(newValues)
    };

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState([]);

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
                <h1 className="text-3xl font-semibold text-blue-600">Sửa Thông Tin Khách Sạn</h1>
            </div>
            {contextHolder}
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <Form initialValues={hotel?.data} form={form} name="add-room" layout="vertical" validateTrigger="onBlur" onFinish={onFinish}>

                    <Row gutter={[24, 24]}>
                        {/* Bên trái - 60% */}
                        <Col xs={24} sm={24} md={16} lg={15}>
                            <Form.Item
                                required={false}
                                label={requiredLabel('Tên Khách Sạn')}
                                name="name"
                                rules={[{ required: true, message: 'Tên Khách Sạn không được để trống' }]}
                            >
                                <Input placeholder="VD: Khách Sạn Deluxe" disabled={isPending} />
                            </Form.Item>

                            {/* Dòng chung cho "Sức Chứa" và "Giá mỗi đêm" */}
                            <Row gutter={24}>
                                <Col xs={24} sm={8} md={8}>
                                    <Form.Item
                                        required={false}
                                        label={requiredLabel('Thành phố')}
                                        name="city"
                                        rules={[{ required: true, message: 'Bắt buộc chọn Thành phố' }]}
                                    >
                                        <Select
                                            placeholder="Chọn thành phố"
                                            options={cities}
                                            onChange={onCityChange}
                                            disabled={isPending}
                                        />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={8} md={8}>
                                    <Form.Item
                                        required={false}
                                        label={requiredLabel('Quận / Huyện')}
                                        name="district"
                                        rules={[{ required: true, message: 'Bắt buộc chọn Quận / Huyện' }]}
                                    >
                                        <Select
                                            placeholder="Chọn quận / huyện"
                                            options={districts}
                                            onChange={onDistrictChange}
                                            disabled={!selectedCity || isPending}
                                        />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={8} md={8}>
                                    <Form.Item
                                        required={false}
                                        label={requiredLabel('Phường / Xã / Thôn')}
                                        name="ward"
                                        rules={[{ required: true, message: 'Bắt buộc chọn Phường / Xã / Thôn' }]}
                                    >
                                        <Select
                                            placeholder="Chọn xã / thôn"
                                            options={wards}
                                            disabled={!selectedDistrict || isPending}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12} md={12}>
                                    <Form.Item
                                        required={false}
                                        label={requiredLabel('Địa Chỉ')}
                                        name="address"
                                        rules={[{ required: true, message: 'Địa Chỉ không được để trống' }]}
                                    >
                                        <Input placeholder="VD: Địa Chỉ Abc" disabled={isPending} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12} md={12}>
                                    <Form.Item
                                        required={false}
                                        label={requiredLabel('Số điện thoại')}
                                        name="contact"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập số điện thoại' },
                                            {
                                                pattern: /^0\d{9}$/,
                                                message: 'Số điện thoại phải bắt đầu bằng 0 và gồm đúng 10 chữ số',
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder="VD: 0987654321"
                                            disabled={isPending}
                                            maxLength={10}
                                            onKeyPress={(e) => {
                                                if (!/[0-9]/.test(e.key)) {
                                                    e.preventDefault();
                                                }
                                            }}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item label="Mô tả khách sạn" name="description" className="mb-16">
                                <ReactQuill
                                    className="h-[300px]"
                                    theme="snow"
                                    value={value}
                                    onChange={setValue}
                                    modules={modules}
                                    {...fileList}
                                />
                            </Form.Item>
                        </Col>

                        {/* Bên phải - 40% */}
                        <Col xs={24} sm={24} md={8} lg={9}>
                            <Form.Item
                                name="photos"
                                rules={[
                                    {
                                        required: false,
                                        message: 'Ảnh Hotel bắt buộc phải có',
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

                            <Form.Item
                                name="type"
                                rules={[{ required: true, message: 'Vui lòng chọn một loại chỗ nghỉ!' }]}
                            >
                                <Radio.Group style={{ width: '100%' }}>
                                    <Row gutter={[16, 16]}>
                                        {[
                                            { label: 'Khách sạn', value: 'hotel' },
                                            { label: 'Dịch vụ phòng', value: 'resort' },
                                            { label: 'Biệt thự nghỉ dưỡng', value: 'villa' },
                                            { label: 'Nhà nghỉ giá rẻ', value: 'hostel' },
                                            { label: 'Căn hộ', value: 'apartment' },
                                        ].map((item) => (
                                            <Col span={8} key={item.value}>
                                                <Radio value={item.value}>{item.label}</Radio>
                                            </Col>
                                        ))}
                                    </Row>
                                </Radio.Group>
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

export default EditHotel;
