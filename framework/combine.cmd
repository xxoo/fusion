cd /d "%~dp0"
terser src\polyfill.js src\require.js src\jsex.js src\init.js -c hoist_vars,unsafe,comparisons --safari10 -m -o all.js