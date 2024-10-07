const app = require('./app');
const config = require('./utils/config');
const logger = require('./utils/logger');

const PORT = config.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
	logger.info(`Server running on port ${config.PORT}`);
});
