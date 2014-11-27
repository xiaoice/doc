/**
 * 模块依赖
 */

var db = require("./db");
var baseDao = require("./baseDao");
var fields="id,reservePrice,zkPrice,zkRate,zkType,calCommission,commissionRatePercent,userId,userType,userNumberId,nick,title,shopUrl,auctionUrl,pictUrl,groupIds,groupId,groupRate,groupCommission,totalNum,totalFee,auctionId,auctionType,auctionTag,sells,likes,hits,inventory,pass,status,isShow,isComments,seoTitle,seoKeys,seoDesc,createTime,addTime";


/**
 * DAO: insert
 */
exports.insert = function(vo, handler) {
	var fields=baseDao.getFields(vo);
	db.execQuery({
		"sql": "INSERT INTO PRODUCT("+fields.fields.join(',')+") VALUES("+fields.values+")",
		"args": fields.args,
		"handler": handler
	});
};

/**
 * DAO: update
 */
exports.update = function(tpc, handler) {
	db.execQuery({
		"sql": "UPDATE atom_topic SET catg=?, mflag=?, mpath=?, title=?, summary=?, content=?, gmt_modify=NOW() WHERE id=?",
		"args": [tpc.catg, tpc.mflag, tpc.mpath, tpc.title, tpc.summary, tpc.content, tpc.id],
		"handler": handler
	});
};

/**
 * DAO: delete
 */
exports.remove = function(id, handler) {
	db.execQuery({
		"sql": "DELETE FROM atom_topic WHERE id=?",
		"args": [id],
		"handler": handler
	});
};

/**
 * DAO: findID
 */
exports.findID = function(id, handler) {
	db.execQuery({
		"sql": "SELECT * FROM atom_topic WHERE id=?",
		"args": [id],
		"handler": handler
	});
};

/**
 * DAO: findAll
 */
exports.findAll = function(handler) {
	db.execQuery({
		"sql": "SELECT * FROM atom_topic ORDER BY id DESC",
		"handler": handler
	});
};

/**
 * DAO: count
 */
exports.count = function(args, handler) {
	db.execQuery({
		"sql": "SELECT COUNT(*) AS count FROM atom_topic WHERE catg IN (?)",
		args: [args.catgs],
		"handler": function(results) {
			handler(parseInt(results[0].count));
		}
	});
};

/**
 * DAO: findPage
 */
exports.findPage = function(args, handler) {
	db.execQuery({
		"sql": "SELECT " + fields_title + " FROM atom_topic WHERE catg IN (?) ORDER BY id DESC LIMIT ?,?",
		args: [args.catgs, args.offset, args.limit],
		"handler": handler
	});
};

/**
 * DAO: findMinID
 */
exports.findMinID = function(minId, handler) {
	db.execQuery({
		"sql": "SELECT * FROM atom_topic WHERE id>?",
		"args": [minId],
		"handler": handler
	});
};
