const { app, listenCallback } = require('./app');

app.listen(app.get('port'), listenCallback);
