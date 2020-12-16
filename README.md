# 展示目录

## 需求
在资源管理器下新建一个treeView，展示txt的目录。

目录正则：第.*?卷 +.*?\r\n/g

## 问题
将工程放到别人的vscode下，不行。
开始我以为是版本问题，结果修改为低版本也不行。遂放弃。

## 使用
将工程下载，放到 %USERPROFILE%\.vscode\extensions 中，然后重启vscode。
资源管理器应该会出现一个目录节点，编辑区右键菜单也会出现`展示目录`，点击菜单，将当前txt的目录展示出来。

## 历程
我想编辑txt，但是想将目录展示出来。开始想用npp搞，结果c++难倒我了。

后来看到vs是js（ts）开发的，这个我应该熟一点吧？？？

然后就用这个开发，嗯，没用ts，因为接触的demo就是js，估计后期转为ts？？？

`下一步计划`:
* 展示多个文件目录，关闭文件时，自动删除目录。
* 打开epub

## md技巧：这个不用管。

\!\[feature X\]\(images/feature-x.png\)

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: enable/disable this extension
* `myExtension.thing`: set to `blah` to do something

**Note:** You can author your README using Visual Studio Code.  Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux)
* Toggle preview (`Shift+CMD+V` on macOS or `Shift+Ctrl+V` on Windows and Linux)
* Press `Ctrl+Space` (Windows, Linux) or `Cmd+Space` (macOS) to see a list of Markdown snippets

### For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**