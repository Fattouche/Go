var http = require("http");

console.log("inside of aiInterface");

function getRandomMove(size, board, lastMove, cb){
	var options = {
		host:'roberts.seng.uvic.ca',
		path:'/ai/maxLibs',
		port: '30000',
		method: 'POST',
		headers:{
			'Content-type': 'application/json'
		}
	}	
	
	var callback = function(response){
		var str="";
		response.on('data',function(chunk){
			str += chunk.toString();
		});
		response.on('end',function(){
			console.log(str);
			cb(JSON.parse(str));
			console.log('no more response');
	});
}
	var postData = {
		'size':size,
		'board':board,
		'last':lastMove,
	}
	
	
	var req = http.request(options,callback);
	
	req.on('error',function(e){
		console.log('problem with request: ${e.message}');
	});
	
	req.write(JSON.stringify(postData));
	
	req.end();
	
	
	

}



module.exports = {
    getRandomMove : getRandomMove
}