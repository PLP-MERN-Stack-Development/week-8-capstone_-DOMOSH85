const financeRoutes = require('./routes/finance');
app.use('/api/finance', financeRoutes);
const subsidiesRoutes = require('./routes/subsidies');
app.use('/api/subsidies', subsidiesRoutes);
module.exports = app; 