#

API endpoint called /event that receives a payload representing a user's action (like a deposit or withdrawal).

Based on the activity in the payload, endpoint checks against some predefined rules to determine if an alert should be raised.

# Setup

To install all packages required:

npm install

# Testing

To run the unit tests:

npm run test

# Run service locally

To start the service:

npm run dev

# Testing locally

Service can be testing using the below curl:

curl -XPOST http://127.0.0.1:5000/event -H 'Content-Type: application/json' \
 -d '{"type": "deposit", "amount": "42.00", "user_id": 1, "time": 0}'

# Further work required.

For the scenario around deposits in a 30 second window, I was unsure on the best approach. At the moment the functionality is for all deposits, no restraint on time.

I have built on the assumption that payloads received are only for one user, if it was for multiple users, further work required on how the user_id is add to the response.
