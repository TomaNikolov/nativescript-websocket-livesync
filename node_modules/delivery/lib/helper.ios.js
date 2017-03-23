function makeBuffer(base64encoded){
	return NSData.alloc().initWithBase64Encoding(base64encoded);
}

module.exports = {
	makeBuffer: makeBuffer
}