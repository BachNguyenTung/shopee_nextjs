import React from "react";
import useNavigateAndRefreshBlocker from "../../../../hooks/useNavigateAndRefreshBlocker";
import useModal from "@/hooks/useModal";
import PopupModal from "@/components/Modal/PopupModal";
import AccountProfileForm from "@/pages/account/profile/_component/AccountProfileForm";
import useAccountProfileState from "@/hooks/useAccountProfileState";

const AccountProfile = () => {
  const { isPopupShowing, togglePopup } = useModal();
  const { state, handleChangeState } = useAccountProfileState()
  useNavigateAndRefreshBlocker(state.isInfoUpdating);

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
        <AccountProfileForm state={state} handleChangeState={handleChangeState} togglePopup={togglePopup} />
      </div>
      <PopupModal
        isUserUpdateFailed={state.isUserUpdateFailed}
        isAccountPage={true}
        isImageUploadFailed={state.isImageUploadFailed}
        isPopupShowing={isPopupShowing}
        togglePopup={togglePopup}
      ></PopupModal>
    </>
  );
};

export default AccountProfile;
