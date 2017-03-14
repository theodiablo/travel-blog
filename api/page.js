var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Tag = new Schema({
	name: { type: String, required: true, trim: true},
	content: { type: String, required: true, trim: true}
});
var Comment = new Schema({
	author: { type: String, required: true, trim: true},
	email: { type: String, required: true, trim: true},
	comment: { type: String, required: true},
	creation_date: {type: Date, default:Date.now},
	validated: {type:Boolean, default:false}
});


var Page = new Schema({
    title: { type: String, required: true, trim: true},
    description: String,
    language: String,
    url: { type: String, required: true, trim: true, index:{unique:true}},
    content: String,
    menuIndex: Number,
    creation_date: {type: Date, default:Date.now},
    status: { type: String, required: true, trim: true, default:"draft"},
    tags: {type: [Tag], default:[]} ,
    comments: {type: [Comment], default:[]}
});
var Page = mongoose.model('Page', Page);


module.exports=Page;