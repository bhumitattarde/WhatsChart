import sw from "stopword";

/**
 * sorts the map in descending order of values
 * @param {Map} map map to sort
 * @returns {Map} sorted map
 */
const sortMap = map => new Map([...map.entries()].sort((a, b) => b[1] - a[1]));

// languages supported by stopword package (to remove stopwords from chats)
const supportedLangs = new Map([
	["af", sw.af],
	["ar", sw.ar],
	["bg", sw.bg],
	["bn", sw.bn],
	["br", sw.br],
	["ca", sw.ca],
	["cs", sw.cs],
	["da", sw.da],
	["de", sw.de],
	["el", sw.el],
	["en", sw.en],
	["eo", sw.eo],
	["es", sw.es],
	["et", sw.et],
	["eu", sw.eu],
	["fa", sw.fa],
	["fr", sw.fr],
	["fi", sw.fi],
	["ga", sw.ga],
	["gl", sw.gl],
	["ha", sw.ha],
	["he", sw.he],
	["hi", sw.hi],
	["hr", sw.hr],
	["hu", sw.hu],
	["hy", sw.hy],
	["id", sw.id],
	["it", sw.it],
	["ja", sw.ja],
	["ko", sw.ko],
	["la", sw.la],
	["lgg", sw.lgg],
	["lggo", sw.lggo],
	["lv", sw.lv],
	["mr", sw.mr],
	["my", sw.my],
	["nl", sw.nl],
	["no", sw.no],
	["pa", sw.pa],
	["pl", sw.pl],
	["pt", sw.pt],
	["ptbr", sw.ptbr],
	["ro", sw.ro],
	["ru", sw.ru],
	["sk", sw.sk],
	["sl", sw.sl],
	["so", sw.so],
	["st", sw.st],
	["sv", sw.sv],
	["sw", sw.sw],
	["th", sw.th],
	["tr", sw.tr],
	["vi", sw.vi],
	["yo", sw.yo],
	["zh", sw.zh],
	["zu", sw.zu]
]);

export { sortMap, supportedLangs };
