/**
 * 模块依赖
 */

var db = require("./db");
var baseDao = require("./baseDao");

/**
 * DAO: insert
 */
exports.insert = function(vo, callback) {
	var r=baseDao.convertInsertFields(vo);
	db.execQuery({
		"sql": "INSERT INTO PRODUCT("+r.fields.join(',')+") VALUES("+r.values.join(',')+")",
		"args": r.args,
		"callback": callback
	});
};

/**
 * DAO: update
 */
exports.updateById = function(args, callback) {
    var r=baseDao.convertUpdateFields(args.vo);
    db.execQuery({
        "sql": "UPDATE PRODUCT SET "+r.fields.join(',')+" WHERE id="+args.id,
        "args": r.values,
        "callback": callback
    });
};

/**
 * DAO: findPage
 */
exports.findListByPage = function(args, callback) {
    db.execQuery({
        "sql": "SELECT " + args.wheres + " FROM PRODUCT ORDER BY id DESC LIMIT ?,?",
        "args": [args.start, args.end],
        "callback": callback
    });
};

/**
 * DAO: findById
 */
exports.findById = function(id, callback) {
    db.execQuery({
        "sql": "SELECT * FROM PRODUCT WHERE id=?",
        "args": [id],
        "callback":function(err,data){
            callback&&callback(err,data.length>0?data[0]:{});
        }
    });
};

/**
 * DAO: delete
 */
exports.deleteById = function(id, callback) {
    db.execQuery({
        "sql": "DELETE FROM PRODUCT WHERE id=?",
        "args": [id],
        "callback": callback
    });
};

/**
 * DAO: findAll
 */
exports.findAll = function(callback) {
	db.execQuery({
		"sql": "SELECT * FROM PRODUCT ORDER BY id DESC",
		"callback": callback
	});
};


/**
 * DAO: count
 */
exports.count = function(args, callback) {
	db.execQuery({
		"sql": "SELECT COUNT(*) AS count FROM PRODUCT WHERE catg IN (?)",
		args: [args.catgs],
		"callback": function(results) {
			callback(parseInt(results[0].count));
		}
	});
};

/**
 * DAO: excute
 */
exports.excute = function(sql, callback) {
	db.execQuery({
		"sql": sql,
		"callback": callback
	});
};
