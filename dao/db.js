/**
 * 数据库模块
 */

var log = require('../util/log');
var config = require("./config-db");
var mysql = require('mysql');

var options = {
	'host': config.db_host,
	'port': config.db_port,
	'user': config.db_user,
	'password': config.db_passwd,
	'database': config.db_database,
	'charset': config.db_charset,
	'connectionLimit': config.db_conn_limit,
	'supportBigNumbers': true,
	'bigNumberStrings': true
};

var pool = mysql.createPool(options);

/**
 * 释放数据库连接
 */
exports.release = function(connection) {
	connection.end(function(error) {
		log.debug('Connection closed');
	});
};

/**
 * 执行查询
 */
exports.execQuery = function(options) {
	pool.getConnection(function(error, connection) {
		if(error) {
			log.error('DB-获取数据库连接异常！');
			throw error;
		}

		/*
		 * connection.query('USE ' + config.db, function(error, dbResult) { if(error) { log.error('DB-选择数据库异常！'); connection.end(); throw error; } });
		 */

		// 查询参数
		var sql = options['sql'];
		var args = options['args'];
		var callback = options['callback'];

		// 执行查询
		if(!args) {
			var query = connection.query(sql, function(error, dbResult) {
				if(error) {
					//log.error('DB-执行查询语句异常！');
					throw error;
				}

				// 处理结果
				callback&&callback(null,dbResult);
			});

			//log.debug(query.sql);
		} else {
			var query = connection.query(sql, args, function(error, dbResult) {
				if(error) {
					//log.error('DB-执行查询语句异常！');
					//throw error;
				}
				// 处理结果
				callback&&callback(error,dbResult);
			});

			log.debug(query.sql);
		}

		// 返回连接池
		connection.release(function(error) {
			if(error) {
				log.error('DB-关闭数据库连接异常！');
				throw error;
			}
		});
	});
};
