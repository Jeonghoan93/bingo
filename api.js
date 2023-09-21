const submitAnswer = async (answer, name) => {
  try {
    const response = await fetch(
      "https://customer-api.krea.se/coding-tests/api/squid-game",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answer: answer,
          name: name,
        }),
      }
    );

    const responseData = await response.json();

    console.log("Response from server:", responseData);

    return responseData;
  } catch (error) {
    console.error("There was an error submitting the answer:", error);
  }
};

module.exports = {
  submitAnswer,
};
