/**
 * 日志模块
 */

// 日志级别
var TRACE = 0;
var DEBUG = 1;
var INFO = 2;
var WARN = 3;
var ERROR = 4;
var FETAL = 5;

var config = require('../dao/config-db.js');

exports.time = function(label) {
	console.time(label);
};

exports.timeEnd = function(text) {
	console.timeEnd(label);
};

exports.trace = function(text) {
	if(TRACE >= config.log_level) {
		require('./log-' + config.log_type + '.js').trace(text);
	}
};

exports.debug = function(text) {
	if(DEBUG >= config.log_level) {
		require('./log-' + config.log_type + '.js').debug(text);
	}
};

exports.info = function(text) {
	if(INFO >= config.log_level) {
		require('./log-' + config.log_type + '.js').info(text);
	}
};

exports.warn = function(text) {
	if(WARN >= config.log_level) {
		require('./log-' + config.log_type + '.js').warn(text);
	}
};

exports.error = function(text) {
	if(ERROR >= config.log_level) {
		require('./log-' + config.log_type + '.js').error(text);
	}
};

exports.fetal = function(text) {
	if(FETAL >= config.log_level) {
		require('./log-' + config.log_type + '.js').fetal(text);
	}
};
