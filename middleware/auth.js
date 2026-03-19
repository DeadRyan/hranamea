// Authentication and authorization middleware
const authMiddleware = {
    // Check if user is logged in
    isLoggedIn: (req, res, next) => {
        if (req.session && req.session.user && req.session.user.isLoggedIn) {
            return next();
        } else {
            return res.status(401).json({ 
                success: false, 
                message: 'Trebuie să fiți autentificat pentru a accesa această funcționalitate' 
            });
        }
    },
    
    // Check if user has full access (subscribed)
    hasFullAccess: (req, res, next) => {
        if (req.session && req.session.user && req.session.user.isLoggedIn && req.session.user.hasFullAccess) {
            return next();
        } else {
            return res.status(403).json({ 
                success: false, 
                message: 'Această funcționalitate necesită acces complet. Vă rugăm să vă autentificați.' 
            });
        }
    },
    
    // Add user info to request if logged in (doesn't block request)
    populateUserInfo: (req, res, next) => {
        if (req.session && req.session.user) {
            req.isLoggedIn = true;
            req.hasFullAccess = req.session.user.hasFullAccess;
            req.user = {
                id: req.session.user.id,
                username: req.session.user.username,
                email: req.session.user.email
            };
        } else {
            req.isLoggedIn = false;
            req.hasFullAccess = false;
        }
        next();
    }
};

module.exports = authMiddleware;