import os
import requests
from uagents import Agent, Context
import time
import random
import json
from src.email_alert import send_email

from dotenv import load_dotenv
from os.path import join, dirname

# Load the data of the .env file. 
dotenv_path = join(dirname(__file__), "../.env")
load_dotenv(dotenv_path)


# Set up your RapidAPI endpoint and API key
RAPIDAPI_ENDPOINT = os.getenv("RAPIDAPI_ENDPOINT")
RAPIDAPI_API_KEY = os.getenv("RAPIDAPI_API_KEY")


# Initialize the agent with a unique name and endpoint
agent_name = "currency_exchange_agent"
agent_seed = "your_secret_seed_here"
agent_endpoint = ["http://127.0.0.1:8000/submit"]  # Adjust the endpoint as needed

currency_agent = Agent(name=agent_name, seed=agent_seed, endpoint=agent_endpoint)


# Function to fetch exchange rates from RapidAPI
def fetch_exchange_rate(base_currency, currency):
    url = RAPIDAPI_ENDPOINT
    # Define the header.
    headers = {
        "X-RapidAPI-Key": RAPIDAPI_API_KEY,
        "X-RapidAPI-Host": "currency-converter5.p.rapidapi.com",
    }

    # Define the parameters.
    params = {"format": "json", "from": base_currency, "to": currency, "amount": "1"}

    # Use the requests li
    response = requests.get(url, headers=headers, params=params)

    # print(response.status_code)

    # If the status code is 200 then move forward to return the resulted dictionary.
    if response.status_code == 200:
        # Convert the response to json format.
        data = response.json()

        # Extract out the rate given by the API.
        if "rates" in data and currency in data["rates"]:
            # Convert the rate into float data type.
            converted_rate = float(data["rates"][currency]["rate"])

            # The following piece of code is to test the working. It will be removed in production.
            if currency == "INR":
                random_num = random.randint(0, 3)
                # print(random_num)
                converted_rate += random_num

            # Create the dictionary with the name of the currency as the key and the rate as the value.
            result = {currency: converted_rate}

            # Return the result.
            return result
    return None


def fetch_exchange_rates(base_currency, foreign_currencies):
    # Initialize the empty dictionary.
    result = {}

    # Iterate over all the foreign currencies.
    for currency in foreign_currencies:
        res = fetch_exchange_rate(base_currency, currency)

        # Adding time.sleep to avoid any kind of rate limitation.
        time.sleep(2)
        # print(
        #     "The currency is : {}, the fetched exchange rate is : {}".format(
        #         currency, res
        #     )
        # )
        for item, value in res.items():
            result[item] = value
    # print(result)
    return result


# Function to check exchange rate thresholds and send alerts
@currency_agent.on_interval(period=10.0)  # Adjust the interval as needed
async def check_exchange_rates(ctx: Context):
    # The following piece of code is just to check the number of steps.
    current_count = ctx.storage.get("count") or 0
    # print("The current context is: ", current_count)
    current_count = current_count + 1

    user_data = {}

    try:
        with open("src/user_data/user_data.json", "r") as json_file:
            user_data = json.load(json_file)
            json_file.close()
    except Exception as e:
        print("The following exception occurred: ", e)

    # print("The user data is: ", user_data)

    for _, item in enumerate(user_data):
        # print("The email is for the following person: {}".format(item["user_email"]))
        # print("The idx is: {} and the item is: {}".format(idx, item))

        FOREIGN_CURRENCIES = []

        # print(item["currencies"])

        # Extract the user name

        user_name=item['user_name']

        # Extract out the base currency
        base_currency = item["base_currency"]

        # Extract the email address.
        user_email_address = item["user_email"]

        for item_data in item["currencies"]:
            # print("The item data is: {}".format(item_data))
            # print(item_data["code"])
            FOREIGN_CURRENCIES.append(item_data["code"])

        # Call the excange rate function to ge the dictionaries of values.
        exchange_rates = fetch_exchange_rates(base_currency, FOREIGN_CURRENCIES)

        # print("The final results is: {}".format(exchange_rates))

        THRESHOLDS = item["currencies"]

        thresholds = {}
        for currency_items in THRESHOLDS:
            # print(
            #     "The currency items is: {}, Min is: {}, Max is: {}".format(
            #         currency_items["code"], currency_items["min"], currency_items["max"]
            #     )
            # )

            min_max = {}

            min_max["min"] = currency_items["min"]
            min_max["max"] = currency_items["max"]

            thresholds[currency_items["code"]] = min_max

        if exchange_rates:
            # If the currencyu is in the THRESHOLD list then move forward.
            for currency, threshold in thresholds.items():
                time.sleep(2)
                if currency in exchange_rates:
                    # Take our the current rate from the currency.
                    rate = exchange_rates[currency]

                    # print("The rate is : {}".format(type(rate)))
                    # print("The threshold is : {}".format(type(threshold["min"])))

                    # The rate is in the string data format. Convert it into float.
                    rate = float(rate)
                    threshold["min"] = float(threshold["min"])
                    threshold["max"] = float(threshold["max"])

                    # To highlight the color of the alert define the color format in the form of bash coloring scheme.
                    GREEN = "\033[92m"
                    RESET = "\033[0m"

                    # Check if the current rate is out of bound.
                    if rate < threshold["min"] or rate > threshold["max"]:
                        # Customize your alert message.
                        alert_message = f"Alert for username: {user_name}, Alert message: {currency} rate is {rate}"

                        # Concatenate to have the string highlighted in green color.
                        colored_alert_message = GREEN + alert_message + RESET

                        # Display the alert message.
                        ctx.logger.info(colored_alert_message)

                        # If the user have opted for the email then send.
                        if user_email_address != None:
                            send_email(user_email_address, alert_message)

                else:
                    # If there is any error then display the warning.
                    ctx.logger.warning(
                        f"Currency code {currency} not found in exchange rates data."
                    )
        else:
            ctx.logger.warning("Failed to fetch exchange rates data.")


# Driver code of the program.
if __name__ == "__main__":
    currency_agent.run()
