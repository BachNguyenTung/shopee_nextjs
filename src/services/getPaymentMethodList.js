import getCustomerID from "./getCustomerID";

export const getPaymentMethodList = async (user) => {
  const customerID = await getCustomerID(user);
  let paymentMethodList = [];
  if (!customerID) {
    return paymentMethodList;
  }
  try {
    const result = await fetch('/api/stripe/get-payment-method-list', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ customerID }),
    });
    const data = await result.json();
    paymentMethodList = data.paymentMethodList;
  } catch (error) {
    alert(error.message);
  }
  return paymentMethodList;
};
