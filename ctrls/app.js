app.controller('appCtrl', function($scope) {
	$scope.$on('event:openMenu', function(event, args) {
		$scope.$broadcast('event:openMenuSend', args);
		$scope.bgMode = true;
	});
	$scope.$on('event:closeDialog', function(event, args) {
		$scope.bgMode = false;
	})
});
