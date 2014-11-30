var pageRouter = require('./pageRouter'),
    admin = require('./adminRouter'),
    config = require('./configRouter'),
    alimm = require('./alimmRouter'),
    product = require('./productRouter');

module.exports = function (app) {
    app.use('/admin/alimm', alimm);
    app.use('/admin/config', config);
    app.use('/admin/product', product);
    app.use('/admin', admin);
    app.use('/', pageRouter);
};