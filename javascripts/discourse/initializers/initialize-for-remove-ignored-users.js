import {
  apiInitializer
} from "discourse/lib/api";
import discourseComputed, {
  on
} from "discourse-common/utils/decorators";

export default apiInitializer("0.11.1", api => {
  // set an id for your modifications
  const PLUGIN_ID = "ignore-plus";

  // The class name you want to add. The space at the start is required
  const IGNORED_TOPIC_CLASS_STRING = " ignored-op-topic";
  const IGNORED_AVATAR_CLASS_STRING = " ignored-user-avatar";

  // get current user
  const user = api.getCurrentUser();

  // not logged in, bail
  if (!user) {
    return;
  }

  // get a list of ignored users
  const ignoredUsers = user.ignored_users;
  // const ignoredUsers = ['codinghorror', 'david', 'pekka_gaiser', 'sam', 'adopilot'];

  if (!ignoredUsers?.length) {
    return
  }

  //check if user is ignored
  function isIgnoredUser(poster) {
    return ignoredUsers.includes(poster.user.username);
  }

  function addIgnoredTopicClass() {
    let classList = this._super(...arguments);

    const topicCreator = this.topic.posters[0];

    if (isIgnoredUser(topicCreator)) {
      classList += IGNORED_TOPIC_CLASS_STRING;
    }

    return classList;
  }

  function addIgnoredAvatarClass() {
    if (settings.hide_ignored_users_avatar) {
      this.topic.posters.forEach((poster) => {
        if (isIgnoredUser(poster)) {

          if (typeof poster?.user?.set !== 'function') {
            return
          }

          poster.extras += IGNORED_AVATAR_CLASS_STRING;
          poster.user.set("extras", IGNORED_AVATAR_CLASS_STRING);
        }
      });
    }
  }

  // add the class to the default topic list like on the "latest" page
  api.modifyClass("component:topic-list-item", {
    pluginId: PLUGIN_ID,

    @discourseComputed()
    unboundClassNames() {
      return addIgnoredTopicClass.call(this);
    },

    @on("didReceiveAttrs")
    ignoredAvatarClass() {
      addIgnoredAvatarClass.call(this);
    },
  });

  // do the same for the categories page topic list

  api.modifyClass("component:latest-topic-list-item", {
    pluginId: PLUGIN_ID,

    @discourseComputed()
    unboundClassNames() {
      return addIgnoredTopicClass.call(this);
    },

    @on("didReceiveAttrs")
    ignoredAvatarClass() {
      addIgnoredAvatarClass.call(this);
    },
  });

});