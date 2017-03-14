var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Page= require('../api/page');
var adminUser= require('../api/admin_users');

module.exports = router;


/**************
	Public API
***************/
router.get('/pages', function(request, response) {

        return Page.find({}, {'_id': 0}, function(err, pages) {
            if (!err) {
                return response.send(pages);
            } else {
            	console.log(err);
                return response.send(500, err);
            }
        });
    });

router.get('/pages/:url', function(request, response) {
    var url = request.params.url;
    Page.findOne({
        url: url
    }, {'_id': 0}, function(err, page) {
        if (err){
            return console.log(err);
        }
        return response.send(page);
    });
});

/***********
	Admin API
************/
router.post('/pages/admin-details/add', function(request, response) {
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

router.post('/pages/admin-details/update', function(request, response) {
    var id = request.body._id;

    Page.update({
        _id: id
    }, {
        $set: {
            title: request.body.title,
            url: request.body.url,
            content: request.body.content,
            menuIndex: request.body.menuIndex,
            date: new Date(Date.now())
        }
    }).exec();
    response.send("Page updated");
});

router.get('/pages/admin-details/delete/:id', function(request, response) {
    var id = request.params.id;
    Page.remove({
        _id: id
    }, function(err) {
        return console.log(err);
    });
    return response.send('Page id- ' + id + ' has been deleted');
});

router.get('/pages/admin-details/:id', function(request, response) {
    var id = request.params.id;
    Page.findOne({
        _id: id
    }, function(err, page) {
        if (err)
            return console.log(err);
        return response.send(page);
    });
});