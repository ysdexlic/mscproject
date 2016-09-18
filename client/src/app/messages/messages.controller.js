(function () {
  'use strict';

  angular.module('messages.module')
    .controller('messageCtrl', messageCtrl);

  function messageCtrl(parseApi, userApi, $log) {
    var vm = this;
    vm.messagingList = [];
    vm.linkList = [];
    vm.newThing = [];

    userApi.currentUser()
      .then(function(response) {
        vm.userId = response.objectId;
        parseApi.getMessages(vm.userId).then(function(response) {
          vm.messages = response.data.results;

          angular.forEach(response.data.results, function(messaging) {
            // push users currently messaging to the messaging list
            if(messaging.user1.objectId === vm.userId) {

              parseApi.getUser(messaging.user2.objectId)
                .then(function(response) {

                  parseApi.getMessagesFrom(messaging.objectId)
                    .then(function(message) {
                      vm.pictureStyle = {'background': 'url(' + response.data.picture.url + ') no-repeat center center / cover'};


                      vm.newThing.push(
                        {'username': response.data.username, 'messageId': messaging.objectId,
                          'updatedAt': messaging.updatedAt, 'userPicture': response.data.picture.url,
                          'pictureStyle':vm.pictureStyle, 'newestMessage': message.data.results[0]
                        });
                    });

                });

            }
            else {

              parseApi.getUser(messaging.user1.objectId)
                .then(function(response) {

                  parseApi.getMessagesFrom(messaging.objectId)
                    .then(function(message) {
                      vm.pictureStyle = {'background': 'url(' + response.data.picture.url + ') no-repeat center center / cover'};


                      vm.newThing.push(
                        {'username': response.data.username, 'messageId': messaging.objectId,
                          'updatedAt': messaging.updatedAt, 'userPicture': response.data.picture.url,
                          'pictureStyle':vm.pictureStyle, 'newestMessage': message.data.results[0]
                        });
                    });
                });

            }
          });
        });

      },
      function(error) {
        console.log(error);
      });


  }

})();
