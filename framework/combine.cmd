cd /d "%~dp0"
terser src\es5-shim.js src\es6-shim.js src\jquery.js src/jquery.migrate.js src\require.js src\jsex.js src\init.js -c hoist_vars,unsafe,comparisons --ie8 --safari10 -m -o all.js