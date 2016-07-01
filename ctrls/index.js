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