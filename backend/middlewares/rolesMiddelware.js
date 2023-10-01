module.exports = (arrOfRoles) => {
  return (req, res, next) => {
    // console.log(req.user.id);
    // console.log(arrOfRoles);
    // console.log(req.user.roles);
    // next();

    try {
      const { roles } = req.user;
      let hasRole = false;
      arrOfRoles.forEach((role) => {
        if (roles.includes(role)) {
          hasRole = true;
        }
      });
      if (!hasRole) {
        res.status(403);
        throw new Error("Forbidden");
      }
      next();
    } catch (error) {
      res.status(403).json({ code: 403, message: error.message });
    }
  };
};
