import { apiInitializer } from "discourse/lib/api";
import { on } from "discourse-common/utils/decorators";

export default apiInitializer("0.8", api => {
  const user = api.getCurrentUser();
  if (!user) return;
  
  const ignored = user.ignored_users;

  if (ignored.length) {
    api.modifyClass("component:topic-list", {
      @on("didReceiveAttrs")
      removeIgnoredUsers() {
        this.topics = this.topics.filter(
          topic => !ignored.includes(topic.posters[0].user.username)
        );
      }
    });
  }
});