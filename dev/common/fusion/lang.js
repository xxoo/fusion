'use strict';
define(function () {
	const chs = {
		loading: '加载中...',
		yes: '是',
		no: '否',
		close: '关闭',
		error: '加载 ${res} 时发生了一个错误: ',
		update: '服务刚完成更新, 该页需要先重新加载才能访问. 是否立即刷新?'
	},
		cht = {
			loading: '載入中...',
			yes: '是',
			no: '否',
			close: '關閉',
			error: '載入 ${res} 時發生了一個錯誤: ',
			update: '服務剛完成更新, 該頁需要先重新載入才能訪問. 是否立即刷新?'
		},
		eng = {
			loading: 'Loading...',
			yes: 'Yes',
			no: 'No',
			close: 'Close',
			error: 'An error occured while loading ${res}: ',
			update: 'The service is just updated. This page requires a reload to be accessible. Would you like to continue?'
		};
	return {
		zh: chs,
		'zh-CN': chs,
		'zh-TW': cht,
		'zh-HK': cht,
		en: eng,
		'en-US': eng,
		'en-AU': eng,
		'en-CA': eng,
		'en-IN': eng,
		'en-NZ': eng,
		'en-ZA': eng,
		'en-GB': eng
	};
});