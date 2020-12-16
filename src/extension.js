const vscode = require('vscode');

/**
 * 插件被激活时触发，所有代码总入口
 * @param {*} context 插件上下文
 */
exports.activate = function(context) {
    console.log('恭喜，您的沙雕扩展“vscode-plugin”已被激活！');
	require('./showCatalog')(context); // helloworld
	vscode.window.showInformationMessage('Hello ，showCatalog插件启动成功');
};

/**
 * 插件被释放时触发
 */
exports.deactivate = function() {
    console.log('您的沙雕扩展“vscode-plugin”已被释放！')
};