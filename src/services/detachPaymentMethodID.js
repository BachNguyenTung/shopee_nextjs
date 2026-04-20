export const detachPaymentMethodID = async (customerID, paymentMethodID) => {
  let paymentMethod;
  if (!customerID || !paymentMethodID) {
    return paymentMethod;
  }
  try {
    const result = await fetch("/api/stripe/detach-payment-method", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paymentMethodID: paymentMethodID, customerID: customerID }),
    });
    const data = await result.json();
    paymentMethod = data.paymentMethod;
  } catch (error) {
    alert(error.message);
  }
  return paymentMethod;
};
