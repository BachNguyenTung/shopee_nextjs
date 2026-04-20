import getCustomerID from "./getCustomerID";

export const getDefaultPaymentMethodID = async (user) => {
  const customerID = await getCustomerID(user);
  let defaultPaymentMethodID = "";
  if (!customerID) {
    return defaultPaymentMethodID;
  }
  try {
    const result = await fetch('/api/stripe/retrieve-customer-by-id', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ customerID }),
    });
    const data = await result.json();
    defaultPaymentMethodID =
      data.customer.invoice_settings.default_payment_method;
    defaultPaymentMethodID = defaultPaymentMethodID
      ? defaultPaymentMethodID
      : data.customer.default_source;
  } catch (error) {
    alert(error.message);
  }

  return defaultPaymentMethodID;
};
