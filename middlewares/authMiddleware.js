const jwt = require('jsonwebtoken');

// Extraction du token
const extractBearerToken = headerValue => {
  if (typeof headerValue !== 'string') {
    return false;
  }
  const matches = headerValue.match(/(bearer)\s+(\S+)/i);
  return matches && matches[2];
}

module.exports = (req, res, next) => {
  // Extrait le token présent dans le header de la requête
  const token = req.headers.authorization && extractBearerToken(req.headers.authorization);

  if (!token) return res.status(401).json({ message: 'Access Denied' });

  // Vérifie la validité du token
  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      return res.status(403).json({ message: `Failed to authenticate token.` });
    }
    // Si le token est valide, on stocke les informations de l'utilisateur dans l'objet req
    req.user = decodedToken;
    next();
  });
};
