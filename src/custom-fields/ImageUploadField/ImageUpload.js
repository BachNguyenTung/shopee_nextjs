import React, {useEffect, useRef} from "react";
import PropTypes from "prop-types";
import {Input} from "@shoppe_nextjs/ui";

const ImageUpload = (props) => {
  const {
    value,
    setFieldValue,
    label,
    disabled,
    handleChange,
    isInfoUpdating,
  } = props;
  const inputEl = useRef();
  const maxSizeFileInMB = 8;
  const maxSizeFileInKB = maxSizeFileInMB * 1048576;

  //free memory file input
  useEffect(() => {
    return () => {
      if (value) {
        URL.revokeObjectURL(value);
      }
    };
  }, [value]);

  const handleImageInputChange = (e) => {
    if (isInfoUpdating) {
      return;
    }
    if (e.target.files && e.target.files[0]) {
      const fileImage = e.target.files[0];
      if (fileImage.size > maxSizeFileInKB) {
        alert(
          `Không thể tải file lớn hơn ${maxSizeFileInMB}MB !. Vui lòng thử lại`
        );
      } else {
        handleChange('fileImage', fileImage);
        const previewImage = URL.createObjectURL(fileImage);
        setFieldValue('previewImage', previewImage);
      }
    }
  };

  return (
    <>
      {label && (
        <label htmlFor={'previewImage'} className="user-profile__image-label">
          {label}
        </label>
      )}
      <div className="user-profile__image-input">
        <div
          onClick={() => {
            if (!isInfoUpdating) {
              inputEl.current.click();
            }
          }}
          className="user-profile__input-image"
        >
          {!value ? (
            <svg
              enableBackground="new 0 0 15 15"
              viewBox="0 0 15 15"
              x="0"
              y="0"
              className="user-profile__input-svg"
            >
              <g>
                <circle
                  cx="7.5"
                  cy="4.5"
                  fill="none"
                  r="3.8"
                  strokeMiterlimit="10"
                ></circle>
                <path
                  d="m1.5 14.2c0-3.3 2.7-6 6-6s6 2.7 6 6"
                  fill="none"
                  strokeLinecap="round"
                  strokeMiterlimit="10"
                ></path>
              </g>
            </svg>
          ) : (
            <div
              className="user-profile__preview-image"
              style={{ backgroundImage: `url(${value})` }}
            ></div>
          )}
        </div>
        <button
          disabled={isInfoUpdating}
          type="button" // formik treat as submit button ??
          onClick={() => {
            inputEl.current.click();
          }}
          className="btn user-profile__image-btn w-full md:w-auto"
        >
          Chọn ảnh
        </button>
        <Input
          name="previewImage"
          type={'file'}
          ref={inputEl}
          onChange={handleImageInputChange}
          className="user-profile__image-file"
          accept=".jpg,.jpeg,.png"
          disabled={disabled}
        />
        <div className="user-profile__image-size">
          Dụng lượng file tối đa 8 MB
        </div>
        <div className="user-profile__image-format">Định dạng:.JPEG, .PNG</div>
      </div>
    </>
  );
};

ImageUpload.propTypes = {
  value: PropTypes.string.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  previewImage: PropTypes.string,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  isInfoUpdating: PropTypes.bool
};

ImageUpload.defaultProps = {
  previewImage: null,
  label: "",
  disabled: false,
  isInfoUpdating: false
};

export default ImageUpload;
