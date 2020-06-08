import ErrorCodes from "@bunq-community/bunq-js-client/dist/Helpers/ErrorCodes";

class Logger {
  static error (message: any) {
    if(typeof message === 'string') {
      console.error(message);
    } else {
      console.error(JSON.stringify(message));
    }
  }
}

/**
 * @param dispatch
 * @param error
 * @param {boolean|string} customError
 * @returns {*}
 */
export default (error: any, customError = false) => {
    const response = error.response;

    const offlineError = "We received a network error while trying to send a request! You might be offline";
    const invalidResponseError = "We couldn't validate the response given by bunq!";
    const invalidAuthenticationError = "The API key or IP you are currently on is not valid for the selected bunq environment"
    ;

    // log to logger
    Logger.error(response ? response.data : error.message);

    // check if a network error occured
    if (error.toString() === "Error: Network Error") {
        Logger.error(offlineError);
    }

    if (error.errorCode) {
        switch (error.errorCode) {
            // invalid response or it couldn't be verified
            case ErrorCodes.INVALID_RESPONSE_RECEIVED:
                return Logger.error(invalidResponseError);
        }
    }

    // fallback to a default message
    if (!response) {
        return Logger.error(customError);
    }

    // check if we can display a bunq error
    const contentType = response.headers["content-type"];

    // attempt to get response id from request
    const responseId = response.headers["x-bunq-client-response-id"];
    if (responseId) Logger.error(`Response-Id: ${responseId}`);

    // response was json so we can retrieve the error
    if (contentType && contentType.includes("application/json") && response.data.Error) {
        const errorObject = response.data.Error[0];

        // error contains an error description
        if (errorObject && errorObject.error_description) {
            const message =
                customError === false ? "We received the following error while sending a request to bunq" : customError;

            // add response id when possible
            const responseIdText = responseId ? `\n\nResponse-Id: ${responseId}` : "";

            // specific message based on api error description
            let errorMessage = errorObject.error_description;

            switch (errorObject.error_description) {
                case "User credentials are incorrect. Incorrect API key or IP address.":
                    errorMessage = invalidAuthenticationError;
                    break;
            }

            return Logger.error(`${message}:\n ${errorMessage}${responseIdText}`);
        }
    }

    return Logger.error(customError);
};
