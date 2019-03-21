const mongoose = require('mongoose');

const env = process.env.MONGODB_URI || 'mongodb://<a65123731>:<tu95ms**>@ds0*1*7*.mlab.com:41678/polar-plateau-12621';
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/team39', { useNewUrlParser: true});
mongoose.connect(env, { useNewUrlParser: true});

module.exports = {
	mongoose
};