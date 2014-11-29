var pageRouter = require('./pageRouter'),
    admin = require('./adminRouter');

module.exports = function (app) {
    app.use('/admin', admin);
    app.use('/', pageRouter);
};