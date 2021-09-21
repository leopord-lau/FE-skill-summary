# `git`

`git`是一个开源的分布式版本控制系统。

## 安装
在`Windows`上使用`Git`，可以从`Git`官网直接下载安装程序，然后按默认选项安装即可。

安装完成后，在开始菜单里找到`“Git”`->`“Git Bash”`，出现一个类似命令行窗口的东西，就说明`Git`安装成功。

## 创建版本库
先创建一个空目录

```c
$ mkdir test    //创建一个test目录
$ cd test       //进入test目录
$ pwd           //查看目录位置
```
创建了目录之后就可以创建版本库了。
```c
$ git init
```
使用该命令初始化一个`git`仓库，在`test`目录里会生成一个`.git`目录，这个目录是`Git`来跟踪管理版本库的。因为`.git`是隐藏的，没有找到的可以`ls -ah`命令查看。

**将文件添加到仓库有2步：**

1、`git add` 可反复多次使用，添加多个文件；

2、`git commit -m <message>`    提交（添加注释） 

创建一个`test.txt`文件
```c
this is test txt.
```

使用 ```git add```命令将文件添加到仓库

```c
$ git add test.txt
```
执行上面的命令，没有任何显示。
然后将test.txt文件提交到仓库

```c
$ git commit -m "wrote a test file"
```
`git commit`命令，-m后面输入的是本次提交的说明，可以输入任意内容，当然最好是有意义的，这样你就能从历史记录里方便地找到改动记录。

为什么`Git`添加文件需要`add`，`commit`一共两步呢？因为`commit`可以一次提交很多文件，所以你可以多次`add`不同的文件

```c
$ git add test1.txt
$ git add test2.txt
$ git commit -m "add 2 more files"
```

## 文件修改
修改`test.txt`

```clike
this is a test txt.
add this line       //添加了这一行
```
使用`git status`命令查看结果

```c
$ git status
On branch master
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

        modified:   test.txt

no changes added to commit (use "git add" and/or "git commit -a")
```
`git status`命令可以时刻掌握仓库当前的状态，使用`git status`可以查看到修改后的文件，但是没有被`commit`。
通过`git diff `命令可以查看文件修改的具体内容。
```c
$ git diff test.txt 
```
```c
diff --git a/test.txt b/test.txt
index 0899c29..501aeaf 100644
--- a/test.txt
+++ b/test.txt
@@ -1 +1,2 @@
-this is a test txt.
\ No newline at end of file
+this is a test txt.
+add this line
\ No newline at end of file
```
可以很方便的查看`test`文件的修改内容。

之后将修改后的`test`文件`commit`到仓库中
```c
$ git add test.txt
$ git commit -m "add new distributed"
```

如果在第一个修改并`add`之后，在对文件进行修改，将文件`commit`后其实`commit`的文件只是第一次修改的文件，也就是说每一次修改都要进行一次`add`操作，所以说最好就是修改完文件之后在进行`add`操作。

## 版本回退
使用```git log```命令可以查看文件历史纪录，显示从最近到最远的提交日志。
```c
commit cdedb6409fdbb9764f5f8333053fb5ff84eb9696 (HEAD -> master)   //commit后面一大串的就是版本号，HEAD表示当前版本
Author: leo <2279846752@qq.com>
Date:   Thu Mar 26 11:27:23 2020 +0800

    add new distributed

commit dded04742342d4fb024bc81851b5b4be924375d4
Author: leo <2279846752@qq.com>
Date:   Thu Mar 26 11:11:41 2020 +0800

    add 2 more files

commit a3287242c5ce488074c7859fe3dc18499fa225fd
Author: leo <2279846752@qq.com>
Date:   Thu Mar 26 11:08:20 2020 +0800

    wrote a test file
```
在上面的输出中可以看到`commit`后面一大串的就是版本号，`HEAD`表示当前版本，通过版本号就可以访问对应的版本，上一个版本就是`HEAD^` ,上上个版本`HEAD^^`，之前很多个版本就可以写成`HEAD~ num`, (如 `HEAD~100`)。

通过`git reset`命令就可以实现版本回退
```c
$ git reset --hard HEAD^
```

就回退到了上个版本，查看`test.txt`文件
```c
$ cat test.txt
```
结果：
```c
this is a test txt.
```
这个版本就是没有添加 add this line 的版本。

此时通过`git log`查看版本的话可以看到
```c
commit dded04742342d4fb024bc81851b5b4be924375d4 (HEAD -> master)
Author: leo <2279846752@qq.com>
Date:   Thu Mar 26 11:11:41 2020 +0800

    add 2 more files

commit a3287242c5ce488074c7859fe3dc18499fa225fd
Author: leo <2279846752@qq.com>
Date:   Thu Mar 26 11:08:20 2020 +0800

    wrote a test file

```
之前最新的版本不见了，当前版本才是最新的。怎么才能回到最新的版本呢？

找到之前最新版本的版本号的前几位通过`git reset`就行了
可看到`cdedb`为最新版本的前几位（随意多少）
```c
$ git reset --hard cdedb
```
再查看版本`git log`
```c
commit cdedb6409fdbb9764f5f8333053fb5ff84eb9696 (HEAD -> master)   
Author: leo <2279846752@qq.com>
Date:   Thu Mar 26 11:27:23 2020 +0800

    add new distributed

commit dded04742342d4fb024bc81851b5b4be924375d4
Author: leo <2279846752@qq.com>
Date:   Thu Mar 26 11:11:41 2020 +0800

    add 2 more files

commit a3287242c5ce488074c7859fe3dc18499fa225fd
Author: leo <2279846752@qq.com>
Date:   Thu Mar 26 11:08:20 2020 +0800

    wrote a test file
```
又回到了最新的版本。
通过 `git reflog`可以查看每一次版本提交的命令（历史命令）
```c
$ git reflog
cdedb64 (HEAD -> master) HEAD@{0}: reset: moving to cdedb
dded047 HEAD@{1}: reset: moving to HEAD^
cdedb64 (HEAD -> master) HEAD@{2}: commit: add new distributed
dded047 HEAD@{3}: commit: add 2 more files
a328724 HEAD@{4}: commit (initial): wrote a test file
```


## git工作区、暂存区、版本库
工作区：项目文件的目录。

暂存区：英文叫`stage`, 或`index`。一般存放在 "`.git`目录下" 下的`index`文件（`.git/index`）中，所以我们把暂存区有时也叫作索引（`index`），`git add`命令就是将文件暂存至暂存区。

版本库：工作区有一个隐藏目录`.git`，版本库又名仓库，这个目录里面的所有文件都可以被`Git`管理起来，每个文件的修改、删除，`Git`都能跟踪，以便任何时刻都可以追踪历史，或者在将来某个时刻可以“还原”。`git commit`命令就是将文件提交之版本库中。


## 撤销文件修改
如果在对文件进行修改时保存了不必要的东西，在文件并未`add`至缓存区之前可以通过`git checkout -- file`命令进行撤销工作区的修改。
在`test.txt`文件中新增了一行 `stupid world`，可以删掉最后一行，也可以返回上一个版本，但是通过`git status`就是发现`test.txt`进行了修改，需要进行`commit`。

这时候`git checkout`命令就很有用了，可以撤销工作区的修改。
```c
$ git checkout -- test.txt
// -- 与文件名之间有空格
```
查看`test.txt`文件发现`stupid world` 果然不见了，而且`git status`也提示没有变化。

当文件修改已经add在暂缓区了

通过`git reset HEAD<file>`把暂存区的修改撤销掉（`unstage`），重新放回工作区。
```c
$ git reset HEAD test.txt
```
再用`git status`查看一下，现在暂存区是干净的，工作区有修改。
在通过`git checkout`命令撤销工作区的修改。

## 文件删除

直接手动删除文件，或者通过`rm filename`进行删除

```c
rm test2.txt
```

通过```git status```查看状态
```c
On branch master
Changes not staged for commit:
  (use "git add/rm <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

        deleted:    test2.txt

no changes added to commit (use "git add" and/or "git commit -a")

```
此时有两种操作，第一种就是通过```git rm <file>```进行版本库中删除，删除后进行commit
```c
$ git rm test2.txt
$ git commit -m "remove test2.txt"
```
第二种就是删除错了，可以在版本库中重新获取。
```c
$ rm test1.txt
$ git checkout -- test1.txt
```



# 远程git

在本地创建了一个`git`仓库后，可以在`GitHub`中也创建一个`git`仓库，通过远程同步，可以让其他人通过该仓库进行协作开发。


## 添加远程库
登录`GitHub`，创建一个`git`仓库。

在本地的`git`仓库中中运行命令
```c
$ git remote add orgin git@github.com:yourName/repositoryName.git
```
`yourName`为用户自己的GitHub账户名，`repositoryName`为用户远程的仓库名。

之后就可以将本地库的内容推送至远程库中了。
```c
$ git push -u origin master
```

第一次推送`master`分支时，加上了`-u`参数，`Git`不但会把本地的`master`分支内容推送的远程新的`master`分支，还会把本地的`master`分支和远程的`master`分支关联起来，在之后推送就可以直接用
```c
$ git push origin master
```
就可以了。

如果在`push`的时候出现了
```c
Warning: Permanently added the RSA host key for IP address '192.30.253.113' to the list of known hosts.
git@github.com: Permission denied (publickey).
```
错误的话,说明没有在`github`中添加公钥。

运行命令：
```c
ssh-keygen -t rsa -C 'yourName'
```
然后一直`enter`就行了，最后就会生成一个`id_rsa.pub`文件

复制该文件的内容，然后打开`GitHub`。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200327111330664.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQyODgwNzE0,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200327111338242.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQyODgwNzE0,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200327111347291.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQyODgwNzE0,size_16,color_FFFFFF,t_70)
进行添加就可以了。

## git的退出方式
如果在`commit` 的时候没有带上 `-m`参数，就会进入一个`commit change log`界面
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200327112238827.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQyODgwNzE0,size_16,color_FFFFFF,t_70)
这时候有两种退出方式：

1、保存并退出：

（1）按 `Esc` 键退出编辑模式，英文模式下输入 `:wq` ，然后回车。

（2）按 `Esc` 键退出编辑模式，大写英文模式下输入 `ZZ` ，然后回车。

2、不保存退出：
按 `Esc` 键退出编辑模式，英文模式下输入 `:q!` ，然后回车。


## 从远程库克隆
如果是从零开始开发，最好就是先创建远程库，然后从远程库中克隆。
在`GitHub`中创建一个`git`仓库，勾选初始化一个`README`文件。

远程仓库创建好之后使用```git clone```进行克隆。

```c
$ git clone git@github.com:yourName/repositoryName.git
```
成功之后就可以看到目录里边新增了远程仓库的文件。这个也是你本地的仓库。
```c
$ cd repositoryName
$ ls
README.md
```

## 分支管理
分支管理能让团队进行更好的合作。

创建一个 `bra1` 分支，然后切换至该分支
```c
$ git checkout -b bra1
Switched to a new branch 'bra1'
```
-b 表示创建并切换

使用`git branch`命令查看分支，* 代表当前分支
```c
$ git branch
* bra1 
  master
```
修改仓库中的文件，然后进行提交后，分支的工作完成后，切换回`master`分支。
```c
$ git checkout master
Switched to branch 'master'
```

查看之前修改的文件，会发现修改的内容并不存在，是因为之前修改是提交至`bra1`分支上，master的分支并没有改变，可以通过分支合并将bra1分支的工作结果合并到master中
```c
$ git merge bra1
Updating a566fe9..c443514
Fast-forward
 test.txt | 4 +++-
 1 file changed, 3 insertions(+), 1 deletion(-)
```
`merge` 命令将指定的分支合并到当前分支，之后就可以看到修改后的内容了。也就可以删除`bra1`分支了。
```c
$ git branch -d bra1
Delete branch bra1
```
之后再进行查看`branch`就只有`master`了
```c
$ git branch
* master
```

切换分支使用`git checkout <branch>`，和撤销修改`git checkout -- <file>`，同一个命令。容易混淆。
在2.23版本后可以使用`switch`命令进行分支管理。

创建切换
```c
$ git switch -c bra1
```

切换至其他分支
```c
$ git switch branchName
```

## 合并冲突
当在一个分支上修改了内容并提交了，然后又在`master`中修改内容并提交，此时两个分支的节点处在同个位置，这时候使用`git merge`命令的话就会出现`merge conflict`的提示，这时候只需要再次添加提交`master`分支就可以使得`master`分支跟另外一个分支处在不同的位置，就可以进行合并操作了。


## 暂时保存
如果在工作时需要处理一些`bug`，但是工作还没有完成，又不能`commit`，这时候就可以用`git stash`对文件进行进行暂时保存，等处理完后重新进行工作。
```
$ git stash
```
这时候使用`git status`命令查看是找不到的，要用`git stash list`对暂时保存的工作区域进行查看。
```c
$ git stash list
stash@{0}: WIP on bra1: b619442 conflict fixed
```

想要回到保存的工作区域，可以采用`git stash apply`命令，但是`stash`的内容依旧存在，需要用`git stash drop`来删除。当然也可以直接用`git stash pop`直接恢复同时也删除了`stash`的内容。
