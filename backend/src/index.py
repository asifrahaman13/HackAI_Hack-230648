from fastapi import FastAPI, HTTPException
import json
from src.models import User
import requests
import os
import requests
from dotenv import load_dotenv
from os.path import join, dirname

# Load the data of the .env file. 
dotenv_path = join(dirname(__file__), "../.env")
load_dotenv(dotenv_path)


# Set up your RapidAPI endpoint and API key
AVAILABLE_CURRENCIES_ENDPOINTS = os.getenv("AVAILABLE_CURRENCIES_ENDPOINTS")
RAPIDAPI_API_KEY = os.getenv("RAPIDAPI_API_KEY")


# from sqlalchemy.exc import IntegrityError

# Define the database url that can be used.

# Create the API instance.
app = FastAPI()


@app.post("/user")
def read_user(user: User):
    # Serialize the User Pydantic model to a dictionary
    user_data = user.dict()

    try:
        # Load existing data from the JSON file, or create an empty list if the file doesn't exist yet
        with open("src/user_data/user_data.json", "r") as json_file:
            existing_data = json.load(json_file)
    except Exception as _:
        existing_data = []

    # Check if an entry with the same user_name already exists
    existing_user = next(
        (u for u in existing_data if u.get("user_name") == user.user_name), None
    )

    if existing_user:
        # If the user with the same user_name exists, update the entry
        existing_user.update(user_data)
    else:
        # If the user does not exist, append the new user data to the existing data list
        existing_data.append(user_data)

    # Write the updated data back to the JSON file
    with open("src/user_data/user_data.json", "w") as json_file:
        json.dump(existing_data, json_file, indent=2)

    return {"message": "Data saved successfully"}


@app.delete("/user/{user_name}")
def delete_user(user_name: str):
    # Load the existing data from the JSON file
    try:
        with open("src/user_data/user_data.json", "r") as json_file:
            existing_data = json.load(json_file)
    except FileNotFoundError:
        existing_data = []

    # Find and remove the user data with the specified user_name
    updated_data = [
        user for user in existing_data if user.get("user_name") != user_name
    ]

    # Check if any data was actually removed
    if len(existing_data) == len(updated_data):
        raise HTTPException(
            status_code=404, detail=f"User with user_name '{user_name}' not found"
        )

    try:
        # Write the updated data back to the JSON file
        with open("src/user_data/user_data.json", "w") as json_file:
            json.dump(updated_data, json_file)
    except Exception as e:
        print("The following exception occurred: {}".format(e))

    return {"message": f"User with user_name '{user_name}' deleted successfully"}


@app.post("/currencies")
async def available_currencies():
    available_currencies_url = AVAILABLE_CURRENCIES_ENDPOINTS
    headers = {
        "X-RapidAPI-Key": RAPIDAPI_API_KEY,
        "X-RapidAPI-Host": "currency-converter5.p.rapidapi.com",
    }
    response = requests.get(available_currencies_url, headers=headers)
    response = response.json()

    # print(response['currencies'])

    currencies = response["currencies"]
    return {"currencies": currencies}


# Driver code of the program
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
