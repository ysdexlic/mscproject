(function () {
  'use strict';

  angular.module('message-detail.module')
    .controller('messageDetailCtrl', messageDetailCtrl);

  function messageDetailCtrl($stateParams, parseApi, userApi, $log, $scope, $window, $location) {

    if($stateParams.messageId === ''){
      $location.path('/home');
    }

    var vm = this;

    vm.messageList = [];
    vm.originalLimit = 10;
    vm.skip = 0;


    userApi.currentUser().then(function(response) {
      vm.userId = response.objectId;
      vm.username = response.username;

      parseApi.getMessagesBetween($stateParams.messageId)
        .then(function(response) {
          if(response.data.user1.objectId === vm.userId) {
            vm.getOtherUser(response.data.user2.objectId);
          }
          else {
            vm.getOtherUser(response.data.user1.objectId);
          }
        });
      $window.scrollTo(0,document.body.scrollHeight);
    });


    vm.getMessagesFrom = function (messageId, limit, skip){


      parseApi.getMessagesFrom(messageId, limit, skip)
        .then(
          function (result) {
            // Successful get
            vm.data = result.data.results;


            angular.forEach(result.data.results,function(message) {

              parseApi.getUser(message.user.objectId)
                .then(function(response) {

                  if(message.user.objectId === vm.userId) {
                    vm.ngMessageStyle = {'float': 'right'};
                    vm.ngMessageBubbleStyle = {'background':'#3AC0EC', 'border': '#3AC0EC solid 3px'};
                    vm.messageBubbleBool = true;
                    vm.pictureStyle = {'background': 'url(' + response.data.picture.url + ') no-repeat center center / cover'};

                  }
                  else {
                    vm.ngMessageStyle = {'float': 'left'};
                    vm.ngMessageBubbleStyle = {'background':'#C6C7C7', 'border': '#C6C7C7 solid 3px'};
                    vm.messageBubbleBool = false;
                    vm.pictureStyle = {'background': 'url(' + response.data.picture.url + ') no-repeat center center / cover'};
                  }

                  vm.messageList.push(
                    {
                      'messageUserId':message.user.objectId ,'messageUsername':response.data.username,
                      'messageContent':message.content, 'messageCreatedAt':message.createdAt,
                      'messageId':message.objectId, 'messagePicture':response.data.picture.url,
                      'messageStyle':vm.ngMessageStyle, 'messageBubbleStyle':vm.ngMessageBubbleStyle,
                      'messageSender':vm.messageBubbleBool, 'pictureStyle':vm.pictureStyle
                    }
                  );
                });
            });

          },
          function (error) {
            // Get failed, display error message
            $log.debug('Error occurred');
            vm.errorMessage = error.message;
          });

    };


    vm.getMessagesFrom($stateParams.messageId, vm.originalLimit, vm.skip);



    vm.getOtherUser = function (userId) {
      parseApi.getUser(userId)
        .then(function(response) {
          vm.otherUser = response.data;
        });
    };


    vm.getOlderMessages = function() {
      vm.skip += vm.originalLimit;
      vm.getMessagesFrom($stateParams.messageId, vm.originalLimit, vm.skip);

    }; 


    vm.sendMessage = function (userId, message) {

      vm.userData = {'__type':'Pointer', 'className':'_User', 'objectId':userId};
      vm.messageData = {'__type':'Pointer', 'className':'Messaging', 'objectId':$stateParams.messageId};
      vm.newDate = new Date();

      parseApi.create('Messages', {'user':vm.userData, 'message':vm.messageData, 'content':message})
        .then(function(response){
          vm.skip += 1;

          parseApi.edit('Messaging', $stateParams.messageId, {'updatedAt': vm.newDate})
            .then(function(response) {
              //console.log(response);
            });

          $('#message-text').val('');
          vm.getNewMessage(response.data.objectId);

        });

    };

    vm.getNewMessage = function (messageId) {

      parseApi.get('Messages/' + messageId)
        .then(function(message) {

          parseApi.getUser(message.data.user.objectId)
            .then(function(response) {

              vm.ngMessageStyle = {'float': 'right'};
              vm.ngMessageBubbleStyle = {'background':'#3AC0EC', 'border': '#3AC0EC solid 3px'};
              vm.messageBubbleBool = true;
              vm.pictureStyle = {'background': 'url(' + response.data.picture.url + ') no-repeat center center / cover'};


              vm.messageList.push(
                {
                  'messageUserId':message.data.user.objectId ,'messageUsername':response.data.username,
                  'messageContent':message.data.content, 'messageCreatedAt':message.data.createdAt,
                  'messageId':message.data.objectId, 'messagePicture':response.data.picture.url,
                  'messageStyle':vm.ngMessageStyle, 'messageBubbleStyle':vm.ngMessageBubbleStyle,
                  'messageSender':vm.messageBubbleBool, 'pictureStyle':vm.pictureStyle
                }
              );
            });

        });

    };

  }

})();
