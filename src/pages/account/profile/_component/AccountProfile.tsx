import React, { useState } from "react";
import { useFormik } from "formik";
import ImageUpload from "../../../../custom-fields/ImageUploadField/ImageUpload";
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
import { Button, Input } from "@shoppe_nextjs/ui";

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
  fileImage: File | null;  // You can replace `any` with a specific type if needed
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
  const [isInfoUpdating, setIsInfoUpdating] = useState<boolean>(false);
  const [isUserUpdateFailed, setIsUserUpdateFailed] = useState<boolean>(false);
  const [isImageUploadFailed, setIsImageUploadFailed] = useState<boolean>(false);
  const [state, dispatch] = React.useReducer(reducer, initialState, () => initialState);

  //make sure field is correct type
  //can use form event as param to replace field and value but need to set other place than form
  const handleChangeState = <K extends keyof State>(field: K, value: State[K]) => {
    dispatch({ field, value });
  };

  // set user info from db
  useSetDefaultUserProfile({
    user, handleChange: handleChangeState
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
    if (previewImage && state.fileImage) {
      // dont upload if no fileImage or without choose fileImage again
      const storageRef = ref(storage, `users/${user.uid}/avatar`);
      const uploadTask = uploadBytesResumable(storageRef, state.fileImage);
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

  const { values, handleChange, setFieldValue, handleSubmit, handleBlur, dirty, touched, errors } = useFormik({
    enableReinitialize: true,
    validationSchema: validationSchema,
    initialValues: {
      user: state.userName,
      name: state.name,
      phone: state.phone,
      gender: state.gender,
      birthday: state.birthday,
      previewImage: state.previewImage,
    },
    onSubmit: handleInfoSubmit
  })

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
        <form onSubmit={handleSubmit} className={'user-profile__info-form'}>
          <div className="user-profile_info-container">
            <div className="user-profile__info-input">
              <label htmlFor={'user'} className={'user-profile__user-label'}>Tên Đăng Nhập</label>
              <Input id={'user'} name={'user'} type={"text"} onChange={handleChange} onBlur={handleBlur}
                     value={values.user} className={'user-profile__user-input'}
                     variant={errors.user ? 'invalid' : 'default'} />
              {errors.user && <div className={'user-profile__user-invalid'}>{errors.user}</div>}

              <label htmlFor={'name'} className={'user-profile__name-label'}>Tên</label>
              <Input id={'name'} name={'name'} type={"text"} onChange={handleChange} onBlur={handleBlur}
                     value={values.name} className={'user-profile__name-input'}
                     variant={errors.name ? 'invalid' : 'default'} />
              {errors.name && <div className={'user-profile__name-invalid'}>{errors.name}</div>}

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

              <label htmlFor={'phone'} className={'user-profile__phone-label'}>Số Điện Thoại</label>
              <Input id={'phone'} name={'phone'} type={"text"} onChange={handleChange} onBlur={handleBlur}
                     value={values.phone} className={'user-profile__phone-input'}
                     variant={errors.phone ? 'invalid' : 'default'} />
              {errors.phone && <div className={'user-profile__phone-invalid'}>{errors.phone}</div>}

              <label htmlFor={'gender'} className={'user-profile__birthday-label'}>Giới Tính</label>
              <div className="user-profile__radio-container">
                <Input id={'man'} name={'gender'} type={"radio"} onChange={handleChange} onBlur={handleBlur}
                       value={'man'} checked={values.gender === 'man'} />
                <label htmlFor={'man'} className={'user-profile__man-label'}>Nam</label>

                <Input id={'woman'} name={'gender'} type={"radio"} onChange={handleChange} onBlur={handleBlur}
                       value={'woman'} checked={values.gender === 'woman'} />
                <label htmlFor={'woman'} className={'user-profile__woman-label'}>Nữ</label>

                <Input id={'other'} name={'gender'} type={"radio"} onChange={handleChange} onBlur={handleBlur}
                       value={'other'} checked={values.gender === 'other'} />
                <label htmlFor={'other'} className={'user-profile__other-label'}>Khác</label>

                {errors.gender && <div className={'user-profile__gender-invalid'}>{errors.gender}</div>}
              </div>

              <label htmlFor={'birthday'} className={'user-profile__birthday-label'}>Ngày Sinh</label>
              <Input id={'birthday'} name={'birthday'} type={"date"} onChange={handleChange} onBlur={handleBlur}
                     value={values.birthday} className={'user-profile__birthday-input'}
                     variant={errors.birthday ? 'invalid' : 'default'} />
              {errors.birthday && <div className={'user-profile__birthday-invalid'}>{errors.birthday}</div>}

              <Button
                disabled={isInfoUpdating || !dirty}
                type="submit"
                className="btn user-profile__info-submit"
              >
                Lưu
              </Button>
            </div>
            <ImageUpload
              value={values.previewImage}
              setFieldValue={setFieldValue}
              label=""
              disabled={false}
              isInfoUpdating={isInfoUpdating}
              handleChange={handleChange}
            />
          </div>
        </form>
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
