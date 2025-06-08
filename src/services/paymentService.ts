import axios from "../configs/axios";
import { getItemsPriceTotal } from "./getItemsPriceTotal";
import { getVoucherDiscount } from "./getVoucherDiscount";
import getCustomerID from "./getCustomerID";

interface PaymentIntent {
  id: string;
  amount: number;
  created: number;
}

// Custom implementation of getItemsPriceFinal since it's not exported
const getItemsPriceFinal = (items: any, shipUnit: any, voucher: any) => {
  return getItemsPriceTotal(items) +
    getShipPrice(shipUnit) -
    getVoucherDiscount(voucher, items);
};

const getShipPrice = (shipUnit: any | null) =>
  Number(shipUnit?.price) ? Number(shipUnit?.price) : 0;

export const validateOrderRequirements = (
  isCardInfoShowing: boolean,
  shipUnit: any,
  paymentMethod: string
) => {
  const hasShippingUnit = shipUnit && Object.keys(shipUnit).length > 0;
  const hasPaymentMethod = paymentMethod.length > 0;

  return !isCardInfoShowing && hasShippingUnit && hasPaymentMethod;
};

export const getDefaultShippingInfo = (shipInfos: any[]) => {
  let defaultShipInfo = null;
  shipInfos.forEach((item: any) => {
    if (item.isDefault) {
      defaultShipInfo = { ...item };
    }
  });
  return defaultShipInfo;
};

export const processCardPayment = async ({
                                           user,
                                           defaultPaymentMethodID,
                                           defaultShipInfo,
                                           checkoutItems,
                                           shipUnit,
                                           voucher,
                                           setProcessing,
                                           setSucceeded
                                         }: {
  user: any;
  defaultPaymentMethodID: string;
  defaultShipInfo: any;
  checkoutItems: any[];
  shipUnit: any;
  voucher: any;
  setProcessing: (processing: boolean) => void;
  setSucceeded: (succeeded: boolean) => void;
}) => {
  setProcessing(true);
  try {
    const customerID = await getCustomerID(user);
    const response = await axios({
      method: "POST",
      url: `/charge-card-off-session?total=${getItemsPriceFinal(
        checkoutItems,
        shipUnit,
        voucher
      )}`,
      data: {
        paymentMethodID: defaultPaymentMethodID,
        customerID,
        email: user.email,
        shipping: {
          name: defaultShipInfo?.name,
          phone: defaultShipInfo?.phone,
          address: {
            state: defaultShipInfo?.province.name,
            city: defaultShipInfo?.district.name,
            line1: defaultShipInfo?.ward.name,
            line2: defaultShipInfo?.street,
            country: "VN",
            postal_code: 10000,
          },
        },
      },
    });

    return response;
  } catch (error) {
    console.error("Error processing card payment:", error);
    setSucceeded(false);
    setProcessing(false);
    return null;
  }
};

export const handleCardAuthentication = async ({
                                                 stripe,
                                                 result,
                                                 setSucceeded,
                                                 setProcessing,
                                                 handleOrderSucceeded
                                               }: {
  stripe: any;
  result: any;
  setSucceeded: (succeeded: boolean) => void;
  setProcessing: (processing: boolean) => void;
  handleOrderSucceeded: (paymentIntent: any) => Promise<void>;
}) => {
  alert("Thẻ cần xác thực để thanh toán. Vui lòng nhấn ok và đợi cửa sổ xác thực");

  try {
    const stripeJsResult = await stripe?.confirmCardPayment(result.data.clientSecret, {
      payment_method: result.data.paymentMethod,
    });

    if (
      stripeJsResult?.error &&
      stripeJsResult.error.code === "payment_intent_authentication_failure"
    ) {
      alert(
        `Xác thực thẻ ${result.data.card.brand} **** ${result.data.card.last4} thất bại. Vui lòng chọn phương thức thanh toán khác hoặc thử lại.`
      );
      setSucceeded(false);
      setProcessing(false);
      return false;
    } else if (
      stripeJsResult?.paymentIntent &&
      stripeJsResult.paymentIntent.status === "succeeded"
    ) {
      await handleOrderSucceeded(stripeJsResult.paymentIntent);
      setProcessing(false);
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error during card authentication:", error);
    setSucceeded(false);
    setProcessing(false);
    return false;
  }
};

export const handleCardDeclined = (
  result: any,
  setSucceeded: (succeeded: boolean) => void,
  setProcessing: (processing: boolean) => void
) => {
  alert(
    `${result.data.card?.brand ? result.data.card.brand : null} ${
      result.data.card?.last4
        ? "****" + result.data.card.last4
        : "Thẻ"
    } bị từ chối thanh toán hoặc không đủ tiền. Vui lòng sử dụng thẻ khác`
  );
  setSucceeded(false);
  setProcessing(false);
};

export const handleCardPaymentResponse = async ({
                                                  result,
                                                  stripe,
                                                  setSucceeded,
                                                  setProcessing,
                                                  handleOrderSucceeded
                                                }: {
  result: any;
  stripe: any;
  setSucceeded: (succeeded: boolean) => void;
  setProcessing: (processing: boolean) => void;
  handleOrderSucceeded: (paymentIntent: any) => Promise<void>;
}) => {
  // Authentication required
  if (result.data.error && result.data.error === "authentication_required") {
    return await handleCardAuthentication({
      stripe,
      result,
      setSucceeded,
      setProcessing,
      handleOrderSucceeded
    });
  }
  // Card declined
  else if (result.data.error) {
    handleCardDeclined(result, setSucceeded, setProcessing);
    return false;
  }
  // Payment succeeded
  else if (result.data.succeeded) {
    await handleOrderSucceeded(result.data.paymentIntent);
    setProcessing(false);
    return true;
  }

  return false;
};

export const processDeliveryPayment = async (
  checkoutItems: any[],
  shipUnit: any,
  voucher: any,
  handleOrderSucceeded: (paymentIntent: PaymentIntent) => Promise<void>
): Promise<boolean> => {
  const paymentIntent: PaymentIntent = {
    id: `Pi_delivery_${Math.random().toString(36).substring(2)}`,
    amount: getItemsPriceFinal(checkoutItems, shipUnit, voucher),
    created: Math.floor(Date.now() / 1000),
  };
  await handleOrderSucceeded(paymentIntent);
  return true;
};
