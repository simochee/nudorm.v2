const app = angular.module('myapp', ['ngRoute', 'ngStorage']);

app.config(function($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl: 'views/index.html',
		controller: 'indexCtrl'
	});
});

// 各種サービスの定義
app.constant('utils', {
	now: function() {
		const d = new Date();
		return {
			y: d.getFullYear(),
			m: d.getMonth() + 1,
			d: d.getDate(),
			w: d.getDay(),
			h: d.getHours(),
			i: d.getMinutes(),
			s: d.getSeconds(),
			u: Math.floor(d.getTime() / 1000)
		}
	},
	zero: function(n, l = 2) {
		return ('00000000' + n).slice(-l);
	},
	monthLen: function(m = this.now().m, y = this.now().y) {
		return ~[1,3,5,7,8,10,12].indexOf(m) ? 31 :
			   ~[4,6,9,11].indexOf(m) ? 30 :
			   y % 4 == 0 || (y % 100 == 0 && y % 400 != 0) ? 29 : 28;
	},
	getWeek: function(d = 1, m = this.now().m, y = this.now().y) {
		const D = new Date(`${y}-${this.zero(m)}-${this.zero(d)}`);
		return D.getDay();
	},
	WEEK: {
		ja: ['日', '月', '火', '水', '木', '金', '土'],
		en: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
	}
});

app.controller('appCtrl', function($scope) {
	$scope.$on('event:openMenu', function(event, args) {
		$scope.$broadcast('event:openMenuSend', args);
		$scope.bgMode = true;
	});
	$scope.$on('event:closeDialog', function(event, args) {
		$scope.bgMode = false;
	})
});

app.controller('indexCtrl', ['$scope', '$timeout', '$http', '$localStorage', 'utils', function($scope, $timeout, $http, $localStorage, utils) {
	$scope.$storage = $localStorage.$default({
		menuList: null,
		listUpdate: null
	});
	const now = utils.now();
	if($scope.$storage.menuList == null || now.u - $scope.$storage.listUpdate > 604800) {
		$timeout(function() {
			$http.get(`menu/${now.y}${utils.zero(now.m)}.json`)
			.success(function(data) {
				$scope.$storage.menuList = data;
			})
			.error(function(err) {
				console.error('Error! JSON file is not found...');
			});
		});
		$scope.$storage.listUpdate = now.u;
	}
	const menuList = $scope.$storage.menuList;
	$scope.menuList = menuList;
	$scope.getWeek = function(date) {
		return utils.WEEK.en[utils.getWeek(date)];
	}
	$scope.isToday = function(i) {
		return i == now.d ? true : false;
	}
	$scope.openMenu = function($idx) {
		if($idx != now.d) {
			$scope.$emit('event:openMenu', {
				week: utils.getWeek($idx),
				menu: menuList[$idx]
			});
		}
	}
	$scope.jumpToday = function() {
		const pos = $('.today').offset().top - 30;
		$('body,html').animate({
			scrollTop: pos
		}, 250, 'swing');
	}
}]);

app.controller('nextMenuCtrl', ['$scope', '$timeout', '$http', 'utils', function($scope, $timeout, $http, utils) {
	const now = utils.now();
	const nowTime = `${utils.zero(now.h)}${utils.zero(now.m)}`;
	$scope.menuList;
	if(nowTime > 1940) {
		if(now.d == utils.monthLen()) {
			if(now.m == 12) {
				$http.get(`menu/${now.y + 1}01.json`)
				.success(function(data) {
					$scope.menuList = data;
				})
				.error(function(err) {
					console.error('データベースが見つかりませんでした。');
				});
			} else {
				$http.get(`menu/${now.y}${utils.zero(now.m + 1)}.json`)
				.success(function(data) {
					$scope.menuList = data;
				})
				.error(function(err) {
					console.error('データベースが見つかりませんでした。');
				})
			}
		}
		else {
			$scope.menuList = $scope.$storage.menuList[now.d + 1];
		}
		$scope.time = '明日 朝';
		$scope.menu = $scope.menuList.breakfast;
		$scope.isBF = true;
	} else if(nowTime > 1250) {
		$scope.time = '夜';
		$scope.menu = $scope.$storage.menuList[now.d].dinner;
	} else if(nowTime > 830) {
		$scope.time = '昼';
		$scope.menu = $scope.$storage.menuList[now.d].lunch;
	} else {
		$scope.time = '朝';
		$scope.menu = $scope.$storage.menuList[now.d].breakfast;
	}
}]);

app.controller('menuDialogCtrl', ['$scope', 'utils', function($scope, utils) {
	$scope.$on('event:openMenuSend', function(event, data) {
		const menu = data.menu;
		$scope.isOpen = true;
		$scope.date = menu.date;
		$scope.week = utils.WEEK.en[data.week];
		$scope.bf = menu.breakfast;
		$scope.lc = menu.lunch;
		$scope.dn = menu.dinner;
	});
	$scope.closeDialog = function() {
		$scope.isOpen = false;
		$scope.$emit('event:closeDialog', []);
	}
}]);