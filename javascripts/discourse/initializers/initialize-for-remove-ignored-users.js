import {
  apiInitializer
} from "discourse/lib/api";
import {
  on
} from "discourse-common/utils/decorators";

export default apiInitializer("0.8", api => {
  const user = api.getCurrentUser();
  if (!user) return;

  // const ignored = user.ignored_users

  const ignored = ['david', 'pekka_gaiser', 'sam'];

  if (ignored.length) {
    //check isMobile
    // const site = api.container.lookup("site:main");

    // if (site.mobileView) return;

    api.modifyClass("component:topic-list", {
      @on("didReceiveAttrs")

      // @on("didUpdateAttrs")

      // pluginId: 'ignore plus',

      removeIgnoredUsers() {
        this.topics = this.topics.filter(
          topic => !ignored.includes(topic.posters[0].user.username)
        );

     }
   
      
    });

    // api.modifyClass("component:mobile-category-topic", {
    //   @on("didReceiveAttrs")
    //   removeIgnoredUsers() {
    //     console.log(this);
    //     this.topics = this.topics.filter(
    //       topic => !ignored.includes(topic.posters[0].user.username)
    //     );
    //   }
    // });
  }
});