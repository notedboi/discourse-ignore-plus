import {
  apiInitializer
} from "discourse/lib/api";
import {
  on
} from "discourse-common/utils/decorators";

import discourseComputed from "discourse-common/utils/decorators";

export default apiInitializer("0.11.1", api => {
  // set an id for your modifications
  const PLUGIN_ID = "hide-ignored-op-topics";

  // The class name you want to add. The space at the start is required
  const IGNORED_TOPIC_CLASS_STRING = " ignored-op-topic";
  const IGNORED_AVATAR_CLASS_STRING = " ignored-lp-avatar";

  // get current user
  const user = api.getCurrentUser();

  // not logged in, bail
  if (!user) {
    return;
  }

  // get a list of ignored users
  // const ignored = user.ignored_users;
  const ignored = ['david', 'pekka_gaiser', 'sam', 'adopilot'];

  if (settings.filter_topics) {
    api.modifyClass("component:topic-list", {
      pluginId: PLUGIN_ID,
      @on("didReceiveAttrs")
      removeIgnoredUsers() {
        const filtered = this.topics.filter(
          topic => !ignored.includes(topic.posters[0].user.username)
        );
        this.set("topics", filtered);
      }
    });
  }

  // helper function to avoid duplicating code
  const addIgnoredTopicClass = context => {
    // get classes from core / other plugins and themes
    let classList = context._super(...arguments);

    // create your condition
    if (!settings.filter_topics) {
      const shouldAddClass = ignored.includes(
        context.topic.posters[0].user.username
      );

      // add ignored class if condition is true
      if (shouldAddClass) {
        classList += IGNORED_TOPIC_CLASS_STRING;
      }
    }

    if (settings.hide_ignored_lp_avatar) {
      if (ignored.includes(
          context.topic.last_poster_username
        )) {
        classList += IGNORED_AVATAR_CLASS_STRING;
      }
    }

    // return the classList plus the modifications if any
    return classList;
  };

  if (settings.filter_topics && !settings.hide_ignored_lp_avatar) {
    return
  }

  // add the class to the default topic list like on the "latest" page
  api.modifyClass("component:topic-list-item", {
    pluginId: PLUGIN_ID,
    @discourseComputed()
    unboundClassNames() {
      // console.log(this)
      return addIgnoredTopicClass(this);
    }
  });

  // do the same for the categories page topic list
  api.modifyClass("component:latest-topic-list-item", {
    pluginId: PLUGIN_ID,
    @discourseComputed()
    unboundClassNames() {
      return addIgnoredTopicClass(this);
    }
  });

});