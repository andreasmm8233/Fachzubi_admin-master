import React from "react";
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
const isObjectId = (value: unknown): value is string =>
  typeof value === "string" && /^[a-f\d]{24}$/i.test(value);

const Cropper = ({ setFileList, fileList, setOldFile, disabled }: Cropper) => {
  const onChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
  };

  // Track only already-saved images (uid is a real Mongo ObjectId) so the
  // backend can delete them. Newly added, not-yet-saved files have a temporary
  // "rc-upload-…" uid and are skipped — they never existed on the server.
  const onRemove = (file: any) => {
    if (isObjectId(file?.uid)) {
      setOldFile((pre: any) => [...pre, file.uid]);
    }
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
          // Do NOT auto-upload to a remote URL — keep the file locally and let
          // the form submit send it to our backend. Returning false from
          // beforeUpload prevents the request that was causing "upload error".
          beforeUpload={() => false}
          listType="picture-card"
          fileList={fileList}
          onChange={onChange}
          onRemove={onRemove}
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
