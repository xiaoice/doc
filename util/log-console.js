/**
 * 日志模块-控制台输出-文件
 */

exports.trace = function(text) {
	console.log(text + "\n");
};

exports.debug = function(text) {
	console.log(text + "\n");
};

exports.info = function(text) {
	console.info(text + "\n");
};

exports.warn = function(text) {
	console.warn(text + "\n");
};

exports.error = function(text) {
	console.error(text + "\n");
};

exports.fetal = function(text) {
	console.error(text + "\n");
};
