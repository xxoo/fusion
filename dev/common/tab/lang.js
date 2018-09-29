'use strict';
define(['common/kernel/kernel'], function (kernel) {
	let chs = {
			reload: '重新加载',
			closeOther: '关闭其它标签',
			closeLeft: '关闭左侧标签',
			closeRight: '关闭右侧标签',
			error: '加载 ${res} 时发生了一个错误: ',
			update: '服务刚完成更新, 该页需要先重新加载才能访问. 是否立即刷新?'
		},
		cht = {
			reload: '重新載入',
			closeOther: '關閉其它標籤',
			closeLeft: '關閉左側標籤',
			closeRight: '關閉右側標籤',
			error: '載入 ${res} 時發生了一個錯誤: ',
			update: '服務剛完成更新, 該頁需要先重新載入才能訪問. 是否立即刷新?'
		},
		eng = {
			reload: 'Reload',
			closeOther: 'Close others',
			closeLeft: 'Close to the left',
			closeRight: 'Close to the right',
			error: 'An error occured while loading ${res}: ',
			update: 'The service is just updated. This page requires a reload to be accessible. Would you like to continue?'
		};
	return kernel.getLang({
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
	});
});