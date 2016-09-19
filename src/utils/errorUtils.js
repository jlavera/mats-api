module.exports = function errorUtils() {
  return {
    report
  };

  function report(resp, err) {
    if (err.httpStatus && err.message) {
      resp.status(err.httpStatus).json({
        message: err.message
      });
    }
    resp.status(500).json({
      message: 'There was a problem processing your request'
    });
  }
};
