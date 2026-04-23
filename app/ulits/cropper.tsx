import React from "react";
import { useState } from "react";
import ImgCrop from "antd-img-crop";
import { Upload } from "antd";
export interface FileState {
  uid: string;
  url: string;
  name: string;
}
const getSrcFromFile = (file: any) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file.originFileObj);
    reader.onload = () => resolve(reader.result);
  });
};
export interface Cropper {
  setFileList: (data: FileState[]) => void;
  fileList: FileState[];
  setOldFile: (data: any) => void;
  disabled: boolean;
}
const Cropper = ({ setFileList, fileList, setOldFile, disabled }: Cropper) => {
  const onChange = ({ fileList: newFileList }: any) => {
    const data = fileList.find((item: any) => {
      if (item.status === "removed") {
        return item.uid;
      }
    });
    setOldFile((pre: any) => [...pre, data?.uid]);
    setFileList(newFileList);
  };

  const onPreview = async (file: any) => {
    const src = file.url || (await getSrcFromFile(file));
    const imgWindow = window.open(src);

    if (imgWindow) {
      const image = new Image();
      image.src = src;
      imgWindow.document.write(image.outerHTML);
    } else {
      window.location.href = src;
    }
  };
  return (
    <div>
      <ImgCrop showGrid showReset>
        <Upload
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          listType="picture-card"
          fileList={fileList}
          onChange={onChange}
          onPreview={onPreview}
          disabled={disabled}
        >
          + Upload
        </Upload>
      </ImgCrop>
    </div>
  );
};

export default Cropper;
