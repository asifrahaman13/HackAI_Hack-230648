import React, { useEffect, useState } from "react";
import axios from "axios";
import Success from "../Succes/Sucess";

const CurrencyCard = ({
  currency,
  selected,
  min,
  max,
  onCurrencySelect,
  onMinMaxChange,
}) => {
  return (
    <>
      <div className="bg-gray-500 p-4 rounded-md shadow-md border-2 border-gray-600 px-4 py-6 transform transition duration-500 hover:scale-110">
        {/* <img alt="content" class="object-cover object-center" src="https://media.istockphoto.com/id/1008861200/photo/stack-of-one-hundred-dollars-notes.jpg?s=612x612&w=0&k=20&c=Q5Dl6Giw7iWOSWgjy5fnkEyRCTgxT8cJyFIAbOMo7TA="/ > */}
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            value={currency.code}
            checked={selected}
            onChange={onCurrencySelect}
          />
          <span>{`${currency.code} - ${currency.name}`}</span>
        </label>
        <div className="mt-2">
          <label
            htmlFor={`min-${currency.code}`}
            className="block text-gray-900"
          >
            Min:
          </label>
          <input
            id={`min-${currency.code}`}
            type="number"
            step="0.01"
            className="border border-gray-400 p-2 rounded-md w-full"
            value={min || ""}
            onChange={(e) => onMinMaxChange(e, currency.code, "min")}
          />
        </div>
        <div className="mt-2">
          <label
            htmlFor={`max-${currency.code}`}
            className="block text-gray-900"
          >
            Max:
          </label>
          <input
            id={`max-${currency.code}`}
            type="number"
            step="0.01"
            className="border border-gray-400 p-2 rounded-md w-full"
            value={max || ""}
            onChange={(e) => onMinMaxChange(e, currency.code, "max")}
          />
        </div>
      </div>
    </>
  );
};

const Currencies = () => {
  const [message, setMessage] = useState({
    msg: "",
    statuscode: 0,
  });

  const [user_name, setUserName] = useState("");
  const [user_email, setUserEmail] = useState("");
  const [baseCurrency, setBaseCurrency] = useState("");
  const [selectedCurrencies, setSelectedCurrencies] = useState([]);
  const [minMaxValues, setMinMaxValues] = useState({});
  const [userChoice, setUserChoice] = useState({});
  const [currenciesArray, setCurrenciesArray] = useState([]);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get("http://localhost:5000/currencies");
        console.log("yet");
        console.log(response.data.currencies);
        const currenciesArray = Object.keys(response.data.currencies).map(
          (code) => ({
            code,
            name: response.data.currencies[code],
          })
        );
        console.log("The currency array:", currenciesArray);
        const initialMinMaxValues = {};
        currenciesArray.forEach((currency) => {
          initialMinMaxValues[currency.code] = {
            min: "",
            max: "",
          };
        });
        setMinMaxValues(initialMinMaxValues);
        setCurrenciesArray(currenciesArray);
      } catch (err) {
        console.error("The following error occurred: ", err);
      }
    };
    fetchCurrencies();
  }, []);

  function selectBaseCurrency(event) {
    setBaseCurrency(event.target.value);
  }

  function handleMinMaxChange(event, currencyCode, type) {
    const newValue = event.target.value;
    setMinMaxValues((prevMinMaxValues) => ({
      ...prevMinMaxValues,
      [currencyCode]: {
        ...prevMinMaxValues[currencyCode],
        [type]: newValue,
      },
    }));
  }

  function handleCurrencySelect(event) {
    const selectedCurrencyCode = event.target.value;
    setSelectedCurrencies((prevSelected) =>
      prevSelected.includes(selectedCurrencyCode)
        ? prevSelected.filter((code) => code !== selectedCurrencyCode)
        : [...prevSelected, selectedCurrencyCode]
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const userData = {
      user_name,
      user_email,
      base_currency: baseCurrency,
      currencies: selectedCurrencies.map((currencyCode) => ({
        code: currencyCode,
        min: parseFloat(minMaxValues[currencyCode]?.min || 0),
        max: parseFloat(minMaxValues[currencyCode]?.max || 0),
      })),
    };
    setUserChoice(userData);
    try {
      const response = await axios.post(
        "http://localhost:5000/user/",
        userData
      );
      console.log(response);
      if (response.status == 200) {
        setMessage({ msg: "Everything is successfully sent", statuscode: 200 });
      } else {
        setMessage({ msg: "There was a problem asociated.", statuscode: 404 });
      }
    } catch (err) {
      console.log(err);
      setMessage({ msg: "There was a problem asociated.", statuscode: 404 });
    }

    console.log(userData);
    handleShowToast();
    // You can now send `userData` to your server or perform further actions.
  }

  const [showToast, setShowToast] = useState(false);

  // Function to show the toast
  const handleShowToast = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000); // Hide the toast after 3 seconds (adjust as needed)
  };

  return (
    <>
      <div className="relative">
        {showToast && <Success message={message} />}
      </div>

      <div className="container mx-auto">
        <h1 className="text-2xl text-gray-100 font-bold mb-4">Currencies</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="user_name" className="block text-gray-100 mb-2">
              User Name:
            </label>
            <input
              placeholder="Enter a unique user name: for example 'johnpierce232' "
              id="user_name"
              type="text"
              className="block border bg-gray-300 border-gray-400 p-2 rounded-md w-full"
              value={user_name}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="user_email" className="block text-gray-100 mb-2">
              User Email:
            </label>
            <input
              id="user_email"
              placeholder="Enter your email address: For example 'john@example.com'"
              type="email"
              className="block border bg-gray-300 border-gray-400 p-2 rounded-md w-full"
              value={user_email}
              onChange={(e) => setUserEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="baseCurrency" className="block text-gray-100 mb-2">
              Select Base Currency:
            </label>
            <select
              id="baseCurrency"
              className="block border border-gray-400 p-2 rounded-md"
              value={baseCurrency}
              onChange={selectBaseCurrency}
              required
            >
              <option value="">Select...</option>
              {currenciesArray.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {`${currency.code} - ${currency.name}`}
                </option>
              ))}
            </select>
          </div>
          {/* <div className="mb-4">
          <label className="block text-gray-600 mb-2">
            Select Currencies to Add:
          </label>
          <div className="grid grid-cols-4 gap-2">
            {currenciesArray.map((currency) => (
              <label key={currency.code} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={currency.code}
                  checked={selectedCurrencies.includes(currency.code)}
                  onChange={handleCurrencySelect}
                />
                <span>{`${currency.code} - ${currency.name}`}</span>
              </label>
            ))}
          </div>
        </div> */}
          <div className="mb-4">
            <label className="block text-gray-100 mb-2">
              Select Currencies to Add:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {currenciesArray.map((currency) => (
                <CurrencyCard
                  key={currency.code}
                  currency={currency}
                  selected={selectedCurrencies.includes(currency.code)}
                  min={minMaxValues[currency.code]?.min}
                  max={minMaxValues[currency.code]?.max}
                  onCurrencySelect={handleCurrencySelect}
                  onMinMaxChange={handleMinMaxChange}
                />
              ))}
            </div>
          </div>

          <section class="text-gray-600 body-font">
            <div class="container px-5 py-24 mx-auto">
              <div class="flex flex-col">
                <div class="h-1 bg-gray-200 rounded overflow-hidden">
                  <div class="w-24 h-full bg-indigo-500"></div>
                </div>
                <div class="flex flex-wrap sm:flex-row flex-col py-6 mb-12">
                  <h1 class="sm:w-2/5 text-gray-100 font-medium title-font text-2xl mb-2 sm:mb-0">
                    Your selected currencies will appear below:{" "}
                  </h1>
                  <p class="sm:w-3/5 text-gray-300 leading-relaxed text-base sm:pl-10 pl-0">
                    All the selcted currencies will appear below. You can modify the threshold values from here too. 
                  </p>
                </div>
              </div>
            </div>
          </section>

          {selectedCurrencies.length > 0 && (
            <ul className="grid grid-cols-3 gap-4">
              {selectedCurrencies.map((currencyCode) => (
                <li
                  key={currencyCode}
                  className="bg-green-200 p-4 rounded-md shadow-md hover:shadow-lg transition duration-300"
                >
                  <span className="text-xl font-semibold">{currencyCode}</span>
                  <div className="mt-2">
                    <label
                      htmlFor={`min-${currencyCode}`}
                      className="block text-gray-600"
                    >
                      Min:
                    </label>
                    <input
                      id={`min-${currencyCode}`}
                      type="number"
                      step="0.01"
                      className="border border-gray-400 p-2 rounded-md w-full"
                      value={minMaxValues[currencyCode]?.min || ""}
                      onChange={(e) =>
                        handleMinMaxChange(e, currencyCode, "min")
                      }
                    />
                  </div>
                  <div className="mt-2">
                    <label
                      htmlFor={`max-${currencyCode}`}
                      className="block text-gray-600"
                    >
                      Max:
                    </label>
                    <input
                      id={`max-${currencyCode}`}
                      type="number"
                      step="0.01"
                      className="border border-gray-400 p-2 rounded-md w-full"
                      value={minMaxValues[currencyCode]?.max || ""}
                      onChange={(e) =>
                        handleMinMaxChange(e, currencyCode, "max")
                      }
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
          <button
            type="submit"
            className="mt-4 bg-green-400 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default Currencies;
