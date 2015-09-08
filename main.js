/**
 * Created by u6028908 on 06/07/2015.
 */

var azure = require('azure-storage');
var fs = require("fs");
var path = require("path");
/**
 * Default storage account settings
 */
global.storageAccount = require('./config.json').storageAccount;
global.storageAccessKey = require('./config.json').storageAccessKey;
global.host = require('./config.json').host;

/*
var blobService = azure.createBlobService();

// Create container

blobService.createContainerIfNotExists('taskcontainer', {
    publicAccessLevel: 'blob'
}, function(error, result, response) {
    if (!error) {
        if (result = true){
            console.log('container was created.')
        }
        if (result = false){
            console.log('container already existed.')
        }
    }
});

// Upload a blob
blobService.createBlockBlobFromLocalFile('mycontainer', 'taskblob', 'task1-upload.txt', function(error, result, response) {
    if (!error) {
        console.log('blob uploaded');
    }
});

*/


// Create a share
var fileService = azure.createFileService(global.storageAccount,global.storageAccessKey); //.withFilter(new azure.ExponentialRetryPolicyFilter());
// Set Proxy
fileService.setProxy({protocol:'http', host:'webproxy.lon.corp.services', hostname:'webproxy.lon.corp.services', port:80});

fileService.createShareIfNotExists('taskshare', function(error, result, response) {
    if (!error) {
         if (result) {
             console.log('share was created!')
         }
         else{
             console.log('share already existed!')
         }
    }
    else{
        console.error(error);
    }
});

// Create Directory
fileService.createDirectoryIfNotExists('taskshare', 'taskdirectory', function(error, result, response) {
    if (!error) {
        if (result) {
            console.log('directory was created!')
        }
        else{
            console.log('directory already existed!')
        }
    }
    else{
        console.error(error);
    }
});

// Upload file from local one
fileService.createFileFromLocalFile('taskshare', 'taskdirectory', 'taskfile1', 'task1-upload.txt', function(error, result, response) {
    if (!error) {
        if (result) {
            console.log('file uploaded!');
        }
        else{
            console.log('No file uploaded!');
        }
    }
    else{
        console.error(error);
    }
});

// list files and directories
var files = [];
var directories = ['taskdirectory'];

/*var azureCommon = require(path.join(__dirname, '../lib/common/common.js'));
var Constants = azureCommon.Constants;
var HeaderConstants = Constants.HeaderConstants;  */

fileService.listFilesAndDirectoriesSegmented('taskshare', 'taskdirectory', null, function (error, result) {

    if (!error) {
            files.push.apply(files, result.entries.files);
            console.log("existing files: ", files);
            console.log("files last modified date: ",files.lastModifiedDate);
            directories.push.apply(directories, result.entries.directories);
            console.log("existing directories: ", directories);
            console.log("directories last modified date: ", directories.lastModifiedDate);
        var token = result.continuationToken;
        if(token){
            console.log("files: ", files);
            console.log("directories: ", directories);
        }
    }
        else {
            console.error(error);
            }

});



