cd /d "%~dp0"
uglifyjs src\es5-shim.js src\es6-shim.js src\jquery.js src/jquery.migrate.js src\require.js src\init.js -c hoist_vars,unsafe,comparisons --support-ie8 -m -o all.js