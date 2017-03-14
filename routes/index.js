var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('*', function(request, response) {
    response.sendfile('./public/app/index.html');
});

module.exports = router;
