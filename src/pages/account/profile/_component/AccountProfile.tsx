import React, { useState } from "react";
import { FastField, Field, Form, Formik } from "formik";
import InputField from "../../../../custom-fields/InputField/InputField";
import RadioGroupField from "../../../../custom-fields/RadioGroupField/RadioGroupField";
import ImageUploadField from "../../../../custom-fields/ImageUploadField/ImageUploadField";
import * as yup from "yup";
import useNavigateAndRefreshBlocker from "../../../../hooks/useNavigateAndRefreshBlocker";
import Link from "next/link";
import useModal from "@/hooks/useModal";
import useSetDefaultUserProfile from "@/hooks/useSetDefaultUserProfile";
import { updateProfile } from "firebase/auth";
import { setDoc } from "firebase/firestore";
import { infoDocRef } from "@/db/dbRef";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/configs/firebase";
import PopupModal from "@/components/Modal/PopupModal";
import { useUserContext } from "@/context/UserProvider";
import { phoneRegex } from "@/constants/constants";

type Action = {
  field: keyof State;
  value: any;
};

export interface State {
  userName: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  birthday: string;
  fileImage: any;  // You can replace `any` with a specific type if needed
  previewImage: string;
  isInfoUpdating: boolean;
  isUserUpdateFailed: boolean;
  isImageUploadFailed: boolean;
}

const initialState: State = {
  userName: "",
  name: "",
  email: "",
  phone: "",
  gender: "",
  birthday: "",
  fileImage: null,
  previewImage: '',
  isInfoUpdating: false,
  isUserUpdateFailed: false,
  isImageUploadFailed: false,
};

// move the state update logic from event handlers into a single function outside of our component
function reducer(state: State, action: Action): State {
  return { ...state, [action.field]: action.value }
}

const AccountProfile = () => {
  const { user, setIsPhotoExist } = useUserContext();
  const { isPopupShowing, togglePopup } = useModal();
  const [fileImage, setFileImage] = useState<any>(null);
  const [isInfoUpdating, setIsInfoUpdating] = useState<boolean>(false);
  const [isUserUpdateFailed, setIsUserUpdateFailed] = useState<boolean>(false);
  const [isImageUploadFailed, setIsImageUploadFailed] = useState<boolean>(false);
  const [state, dispatch] = React.useReducer(reducer, initialState, () => initialState);

  //make sure field is correct type
  //can use form event as param to replace field and value but need to set other place than form
  const handleChange = <K extends keyof State>(field: K, value: State[K]) => {
    dispatch({ field, value });
  };

  // set user info from db
  useSetDefaultUserProfile({
    user, handleChange
  })

  const handleInfoSubmit = async (values: any) => {
    const {
      userName,
      name,
      phone,
      gender,
      birthday,
      previewImage,
    } = values
    try {
      //upadating info
      setIsInfoUpdating(true);
      await updateProfile(user, {
        displayName: userName,
      });

      await setDoc(infoDocRef(user?.uid), {
        name: name,
        gender: gender,
        birthday: birthday,
        phone: phone,
      });
      setIsInfoUpdating(false);
    } catch (error) {
      togglePopup();
      setIsInfoUpdating(false);
      setIsUserUpdateFailed(true);
    }

    //updating image
    if (previewImage && fileImage) {
      // dont upload if no fileImage or without choose fileImage again
      const storageRef = ref(storage, `users/${user.uid}/avatar`);
      const uploadTask = uploadBytesResumable(storageRef, fileImage);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          switch (snapshot.state) {
            case "paused":
              setIsInfoUpdating(false);
              break;
            case "running":
              setIsInfoUpdating(true);
              break;
          }
        },
        //Handle unsuccessful uploads
        (error) => {
          setIsInfoUpdating(false);
          setIsImageUploadFailed(true);
          togglePopup();
        },
        //handle successful uploads
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              setIsPhotoExist(true);
              updateProfile(user, {
                photoURL: downloadURL,
              });
            })
            .then(() => {
              setIsInfoUpdating(false);
              togglePopup();
            });
        }
      );
    } else {
      togglePopup();
    }
  };
  const validationSchema = yup.object({
    user: yup
      .string()
      .min(2, "Tên user phải có tối thiểu 2 ký tự")
      .max(20, "Tên user không vượt quá 20 ký tự")
      .required("Vui lòng nhập tên user"),
    name: yup
      .string()
      .min(2, "Tên phải có tối thiểu 2 ký tự")
      .max(20, "Tên không vượt quá 20 ký tự")
      .required("Vui lòng nhập họ tên"),
    phone: yup
      .string()
      .required("Vui lòng nhập SĐT")
      .matches(phoneRegex, "SĐT không hợp lệ!"),
    gender: yup.string().required("Vui lòng chọn giới tính"),
    birthday: yup.string().required("Vui lòng chọn ngày sinh"),
    previewImage: yup.string().nullable(),
  });

  useNavigateAndRefreshBlocker(isInfoUpdating);

  return (
    <>
      <div className="user-profile__title-container">
        <div className="user-profile__title">
          <div className="user-profile__label">Hồ Sơ Của Tôi</div>
          <div className="user-profile__label-detail">
            Quản lý thông tin hồ sơ để bảo mật tài khoản
          </div>
        </div>
      </div>
      <div className="user-profile__content">
        <Formik
          enableReinitialize // for updated state from db
          initialValues={{
            user: state.userName,
            name: state.name,
            phone: state.phone,
            gender: state.gender,
            birthday: state.birthday,
            previewImage: state.previewImage,
          }}
          validationSchema={validationSchema}
          onSubmit={handleInfoSubmit}
        >
          {(formikProps) => {
            const { values, errors, touched, dirty } = formikProps;
            return (
              <Form className="user-profile__info-form">
                {/* onSubmit={handleInfoSubmit}> */}
                <div className="user-profile_info-container">
                  <div className="user-profile__info-input">
                    <FastField
                      name="user"
                      component={InputField}
                      type="text"
                      label="Tên Đăng Nhập"
                      placeholder=""
                      disabled={false}
                      labelClassName="user-profile__user-label"
                      inputClassName="user-profile__user-input"
                      invalidClassName="user-profile__user-invalid"
                    ></FastField>
                    <FastField
                      name="name"
                      component={InputField}
                      type="text"
                      label="Tên"
                      placeholder=""
                      disabled={false}
                      labelClassName="user-profile__name-label"
                      inputClassName="user-profile__name-input"
                      invalidClassName="user-profile__name-invalid"
                    ></FastField>
                    <label className="user-profile__email-label">Email</label>
                    <div className="user-profile__email-input">
                      {state.email}
                      <Link
                        href="/account/email"
                        className="user-profile__email-btn"
                      >
                        Thay đổi
                      </Link>
                    </div>
                    <FastField
                      name="phone"
                      component={InputField}
                      type="text"
                      label="Số Điện Thoại"
                      placeholder=""
                      disabled={false}
                      labelClassName="user-profile__phone-label"
                      inputClassName="user-profile__phone-input"
                      invalidClassName="user-profile__phone-invalid"
                    ></FastField>
                    <label className="user-profile__gender-label">
                      Giới Tính
                    </label>
                    <div className="user-profile__radio-container">
                      <FastField
                        name="gender"
                        id="man"
                        component={RadioGroupField}
                        value="man"
                        type="radio"
                        label="Nam"
                        labelClassName="user-profile__man-label"
                        inputClassName="user-profile__man-radio"
                        disabled={false}
                      ></FastField>
                      <FastField
                        name="gender"
                        id="woman"
                        component={RadioGroupField}
                        value="woman"
                        type="radio"
                        label="Nữ"
                        labelClassName="user-profile__woman-label"
                        inputClassName="user-profile__woman-radio"
                        disabled={false}
                      ></FastField>
                      <FastField
                        name="gender"
                        id="other"
                        component={RadioGroupField}
                        value="other"
                        type="radio"
                        label="Khác"
                        labelClassName="user-profile__other-label"
                        inputClassName="user-profile__other-radio"
                        disabled={false}
                      ></FastField>
                    </div>
                    {errors.gender && touched.gender && (
                      <div className="user-profile__radio-invalid">
                        {errors.gender}
                      </div>
                    )}
                    <FastField
                      name="birthday"
                      component={InputField}
                      type="date"
                      label="Ngày Sinh"
                      placeholder=""
                      disabled={false}
                      labelClassName="user-profile__birthday-label"
                      inputClassName="user-profile__birthday-input"
                      invalidClassName="user-profile__birthday-invalid"
                    ></FastField>
                    <button
                      disabled={isInfoUpdating || !dirty}
                      type="submit"
                      className="btn user-profile__info-submit"
                    >
                      Lưu
                    </button>
                  </div>

                  <Field
                    name="previewImage"
                    component={ImageUploadField}
                    type="file"
                    label=""
                    disabled={false}
                    setFileImage={setFileImage}
                    isInfoUpdating={isInfoUpdating}
                  ></Field>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
      <PopupModal
        isUserUpdateFailed={isUserUpdateFailed}
        isAccountPage={true}
        isImageUploadFailed={isImageUploadFailed}
        isPopupShowing={isPopupShowing}
        togglePopup={togglePopup}
      ></PopupModal>
    </>
  );
};

export default AccountProfile;
