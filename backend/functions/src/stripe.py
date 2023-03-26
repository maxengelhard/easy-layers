
import json
import os
import stripe

# This is your test secret API key.
stripe.api_key = 'sk_test_51Mpdv0G7RGO7eKTF9j4llG8lIrMB2IyYvuahtwpUY4crCDJG4fCTjfBVvGP7kATG7vEMzo8xuJGpsRyxlvCwOF6M006v1C6NHx'



def calculate_order_amount(event):
    # Replace this constant with a calculation of the order's amount
    # Calculate the order total on the server to prevent
    # people from directly manipulating the amount on the client
    return event['donation']


def create_payment(event):
    try:
        data = json.loads(event.data)
        # Create a PaymentIntent with the order amount and currency
        intent = stripe.PaymentIntent.create(
            amount=calculate_order_amount(data),
            currency='usd',
            automatic_payment_methods={
                'enabled': True,
            },
        )
        return json.dumps({
            'clientSecret': intent['client_secret']
        })
    except Exception as e:
        return json.dumps(error=str(e)), 403
