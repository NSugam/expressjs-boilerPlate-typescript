const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 5 minutes
	max: 300, // Limit each IP to 3 request per 5 minute
});

export default limiter;
