export const createSetupIntentAndCustomerIDInStripe = async (
  cardName,
  user,
  customerID
) => {
  try {
    const response = await fetch("/api/stripe/create-setup-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: cardName,
        email: user.email,
        customerID: customerID,
      }),
    });
    return await response.json();
  } catch (error) {
    alert(error.message);
  }
};
