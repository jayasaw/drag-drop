angular.module('fileUploder', ['ngFileUpload'])
    .directive('fileUpload', function () {
        return {
            templateUrl: './file-upload/file-upload.html',
            controller: 'fileUploadCtrl',
            bindToController: true,
            scope: {
                url: '@'
            },
            controllerAs: 'fileUpload',
        }
    })
    .controller('fileUploadCtrl', function ($scope, Upload, $timeout) {
        var vm = this;
        vm.fileHistroy = [];
        $scope.files = [];
        $scope.$watch('files', function () {
            $scope.upload($scope.files);
        });
        for (var i = 0; i < $scope.files.length; i++) {
            var file = $scope.files[i];
            console.log($scope.files[i])
            if (files.type.indexOf("image") !== -1) {
                // previewFile(file);								
            } else {
                alert(file.name + " is not supported");
            }
        }

        $scope.$watch('file', function () {
            if ($scope.file != null) {
                $scope.$on("fileSelected", function (event, args) {
                    $scope.$apply(function () {
                        $scope.files.push($scope.file);
                    });
                    // $scope.files.push($scope.file);

                });
            }

        });


        $scope.upload = function (files) {
            if (files && files.length) {
                $scope.files.forEach(function (file, index) {

                    if (!file.$error) {
                        vm.fileHistroy.unshift(file);
                        console.log(vm.fileHistroy);
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            $scope.$on("fileSelected", function (event, args) {
                                $scope.$apply(function () {
                                    $scope.files.push($scope.file);
                                });
                                // $scope.files.push($scope.file);

                            });
                            file.src = e.target.result;
                        }

                        reader.readAsDataURL(file);
                        Upload.upload({
                            // url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
                            url: vm.url,
                            data: {
                                username: $scope.username,
                                file: file
                            }
                        }).then(function (resp) {
                            console.log('file uploaded successfully');
                        }, function (resp) {
                            console.log('Error status: ' + resp.status);
                        }, function (evt) {

                            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                            file.progress = progressPercentage + '% done';
                            file.style = { 'width': progressPercentage + '%' };

                        });
                    }
                })
            }
            $scope.remove = function (file) {
                var index = vm.fileHistroy.indexOf(file);
                vm.fileHistroy.splice(index, 1)
            }

        }

    })


