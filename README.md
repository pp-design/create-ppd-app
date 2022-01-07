# ppd-cli
```
PPD Cli脚手架
```

## Project setup
```
ppd create <projectName> [options]
参数说明：
    projectName                     全小写字母，使用 . 则在当前目录创建
    options     
        -f, --force                 强制创建，如果当前有目录则会删除
        -t, --template <name>       模板名称
        -g, --git [url]             自定义模板 git 地址，在拉取自定义时候使用
        -x, --proxy                 代理地址
        -r, --registry <url>        源地址URL
```

```
ppd update <projectName> 
参数说明：
    projectName                     全小写字母，使用 . 则在当前目录更新
```
