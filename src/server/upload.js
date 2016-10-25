var formidable = require('formidable')
var util = require('util')
var fs = require('fs')

var dealFile = function(fileInfo) {
    var file = require('../db/models/file')
    var attachment = require('../db/models/attachment')
    return file.upsert({
        hash: fileInfo.hash,
        size: fileInfo.size,
        path: "upload/files/" + fileInfo.hash,
        type: fileInfo.type
    }).then(() => {
        return attachment.create({
            file_hash: fileInfo.hash,
            name: fileInfo.name
        })
    })
}

var file = function(req) {
    return new Promise(function(resolve, reject) {
        if (req.method.toLowerCase() == 'post') {
            var form = new formidable.IncomingForm();
            form.uploadDir = "upload/temp";
            form.maxFieldsSize = 2; //10G
            form.hash = "md5"

            if (!fs.existsSync("upload")) {
                fs.mkdirSync("upload")
            }

            if (!fs.existsSync("upload/files")) {
                fs.mkdirSync("upload/files")
            }
            if (!fs.existsSync("upload/temp")) {
                fs.mkdirSync("upload/temp")
            }

            form.on('file', function(name, file) {
                fs.rename(file.path, "upload/files/" + file.hash, function(result) {
                    dealFile(file).then((result) => {
                        resolve(result)
                    })
                })
            })
            form.on('error', function(err) {
                console.log('error' + err)
            })
            form.parse(req)
        } else {
            reject("please post")
        }
    })
}


module.exports = (req, res, next) => {
    var action = req.params.action
    Promise.resolve(action).then(function(result) {
        switch (result) {
            case "file":
                return file(req)
        }
    }).then(function(result) {
        res.send(result)
    }).catch(function(error) {
        res.status(500).send(error.toString())
    })
}