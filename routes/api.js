var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Page= require('../api/page');
var adminUser= require('../api/admin_users');


module.exports = router;

/**
 * Check if the session is valid
 * @param  {[type]}   request  request to validate
 * @param  {[type]}   response
 * @param  {Function} next     next function to execute
 * @return {[type]}            return,
 */
function sessionCheck(request,response,next){
    console.log("Check session");
    if(request.session.user){
        next();
    } else{
        response.status(401).send('authorization failed');
    }
}

/**************
	Login API
***************/
router.post('/add-user', function(request, response) {
    var salt, hash, password;
    password = request.body.password;
    salt = bcrypt.genSaltSync(10);
    hash = bcrypt.hashSync(password, salt);

    var AdminUser = new adminUser({
        username: request.body.username,
        password: hash
    });
    AdminUser.save(function(err) {
        if (!err) {
            return response.send('Admin User successfully created');

        } else {
            return response.send(err);
        }
    });
});

router.post('/login', function(request, response) {
  var username = request.body.username;
  var password = request.body.password;

  adminUser.findOne({
    username: username
  }, function(err, data) {
    if (err | data === null) {
      return response.send(401, "User Doesn't exist");
    } else {
      var usr = data;

      if (username == usr.username && bcrypt.compareSync(password, usr.password)) {
        console.log(request.session);
        request.session.regenerate(function() {
          request.session.user = username;
          return response.send(username);

        });
      } else {
        return response.send(401, "Bad Username or Password");
      }
    }
  });
});

router.get('/logout', function(request, response) {
    request.session.destroy(function() {
        return response.send(401, 'User logged out');

    });
});

/***********
	Admin API
************/

router.post('/pages/admin-details/add', sessionCheck, function(request, response) {
    var page = new Page({
        title: request.body.title,
        description: request.body.description,
        language: request.body.language,
        url: request.body.url,
        content: request.body.content,
        menuIndex: request.body.menuIndex,
        creation_date: new Date(Date.now()),
        tags: request.body.tags,
        comments: request.body.comments
    });

    page.save(function(err) {
        if (!err) {
            return response.send(200, page);

        } else {
            return response.status(500).send(err);
        }
    });
});

router.post('/pages/admin-details/update', sessionCheck, function(request, response) {
    var id = request.body._id;

    Page.update({
        _id: id
    }, {
        $set: {
            title: request.body.title,
            description: request.body.description,
            language: request.body.language,
            url: request.body.url,
            content: request.body.content,
            menuIndex: request.body.menuIndex,
            creation_date: new Date(Date.now()),
            tags: request.body.tags,
            comments: request.body.comments,
            title: request.body.title,
            url: request.body.url,
            content: request.body.content,
            menuIndex: request.body.menuIndex,
            update_date: new Date(Date.now())
        }
    }).exec();
    response.send("Page updated");
});

router.get('/pages/admin-details/delete/:id', sessionCheck, function(request, response) {
    var id = request.params.id;
    Page.remove({
        _id: id
    }, function(err) {
        return console.log(err);
    });
    return response.send('Page id- ' + id + ' has been deleted');
});

router.get('/pages/admin-details/', sessionCheck, function(request, response) {
    return Page.find(function(err, pages) {
        if (!err) {
            return response.send(pages);
        } else {
            return response.status(500).send(err);
        }
    });
});

router.get('/pages/admin-details/:id', sessionCheck, function(request, response) {
    var id = request.params.id;
    Page.findOne({
        _id: id
    }, function(err, page) {
        if (err)
            return console.log(err);
        return response.send(page);
    });
});


/**************
    Public API
***************/
router.get('/pages/', function(request, response) {

        return Page.find({}, {'_id': 0, '__v':0, 'content':0, 'comments':0}, function(err, pages) {
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
    }, {'_id': 0, '__v':0}, function(err, page) {
        if (err){
            return console.log(err);
        }
        return response.send(page);
    });
});