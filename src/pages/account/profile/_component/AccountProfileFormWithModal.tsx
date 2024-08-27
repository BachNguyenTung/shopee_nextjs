import AccountProfileForm from "@/pages/account/profile/_component/AccountProfileForm";
import { AccountProfileState } from "@/hooks/useAccountProfileState";
import useModal from "@/hooks/useModal";
import PopupModal from "@/components/Modal/PopupModal";
import React from "react";

export default function AccountProfileFormWithModal({ state, handleChangeState }: {
  state?: AccountProfileState,
  handleChangeState?: <K extends keyof AccountProfileState>(field: K, value: AccountProfileState[K]) => void,
}) {
  const { isPopupShowing, togglePopup } = useModal();
  return (
    <>
      <div className="user-profile__content">
        <AccountProfileForm state={state} handleChangeState={handleChangeState} togglePopup={togglePopup} />
      </div>
      <PopupModal
        isUserUpdateFailed={state?.isUserUpdateFailed}
        isAccountPage={true}
        isImageUploadFailed={state?.isImageUploadFailed}
        isPopupShowing={isPopupShowing}
        togglePopup={togglePopup}
      ></PopupModal>
    </>
  )
}
