@echo off

:Main

rem jsduck ../src --builtin-classes --output ../docs --title "tmlib.js docs"
jsduck ../src --output ../docs --title "tmlib.js docs"


pause

goto Main