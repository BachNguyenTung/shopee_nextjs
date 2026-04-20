import getCustomerID from "./getCustomerID";

export const updateDefaultPaymentMethodIDToStripe = async (
  user,
  paymentMethodID
) => {
  const customerID = await getCustomerID(user);
  let defaultPaymentMethodID = "";
  if (!customerID) {
    return defaultPaymentMethodID;
  }
  try {
    const result = await fetch("/api/stripe/update-customer-payment-method", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerID: customerID,
        paymentMethodID: paymentMethodID,
      }),
    });
    const data = await result.json();
    defaultPaymentMethodID =
      data.customer.invoice_settings.default_payment_method;
  } catch (error) {
    alert(error.message);
  }
  return defaultPaymentMethodID;
};
