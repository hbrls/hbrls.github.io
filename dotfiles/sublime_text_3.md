installation
============

[Package Control Installation](https://packagecontrol.io/installation)

[Package Repo](https://packagecontrol.io/)

packages
========

    SublimeLinter
    Less
    Sass
    Emmet
    BufferScroll
    Python PEP8 Autoformat      ctrl + shift + r
    Djaneiro
    Better CoffeeScript
    Babel
    RestructuredText Improved
    Anaconda

    InputHelper 
    $ cd ~/.config/sublime-text-3/Packages
    $ git clone https://github.com/xgenvn/InputHelper.git
    $ vim ~/.config/sublime-text-3/Packages/InputHelper/Default (Linux).sublime-keymap
    "keys": ["f2"]

settings
========

    {
        "binary_file_patterns": [
    		"*.jpg",
    		"*.jpeg",
    		"*.png",
    		"*.gif",
    		"*.ttf",
    		"*.tga",
    		"*.dds",
    		"*.ico",
    		"*.eot",
    		"*.pdf",
    		"*.swf",
    		"*.jar",
    		"*.zip",
    		"node_modules"
    	],
        "color_scheme": "Packages/Color Scheme - Default/Monokai.tmTheme",
        "default_line_ending": "unix",
        "ensure_newline_at_eof_on_save": true,
        "file_exclude_patterns": [
            "*.scc",
            "*.vspscc",
            "*.user",
            "*.pyc",
            ".DS_Store"
        ],
        "folder_exclude_patterns": [
            ".idea",
    		".git",
    		".svn",
    		".meteor",
    		".settings",
    		".sass-cache"
        ],
        "font_face": "Source Code Pro Light",
        "font_size": 14,
        "ignored_packages": [ "Vintage", "RestructuredText" ],
        "rulers": [80],
        "tab_size": 2,
        "translate_tabs_to_spaces": true,
        "trim_trailing_white_space_on_save": true,
    }
    
    # Preferences -> Settings More -> Syntax Specific - User
    # Python.sublime-settings
    { "tab_size": 4 }
