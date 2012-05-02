var fs = require("fs");

exports.merge = function(files) {
    
    var fileContent = [];
    
    for (var i=0,len=files.length; i<len; ++i) {
        var filename = files[i];
        console.log(filename);
        
        var file = fs.readFileSync(filename);
        fileContent.push(file.toString());
    }
    
    return fileContent.join("\n\n");
};

