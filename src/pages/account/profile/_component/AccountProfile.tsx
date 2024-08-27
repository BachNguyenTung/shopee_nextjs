import React from "react";
import useNavigateAndRefreshBlocker from "../../../../hooks/useNavigateAndRefreshBlocker";
import useAccountProfileState from "@/hooks/useAccountProfileState";
import AccountProfileFormWithModal from "@/pages/account/profile/_component/AccountProfileFormWithModal";

const AccountProfile = () => {
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
      <AccountProfileFormWithModal state={state} handleChangeState={handleChangeState} />
    </>
  );
};

export default AccountProfile;
