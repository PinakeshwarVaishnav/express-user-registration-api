import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  console.log("req headers are", req.headers);

  if (!token) {
    return res.status(401).json({ auth: false, message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
    if (err) {
      return res
        .status(500)
        .json({ auth: false, message: "Failed to authenticate token." });
    }

    req.userId = decoded.id;
    console.log("decoded token is", decoded);
    next();
  });
};
