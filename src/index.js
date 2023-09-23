const axios = require("axios");
const { config } = require("./config");

const request = (requestConfig) => {
  return (options) => {
    const handleSuccess = (response) => {
      return response.data;
    };

    const handleError = (error) => {
      throw error.response?.data || error.response || new Error(error.message);
    };

    const axiosRequest = axios.create(requestConfig);

    return axiosRequest({
      ...options,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...options.headers,
      },
    })
      .then(handleSuccess)
      .catch(handleError);
  };
};

module.exports = {
  methods: config.methods,
  request,
};
