import React, { useEffect, useState } from "react";
import validCardCheck from "card-validator";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Input } from "@mui/material";
import { updateCustomerIDToFirebase } from "@/services/updateCustomerIDToFirebase";
import { getPaymentMethodList } from "@/services/getPaymentMethodList";
import { useCustomerID } from "@/hooks/useCustomerID";
import useNavigateAndRefreshBlocker from "../../hooks/useNavigateAndRefreshBlocker";
import { checkCardPaymentExist } from "@/services/checkCardPaymentExist";
import { createSetupIntentAndCustomerIDInStripe } from "@/services/createSetupIntentAndCustomerIDInStripe";
import { checkConfirmCardSetupToStripe } from "@/services/checkConfirmCardSetupToStripe";
import { infoDocRef } from "@/db/dbRef";
import useGetUserByObserver from "@/hooks/useGetUserByObserver";
import useGetShipInfos from "@/hooks/useGetShipInfos";
import { getDoc } from "firebase/firestore";
import { BaseModal } from "@/components/base";
import { ProtectIcon } from "@/components/Images/OptimizedImages";

// const StyledInput = styled("input", {
//   shouldForwardProp: (props) => props !== "isValid",
// })(({isValid}) => ({
//   borderColor: isValid === false && "red",
// }));

// const StyledCardElement = styled(CardElement, {
//   shouldForwardProp: (props) => props !== "isValid",
// })(({isValid}) => ({
//   borderColor: isValid === false && "red",
//   fontSize: "1.3rem",
// }));

interface CardInfoModalProps {
  paymentMethodList: any
  setPaymentMethodList: any
  setDefaultPaymentMethodID: any
  isCardInfoShowing: boolean
  toggleCardInfo: any
}

export default function CardInfoModal({
                                        paymentMethodList,
                                        setPaymentMethodList,
                                        setDefaultPaymentMethodID,
                                        isCardInfoShowing,
                                        toggleCardInfo,
                                      }: CardInfoModalProps) {
  const stripe = useStripe();
  const elements = useElements();
  const {user} = useGetUserByObserver();
  const {customerID} = useCustomerID(user);
  const {shipInfos} = useGetShipInfos(user);
  const [cardName, setCardName] = useState("");
  const [cardAddress, setCardAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [nameIsValid, setNameIsValid] = useState<boolean | null>(null);
  const [numberIsValid, setNumberIsValid] = useState<|null>(null);
  const [errorNumberMsg, setErrorNumberMsg] = useState("");
  const [errorNameMsg, setErrorNameMsg] = useState("");
  const [addCardLoading, setAddCardLoading] = useState<boolean>(false);

  const handleClick = () => {
    toggleCardInfo(!isCardInfoShowing);
  };

  const handleCardElChange = (e: any) => {
    setNumberIsValid(!e.error && e.complete);
    setErrorNumberMsg(e.error ? e.error.message : "");
  };
  const validateCardName = () => {
    setNameIsValid(true);
    let nameValidation = validCardCheck.cardholderName(cardName);
    if (!cardName) {
      setNameIsValid(false);
      setErrorNameMsg("Vui lòng nhập tên thẻ.");
      return;
    }
    if (nameValidation.isValid) {
      setNameIsValid(true);
      setErrorNameMsg("");
      return;
    }
    setNameIsValid(false);
    setErrorNameMsg(
      "Tên thẻ phải là các ký tự alphabet và có thể chứa các ký hiệu apostrophe('), minus(-) and dot(.)."
    );
  };
  //! validateCardNumber not work because no way to retrieve card number from CardElement
  // const validateCardNumber = () => {
  //   setNumberIsValid(true);
  //   if (cardNuber) {
  //     setNameIsValid(false);
  //     setErrorNumberMsg("Vui lòng nhập số thẻ.");
  //   }
  // }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    validateCardName();
    // validateCardNumber();
    if (!numberIsValid && !errorNumberMsg) {
      setErrorNumberMsg("Vui lòng nhập số thẻ.");
    }
    if (!nameIsValid || !numberIsValid) {
      return;
    }

    setAddCardLoading(true);
    if (!stripe || !elements) {
      setAddCardLoading(false);
      alert("Lỗi lấy dữ liệu từ stripe. Vui lòng thử lại!");
      return;
    }

    //Check card exists
    const cardEl = elements.getElement(CardElement);
    const isCardDuplicate = await checkCardPaymentExist(
      stripe,
      cardEl,
      paymentMethodList
    );
    if (isCardDuplicate) {
      setAddCardLoading(false);
      alert("Thẻ này trùng với thẻ đang được sử dụng!");
      return;
    }

    //Create a setupIntent(plus creat customer), use conirmpaymentIntent to create paymentIntent and continue payment flow
    const {setUpIntentSecret, customerID: newCustomerID} =
      await createSetupIntentAndCustomerIDInStripe(cardName, user, customerID);
    // set and add new customerID to firebase if it's the first time doing purchase
    if (customerID.length === 0) {
      await updateCustomerIDToFirebase(user, newCustomerID);
    }
    if (!setUpIntentSecret) return;

    //When the SetupIntent succeeds
    const result = await checkConfirmCardSetupToStripe(
      stripe,
      shipInfos,
      setUpIntentSecret,
      cardEl,
      cardName,
      user,
      phone
    );
    // The resulting PaymentMethod ID (in result.setupIntent.payment_method) will be saved to the provided Customer.

    if (result.setupIntent && result.setupIntent.status === "succeeded") {
      const paymentMethodList = await getPaymentMethodList(user);
      setPaymentMethodList(paymentMethodList);
      if (paymentMethodList.length === 1) {
        setDefaultPaymentMethodID(paymentMethodList[0].id);
      }
      setAddCardLoading(false);
      toggleCardInfo(!isCardInfoShowing);
      alert("Lưu thông tin thẻ thành công!");
    } else {
      alert(result.error.message);
      setAddCardLoading(false);
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  };

  useNavigateAndRefreshBlocker(addCardLoading);

  useEffect(() => {
    if (user) {
      getDoc(infoDocRef(user?.uid))
        .then((doc) => {
          if (doc.exists()) {
            const phone = doc.data().phone;
            setPhone(phone ? phone : "");
          }
        })
        .catch((err) => alert(err));
    }
  }, [user]);
  return (
    <BaseModal isOpen={isCardInfoShowing} handleClose={toggleCardInfo}>
        <div className="cart-product__modal-header">
          <span className="cart-product__header-label">Thêm thẻ</span>
        </div>
        <div className="cart-product__modal-protect">
          <ProtectIcon className="cart-product__protect-icon" />
          <div className="cart-product__protect-label">
            Thông tin thẻ được bảo mật theo tiêu chuẩn quốc tế PCI DSS
          </div>
          <div className="cart-product__protect-info">
            Chúng tôi hợp tác với Stripe để đảm bảo thông tin thẻ của bạn được
            giữ an toàn và bảo mật. Shopee sẽ không có quyền truy cập vào thông
            tin thẻ của bạn.
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="cart-product__card-info">
            <label className="cart-product__card-label">Chi tiết thẻ</label>
            <Input
              // isValid={nameIsValid}
              onKeyDown={handleKeyDown}
              onChange={(e) => setCardName(e.target.value)}
              onBlur={validateCardName}
              value={cardName}
              type="text"
              name="name"
              className="cart-product__card-name"
              placeholder="Họ tên trên thẻ"
            />
            {errorNameMsg && (
              <label className="cart-product__name-error">{errorNameMsg}</label>
            )}
            <div className="cart-product__number-wrapper">
              <CardElement
                // isValid={numberIsValid}
                onChange={handleCardElChange}
              ></CardElement>
            </div>
            {errorNumberMsg && (
              <label className="cart-product__number-error">
                {errorNumberMsg}
              </label>
            )}
          </div>
          <div className="cart-product__card-address">
            <label className="cart-product__address-label">
              Địa chỉ thanh toán
            </label>
            <input
              onKeyDown={handleKeyDown}
              value={cardAddress}
              onChange={(e) => setCardAddress(e.target.value)}
              type="text"
              name="address"
              className="cart-product__address-text"
              placeholder="Address"
            />
          </div>
          <div className="cart-product__modal-footer">
            <button
              disabled={addCardLoading}
              onClick={handleClick}
              className="btn cart-product__modal-close"
            >
              Trở lại
            </button>
            <button
              disabled={addCardLoading} //fix
              type="submit"
              className="btn cart-product__modal-apply"
            >
              {addCardLoading ? "Xử lý..." : "Xác nhận"}
            </button>
          </div>
        </form>
    </BaseModal>
  )

}
