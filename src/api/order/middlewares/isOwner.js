'use strict';

/**
 * `isOwner` middleware
 */

module.exports = (config, { strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {    
      const user = ctx.state.user;
      const order__id = ctx.params.id ? ctx.params.id : undefined;
      let order = {};
      if (order__id) {
        order = await strapi.entityService.findOne(
          "api::order.order",
          order__id,
          { populate: "*" }
        );
      }
      console.log(order.author);
      if(user.id != order.author.id){
        return ctx.unauthorized("This action is unauthorized!");
        } else {
        return next();
      }
  };
};
