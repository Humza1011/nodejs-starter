const jwt = require("jsonwebtoken");

function createJWT(req, res) {
  const token = jwt.sign(
    {
      userId: req.user.id,
    },
    process.env.JWT_SECRET
  );

  // Send the JWT token to the frontend
  res.status(200).json({
    message: "User has been verified",
    token: token,
    user: req.user,
  });
}

const verifyJWT = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Authorization token is missing" });
  }

  // Verify the token
  jwt.verify(
    token.replace("Bearer ", ""),
    process.env.JWT_SECRET,
    (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: "Authorization Token has expired. Please sign in again",
        });
      }

      req.user = decoded;
      next();
    }
  );
};

exports.verifyJWT = verifyJWT;
exports.createJWT = createJWT;
