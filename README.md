# IITB-Hackathon 🧑🏼‍💻

## How to set up the environement.

Firt clone the repository:

```
git init
git clone https://github.com/asifrahaman13/poetry.git
```

Next go into the techfest_hackathon folder.

```
cd backend/
```

If you want to keep the virtual environment in the same folder structure locally then run the following command:

```
poetry config virtualenvs.in-project true
```

Activate the virtual environment.

```
poetry shell
```

Next you need to create a .env file to store the environmen variables. In unix based system you can use the following command:

```
touch .env
```

You can also manually create the file. 

Next add the environment variables. 

- For the Currency conversion use the following link to obtain the API key, API endpoints:

  https://rapidapi.com/natkapral/api/currency-converter5

- For the gmail go to the manage settings section of your gmail account. On the left side you will see the security tab. click on it. Now click on the "2-Step   Verification" under the "How you sign in to Google". Scroll down to find the "App passwords" function. Next click on it and enter the required details to get 16 digit app password. Copy it.
  https://myaccount.google.com/security
  

```
RAPIDAPI_ENDPOINT=https://currency-converter5.p.rapidapi.com/currency/convert
RAPIDAPI_API_KEY=<your rapid api api key>
AVAILABLE_CURRENCIES_ENDPOINTS=https://currency-converter5.p.rapidapi.com/currency/list
SENDER_EMAIL=<your email address>
EMAIL_API_PASSWORD=<your gmail app password>
```

Activate the environment variable. 

```
source .env
```

Install the dependencies and packages.

```
poetry install
```

Next you need to set up the environment for the front end.

```
cd frontend/
yarn install 
yarn start
```

## How to run the backend code

You need to run the fast api in a port say 5000.

```
poetry run uvicorn src.index:app --reload --port=5000
```

You can run the code from the terminal itself using the following commands:

```
poetry run python3 src/main.py
```

## Please note the port numbers:
- The uagents library will run on port 8000.
- The front end will run on port 3000.
- The fast api backend will run on port 5000
<br/>
<br/>
<br/>

To test the code one extra line was added. Please comment out the following lines of codes(main.py file, line number 57-61):

```
# The following piece of code is to test the working. It will be removed in production.
            if currency == "INR":
                random_num = random.randint(0, 3)
                # print(random_num)
                converted_rate += random_num
```

## MIT License 💡

### Copyright (c) 2023 Asif Rahaman

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
