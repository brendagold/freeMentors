function isAdmin(req, res, next) {
    console.log(req.user)
  if (req.user.role == "admin") {
    next();
  } else {
    res.status(403).send("Must be an Admin");
  }
}

function isMentor(req, res, next) {
  console.log(req.user)
if (req.user.role == "mentor") {
  next();
} else {
  res.status(403).send("Must be a mentor");
}
}

export { isAdmin, isMentor };
