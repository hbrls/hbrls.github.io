```bash
$ netstat -ano | findstr <port>
$ tasklist | findstr <pid>
```

1. [Notepad++](http://notepad-plus-plus.org/)
2. [MarkdownPad2](http://markdownpad.com/)
3. [Highlight](http://www.andre-simon.de/doku/highlight/en/highlight.php)
4. [Microsoft OpenJDK](https://learn.microsoft.com/en-us/java/openjdk/download)
5. [MSYS2 UCRT64](https://www.msys2.org/)
    1. `pacman -Syu`
    2. `pacman -S mingw-w64-ucrt-x86_64-gcc`
    3. `gcc --version`
    4. `pacman -S mingw-w64-ucrt-x86_64-make`
    5. `mingw32-make --version`
