define(['angular', './controllers'], function (ng) {
    'use strict';

    return ng.module('ldvm.controllers')
        .controller('Hierarchy',
        [
            '$scope',
            '$routeParams',
            'Visualization',
            function (
                $scope,
                $routeParams,
                visualization
            ) {

                var id = $routeParams.id;
                if(!id){
                    return;
                }

                $scope.visType = $routeParams.type;

                $scope.schemes = [];
                $scope.scheme = null;
                $scope.queryingDataset = null;

                var promise = visualization.skosSchemes(id);
                $scope.queryingDataset = true;
                promise.then(function(schemes){
                    $scope.schemes = schemes;
                    $scope.queryingDataset = false;
                });

                $scope.loadScheme = function(scheme){
                    $scope.queryingDataset = true;
                    var schemePromise = visualization.skosScheme(id, scheme.uri);
                    schemePromise.then(function(scheme){
                        $scope.queryingDataset = false;
                        $scope.scheme = scheme;
                    });
                };

            }]);
});