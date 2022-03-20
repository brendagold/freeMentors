function isAdmin(req, res, next) {
 
  if (req.user.role == "admin") {
    next();
  } else {
    res.status(403).send("Must be an Admin");
  }
}

function isMentor(req, res, next) {

if (req.user.role == "mentor") {
  next();
} else {
  res.status(403).send("Must be a mentor");
}
}
function isUser(req, res, next) {
  
if (req.user.role == "user") {
  next();
} else {
  res.status(403).send("Must be a user");
}
}
export { isAdmin, isMentor, isUser };
