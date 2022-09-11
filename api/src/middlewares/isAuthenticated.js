const isAuthenticated = (req, res, next) => {
    if(req.session.user) next()
    else res.status(403).send({error: 'Unauthorized! You should login first.'})
}

module.exports = isAuthenticated