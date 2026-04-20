export const checkCardPaymentExist = async (
  stripe,
  cardEl,
  paymentMethodList
) => {
  try {
    const tokenClientSide = await stripe.createToken(cardEl);
    //create card object to retrieve fingerprint since can't get it from client side token(even with sk)
    const tokenServerSideRes = await fetch("/api/stripe/create-token-server-side", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tokenClientSideID: tokenClientSide.token.id }),
    });
    const data = await tokenServerSideRes.json();
    const tokenServerSide = data.tokenResult;
    return paymentMethodList.some(
      (item) =>
        item.card.fingerprint === tokenServerSide.card.fingerprint &&
        item.card.exp_month === tokenServerSide.card.exp_month &&
        item.card.exp_year === tokenServerSide.card.exp_year
    );
  } catch (error) {
    alert("checkCardPaymentExist:" + error.message);
  }
};
