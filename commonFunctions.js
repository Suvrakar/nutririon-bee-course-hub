function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/nbee/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/mycourses')
    }
    next()
}

const initialPass = async () => {
    let userData = await Users.find().sort();
    try {
        initializePassport(
            passport,
            email => userData.find(user => user.email === email),
            id => userData.find(user => user.id === id)
        )
    }
    catch (err) {
        console.log(err);
    }

}


module.exports = { checkAuthenticated, checkNotAuthenticated }
