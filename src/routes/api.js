var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Page= require('../api/page');
var adminUser= require('../api/admin_users');

/* User Routes. */

router.get('/', function(req, res) {
  res.send('Welcome to the API zone');
});

router.get('/pages', function(request, response) {

        return Page.find(function(err, pages) {
            if (!err) {
                return response.send(pages);
            } else {
                return response.send(500, err);
            }
        });
    });

module.exports = router;

router.post('/pages/add', function(request, response) {
    var page = new Page({
        title: request.body.title,
        url: request.body.url,
        content: request.body.content,
        menuIndex: request.body.menuIndex,
        date: new Date(Date.now())
    });

    page.save(function(err) {
        if (!err) {
            return response.send(200, page);

        } else {
            return response.send(500,err);
        }
    });
});