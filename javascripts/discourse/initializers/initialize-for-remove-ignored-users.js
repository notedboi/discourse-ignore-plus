import { apiInitializer } from "discourse/lib/api";
import discourseComputed from "discourse-common/utils/decorators";

export default apiInitializer("0.11.1", api => {
  // set an id for your modifications
  const PLUGIN_ID = "hide-ignored-op-topics";

  // The class name you want to add. The space at the start is required
  const IGNORED_TOPIC_CLASS_STRING = " ignored-op-topic";

  // get current user
  const user = api.getCurrentUser();

  // not logged in, bail
  if (!user) {
    return;
  }

  // get a list of ignored users
  // const ignored = user.ignored_users;

  const ignored = ['david', 'pekka_gaiser', 'sam'];

  // helper function to avoid duplicating code
  const addIgnoredTopicClass = context => {
    // get classes from core / other plugins and themes
    let classList = context._super(...arguments);

    // create your condition
    const shouldAddClass = ignored.includes(
      context.topic.posters[0].user.username
    );

    // add ignored class if condition is true
    if (shouldAddClass) {
      classList += IGNORED_TOPIC_CLASS_STRING;
    }

    // return the classList plus the modifications if any
    return classList;
  };

  // add the class to the default topic list like on the "latest" page
  api.modifyClass("component:topic-list-item", {
    pluginId: PLUGIN_ID,
    @discourseComputed()
    unboundClassNames() {
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