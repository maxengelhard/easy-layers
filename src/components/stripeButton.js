import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";

import CheckoutForm from "./CheckoutForm";
import "../Stripe.css";


// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe("pk_live_51Mpdv0G7RGO7eKTFluwGBFpu4EKboaZV0iqV02eVmZqzhIP1oxcdpCbeMQig8YT2joFhBFnVxYeiJHbU8bWsYDjZ00eMLbPpIR");

const StripeButton = ({open}) => {
  const [clientSecret, setClientSecret] = useState("");
  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    const fetchPaymentIntent = async () => {
    const api = `https://api-us-east-1.easylayers.dev/donate`
    await axios.post(`${api}`,{
      
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
    }
    if (open) {
      fetchPaymentIntent()
    }
  }
  , [open]);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="stripeButton">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
}

export default StripeButton