
import json
import os
import stripe
from lambda_decorators import json_http_resp, cors_headers


# This is your test secret API key.
api_key = os.environ['API_KEY']
stripe.api_key = api_key


@cors_headers
@json_http_resp
def lambda_handler(event, context):
    create_payment(event)

    return {"message": "Thank you for your donation"}

def calculate_order_amount(event):
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
