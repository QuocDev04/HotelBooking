import React, { useState } from 'react';
import { Form, Upload, Image } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

const Anh = () => {
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

    return (
        <div>
            <Form.Item
                name="galleryService"
                rules={[
                    {
                        required: false,
                        message: 'Ảnh dịch vụ bắt buộc phải có',
                    },
                ]}
            >
                <h1 className="text-lg text-center py-2">Ảnh dịch vụ</h1>
                <Upload
                    listType="picture-card"
                    action="https://api.cloudinary.com/v1_1/ecommercer2021/image/upload"
                    data={{ upload_preset: 'demo-upload' }}
                    onPreview={handlePreview}
                    onChange={handleChange}
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
        </div>
    );
};

export default Anh;
