import { useFormik } from "formik";
import * as yup from "yup";
import { phoneRegex } from "@/constants/constants";
import { updateProfile } from "firebase/auth";
import { setDoc } from "firebase/firestore";
import { infoDocRef } from "@/db/dbRef";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/configs/firebase";
import { useUserContext } from "@/context/UserProvider";
import useSetDefaultUserProfile from "@/hooks/useSetDefaultUserProfile";
import { AccountProfileState } from "@/hooks/useAccountProfileState";

export default function useAccountProfileForm({ state, handleChangeState, togglePopup }: {
  state?: AccountProfileState,
  handleChangeState?: <K extends keyof AccountProfileState>(field: K, value: AccountProfileState[K]) => void,
  togglePopup?: () => void
}) {

  const { user, setIsPhotoExist } = useUserContext()

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
      user: state?.userName ?? '',
      name: state?.name ?? '',
      phone: state?.phone ?? '',
      gender: state?.gender ?? '',
      birthday: state?.birthday ?? '',
      previewImage: state?.previewImage ?? '',
    },
    onSubmit: handleInfoSubmit
  })

  // set user info from db
  useSetDefaultUserProfile({
    handleChange: handleChangeState
  })

  // with react-18 all state update in async func are batched to
  async function handleInfoSubmit(values: any) {
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
      handleChangeState?.('isInfoUpdating', true);
      await updateProfile(user, {
        displayName: userName,
      });

      await setDoc(infoDocRef(user?.uid), {
        name: name,
        gender: gender,
        birthday: birthday,
        phone: phone,
      });
      handleChangeState?.('isInfoUpdating', false);
    } catch (error) {
      togglePopup?.();
      handleChangeState?.('isInfoUpdating', false);
      handleChangeState?.('isUserUpdateFailed', true);
    }

    //updating image
    if (previewImage && state?.fileImage) {
      // dont upload if no fileImage or without choose fileImage again
      const storageRef = ref(storage, `users/${user.uid}/avatar`);
      const uploadTask = uploadBytesResumable(storageRef, state?.fileImage ?? null);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          switch (snapshot.state) {
            case "paused":
              handleChangeState?.('isInfoUpdating', false);
              break;
            case "running":
              handleChangeState?.('isInfoUpdating', true);
              break;
          }
        },
        //Handle unsuccessful uploads
        (error) => {
          handleChangeState?.('isInfoUpdating', false);
          handleChangeState?.('isImageUploadFailed', true)
          togglePopup?.();
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
              handleChangeState?.('isInfoUpdating', false)
              togglePopup?.();
            });
        }
      );
    } else {
      togglePopup?.();
    }
  };
  return {
    values,
    state,
    handleChange,
    setFieldValue,
    handleSubmit,
    handleBlur,
    dirty,
    touched,
    errors,
  }
}
