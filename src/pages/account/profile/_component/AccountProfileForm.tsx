import { Button, Input } from "@shoppe_nextjs/ui";
import Link from "next/link";
import ImageUpload from "@/custom-fields/ImageUploadField/ImageUpload";
import React, { useId } from "react";
import { AccountProfileState } from "@/hooks/useAccountProfileState";
import useAccountProfileForm from "@/hooks/useAccountProfileForm";

//TODO: form render twice caused by formik control state update, use react-hook-form
export default function AccountProfileForm({ state, handleChangeState, togglePopup }: {
  state?: AccountProfileState,
  handleChangeState?: <K extends keyof AccountProfileState>(field: K, value: AccountProfileState[K]) => void,
  togglePopup?: () => void
}) {
  const {
    values,
    handleChange,
    setFieldValue,
    handleSubmit,
    handleBlur,
    errors,
    dirty,
    touched,
  } = useAccountProfileForm({ state, handleChangeState, togglePopup });
  const userId = useId()
  const nameId = useId()

  return (
    <form onSubmit={handleSubmit} className={'user-profile__info-form'}>
      <div className="user-profile_info-container">
        <div className="user-profile__info-input">
          <label htmlFor={userId} className={'user-profile__user-label'}>Tên Đăng Nhập</label>
          <Input id={userId} name={'user'} type={"text"} onChange={handleChange} onBlur={handleBlur}
                 value={values.user} className={'user-profile__user-input'}
                 variant={errors.user ? 'invalid' : 'default'} />
          {errors.user && <div className={'user-profile__user-invalid'}>{errors.user}</div>}

          <label htmlFor={nameId} className={'user-profile__name-label'}>Tên</label>
          <Input id={nameId} name={'name'} type={"text"} onChange={handleChange} onBlur={handleBlur}
                 value={values.name} className={'user-profile__name-input'}
                 variant={errors.name ? 'invalid' : 'default'} />
          {errors.name && <div className={'user-profile__name-invalid'}>{errors.name}</div>}

          <label className="user-profile__email-label">Email</label>
          <div className="user-profile__email-input">
            {state?.email ?? ''}
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
            disabled={state?.isInfoUpdating || !dirty}
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
          isInfoUpdating={state?.isInfoUpdating}
          handleChange={handleChange}
        />
      </div>
    </form>
  )
}
