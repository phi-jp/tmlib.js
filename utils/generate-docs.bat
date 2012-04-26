@echo off

:Main

rem jsduck ../src --builtin-classes --output ../docs
jsduck ../src --output ../docs


pause

goto Main