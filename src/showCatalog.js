const vscode = require('vscode');
// import * as epub from 'epub';
// import * as epub from 'EPub';
module.exports = function (context) {
    /*向左-2栏（views）写入内容，那么必须有view的id
        cheerio:让你在服务器端和html愉快的玩耍.功能：jquery核心功能的一个快速灵活而又简洁的实现,主要是为了用在服务器端需要对DOM进行操作的地方。
    在使用cheerio时我们要手动加载我们的HTML文档
    var cheerio = require('cheerio'),$ = cheerio.load('<h2 class = "title">Hello world</h2>');
    $('h2.title').text('Hello there!');
    $('h2').addClass('welcome');
    直接把HTML字符串作为上下文也是可以的：
    $ = require('cheerio');$('ul', '<ul id = "fruits">...</ul>');
    基本的端到端测试显示它的速度至少是JSDOM的8倍,cheerio产生的原因是出于对JSDOM的失望
    
    标准的view：第一层是文章，第二层是目录-卷，第三层是目录-章。
    文章层面，设置 label 和 isBook ，名称和true。1.获取文章name 2.关闭txt页面，删除对应的key 3.新打开书，执行命令后加入。
    卷：得到卷arr后，for，得到每一行所在位置，
    
    */
    //目录对象
    context.subscriptions.push(vscode.commands.registerCommand('extension.showCatalog', () => {
        var catlog = {
            /* '书名': {
                '卷': [[{ '章的详细内容'}]]
            } */
        }
        var fileName = ''
        let editor = vscode.window.activeTextEditor;
        var bookUri = editor.document.fileName
        var fileNameArr = bookUri.split('\\')
        var fileName = fileNameArr[fileNameArr.length - 1]
        catlog[fileName] = {
            label: fileName,
            youare: 'book',
            isBook: true,
            isParent: true,
            isVolumn: false,
            volume: {},
            chapter: []
        }
        var allText1 = editor.document.getText()
        var volumeArr = allText1.match(/第.*?卷\s+.*?\r\n/g);
        var volumeObj = catlog[fileName]['volume']
        if (volumeArr) {
            /* 卷内容获取
                    首先获取第一卷的index，0-index是否有章节，有添加到chapter属性，未来排列卷，需要同步排列上去，但是属性和章一样。
                    找一个变量记录 firstIndex，if i+1 是否 > len ？说明没有下一卷，一直到末尾，得到章节 ：得到下一卷的下标，赋值给 secondIndex ，获取其中章节，写到volume.label.chapter里面。
                    
                    */
            var firstIndex = 0, secondIndex = 0
            for (var index = 0, l = volumeArr.length; index < l; index++) {
                try {
                    var item = volumeArr[index]
                    var volumeIndex = allText1.search(new RegExp(item, "g"))
                    volumeObj[item] = {
                        label: item,
                        youare: 'volumn',
                        isBook: false,
                        isParent: true,
                        isVolumn: true,
                        chapter: []
                    }
                    if (index == 0) {
                        var firstVolumnFrontContent = allText1.substring(0, volumeIndex)
                        if (firstVolumnFrontContent.length != 0) {
                            var firstVolumnFrontContentArr = firstVolumnFrontContent.match(/^.*?第.*?章\s+.*?\r\n/gm);
                            if (firstVolumnFrontContentArr && firstVolumnFrontContentArr.length != 0) {
                                for (var firstContentIndex in firstVolumnFrontContentArr) {
                                    var firstContentItem = firstVolumnFrontContentArr[firstContentIndex]
                                    catlog[fileName]['chapter'].push({
                                        label: firstContentItem,
                                        youare: 'chapter',
                                        isParent: false,
                                        isBook: false,
                                        isVolumn: false
                                    })
                                }
                            }
                        }
                    }
                    var firstVolumnFrontContent = ""
                    if ((index + 1) == l) {
                        firstVolumnFrontContent = allText1.substring(volumeIndex)
                    } else {
                        var volumeTwoIndex = allText1.search(new RegExp(volumeArr[index + 1], "g"))
                        firstVolumnFrontContent = allText1.substring(firstIndex, volumeTwoIndex)
                    }
                    var firstVolumnFrontContentArr = firstVolumnFrontContent.match(/^.*?第.*?章\s+.*?\r\n/gm);
                    if (firstVolumnFrontContentArr.length != 0) {
                        for (var firstContentIndex in firstVolumnFrontContentArr) {
                            var firstContentItem = firstVolumnFrontContentArr[firstContentIndex]
                            volumeObj[item]['chapter'].push({
                                label: firstContentItem,
                                youare: 'chapter',
                                isParent: false,
                                isBook: false,
                                isVolumn: false
                            })
                        }
                    }
                    firstIndex = volumeIndex
                } catch (e) {
                    console.log(e)
                    throw e
                }
            }
        } else {
            // 章内容获取
            var firstVolumnFrontContentArr = allText1.match(/^.*?第.*?章\s+.*?\r\n/gm);
            if (firstVolumnFrontContentArr && firstVolumnFrontContentArr.length != 0) {
                for (var firstContentIndex in firstVolumnFrontContentArr) {
                    var firstContentItem = firstVolumnFrontContentArr[firstContentIndex]
                    catlog[fileName]['chapter'].push({
                        label: firstContentItem,
                        youare: 'chapter',
                        isParent: false,
                        isBook: false,
                        isVolumn: false
                    })
                }
            }
        }


        // var array = allText1.match(/第.*?章 +.*?\r\n/g);
        console.log('调用extension.showCatalog命令')

        var TreeViewProvider = {
            /*  Get the children of `element` or root if no element is passed. 
            如果未传递元素，则获取“element”或root的子级 ,返回ProviderResult数组。
            用于获取某个节点下属的节点数组，根节点记为 null；
            最开始，e为undefined，如果有子节点-treeitem设置为展开，name点击后进入这里，得到子节点。
    
            e是数组，数组元素可以写成对象！
            */
            getChildren(element) {
                // return ['second', 'third'];
                console.log('调用getChildren：' + element)
                var wantArr = []
                if (element == null) {
                    // return array;
                    if (Object.keys(catlog).length != 0) {
                        var bookArr = []
                        for (var key in catlog) {
                            bookArr.push(catlog[key])
                        }
                        return bookArr
                    } else if (Object.keys(catlog[fileName]['volume']).length != 0) {
                        var volumnObj = catlog[fileName]['volume'];
                        var volumnArr = []
                        for (var key in volumnObj) {
                            volumnArr.push(volumnObj[key])
                        }
                        if (Object.keys(catlog[fileName]['chapter']).length != 0) {
                            wantArr = catlog[fileName]['chapter'].concat(volumnArr)
                            return wantArr
                        } else {
                            return volumnArr
                        }
                    } else if (Object.keys(catlog[fileName]['chapter']).length != 0) {
                        wantArr = catlog[fileName]['chapter']
                        return wantArr
                    }
                    return wantArr
                    // var volumnArr = Object.keys(volumeObj);
                } else if (element['youare'] == 'volumn') {
                    return element['chapter']
                } else if (element['youare'] == 'book') {
                    var volumnObj = element['volume'];
                    var volumnArr = []
                    for (var key in volumnObj) {
                        volumnArr.push(volumnObj[key])
                    }
                    if (Object.keys(element['chapter']).length != 0) {
                        wantArr = element['chapter'].concat(volumnArr)
                        return wantArr
                    } else {
                        return volumnArr
                    }
                }
            },
            /* 用于获取实际渲染的 TreeItem 实例。
            创建item有2中方式，label和uri方式。
            TreeItem = {
                label: 标题。
                collapsibleState: 该项是否折叠状态。参数有三： Collapsed(折叠状态)、Expanded(展开状态)、None(无状态)。
                ?: 代表参数为非必填项，可不传。注意：非必填项，必须放在最后面
                id:树的唯一id，未提供则自动生成。
                tooltip：鼠标放到上面显示提示内容
                command: 命令对象，其中arguments是传递的参数，在注册这个命令的时候，就将参数传递进去。
            }
            */
            getTreeItem(element) {
                let label = element.label
                // console.log('getTreeItem方法调用，参数是：' + label)
                var obj = {
                    label: label,
                    tooltip: label,
                    command: {
                        command: "itemClick",
                        title: "点击事件的" + label,
                        arguments: [                // 向 registerCommand 传递的参数。
                            label, "点击事件的" + label            // 目前这里我们只传递一个 label
                        ]
                    }
                }
                if (element['youare'] == 'chapter') {
                    obj['collapsibleState'] = vscode.TreeItemCollapsibleState.None
                } else {
                    obj['collapsibleState'] = vscode.TreeItemCollapsibleState.Collapsed
                }
                return obj
            }
        }
        // registerTreeDataProvider：注册树视图
        vscode.window.registerTreeDataProvider('beautifulGirl1', TreeViewProvider);
        // 为item注册点击命令
        context.subscriptions.push(vscode.commands.registerCommand('itemClick', (label, label2) => {
            // vscode.window.showInformationMessage(label + label2);
            // 跳转到章节
            let editor = vscode.window.activeTextEditor;
            var allText1 = editor.document.getText()
            let rowNum = allText1.split(/\r?\n|\r/).length
            // 返回匹配的起始坐标，只会返回第一处匹配的index。search返回label的第一个字母所在的下表。然后str.substring(0,index).split(/\r?\n|\r/).length
            // let index = allText1.search(//g)
            let index = allText1.search(new RegExp(label, "g"))
            let labelRowNum = allText1.substring(0, index).split(/\r?\n|\r/).length
            console.log(label + ':' + labelRowNum)
            // labelRowNum-1 ，就会在最顶端显示搜索行，但是为了好看，我们余2行，-3
            var wantNum = 1
            if (labelRowNum < 3) {
                wantNum = labelRowNum - 1
            } else {
                wantNum = labelRowNum - 3
            }
            let range = editor.document.lineAt(wantNum).range;
            // let range = new vscode.Range(147, 0,147,0)
            editor.revealRange(range, vscode.TextEditorRevealType.AtTop)
        }));
        vscode.window.showInformationMessage('Hello ，showCatalog命令，执行成功');
        // 创建view，第一个参数是view的id，第二个是参数对象TreeViewOptions 
        /* vscode.window.createTreeView('beautifulGirl', {
            treeDataProvider: TreeViewProvider,
            showCollapseAll: true
        }) */
    }));

    // 删除目录--不知道如何将菜单设置到viewItemId上，并且传递参数。后面在搞吧
    context.subscriptions.push(vscode.commands.registerCommand('extension.deleteCatalog', (label) => {
        console.log('删除' + label)

    }));

    // epub,喵的，无法导入
    /* var epub1 = new epub("book.epub");
    epub.on("end", function () {
        console.log(epub.spine);
    });
    epub.on("error", function (error) { });
    epub.parse(); */

};