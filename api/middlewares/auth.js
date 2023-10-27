const { secretKey } = require(`../helpers/jwt.js`);
const jwt = require(`jsonwebtoken`);

exports.auth = (req, res, next) => {
  //checks if the user is authenticated
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    return res.status(403).send("authorization header required");
  }

  //clean token
  let token = req.headers.authorization.split(" ")[1];

  try {
    let payload = jwt.verify(token, secretKey);

    req.user = payload;
  } catch {
    return res.status(401).send(`Token expired`);
  }

  next();
};
