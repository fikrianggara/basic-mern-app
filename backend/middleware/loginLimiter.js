const rateLimit = require("express-rate-limit");
const { logEvents } = require("./logger");

const loginLimiter = rateLimit({
  windowMS: 60 * 100, //1 minute
  max: 5, // limit each IP login attempts to 5 attempts per window per minute
  message: {
    message:
      "Too many login attempts from this IP, please try again after 60 second pause",
  },
  handler: (req, res, next, options) => {
    logEvents(
      `Too Many Request: ${options.message.message}\t${req.method}\t${req.url}\t`
    );
    res.status(options.statusCode).send(options.message);
  },
  standardHandlers: true, //Return rate limit info in the RateLimit-* headers
  legacyHeaders: false, //Disable x-RateLimit-* headers
});

module.exports = loginLimiter;
