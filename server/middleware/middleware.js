const secretKey = 'AnshuSinha';
const jwt = require('jsonwebtoken');
var middleware = async function (req, res, next) {
	// control the routes to be ignored
	console.log(req.path);
	const ignoreRoutes = [
		'/api/v1/',
		'/api/v1/login',
		'/api/v1/signup',
	];
	// console.log(req.path);
	if (ignoreRoutes.includes(req.path)) {
		return next();
	}
	// for all other routes check for token
	// first check for authorization header
	let authorization = req.headers.authorization;
	if (authorization) {
		// split the token from the header
		let token = authorization.split(' ')[1];
		if (token) {
			// verify the token
			jwt.verify(token, secretKey, function (err, decoded) {
				if (err) {
					// if token is invalid
					return res.status(401).json({ message: 'Invalid Token' });
				} else {
					// if token expired
					if (jwt.decode(token).exp < Date.now() / 1000) {
						return res.status(401).json({ message: 'Token Expired' });
					}
					// if token is not expired
					req.decoded = decoded;
					// console.log('decoded', decoded);
					next();
				}
			});
		} else {
			// if no token is provided
			return res.status(403).json({ message: 'No Token Provided' });
		}
	} else {
		// if no authorization header is provided
		return res.status(403).json({ message: 'No Authorization' });
	}
};
module.exports = middleware;
