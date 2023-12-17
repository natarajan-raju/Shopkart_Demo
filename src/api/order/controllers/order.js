'use strict';

const order = require('../routes/order');

/**
 * order controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order', ({strapi}) => ({
    async create(ctx){
        const user = ctx.state.user;
        console.log(ctx.request.body.data);
        console.log(ctx.state.user.id);
        console.log("order controller");

        if(!user) {
            return ctx.unauthorized("You are not authorized!");
        }
        const { order__id, order__date, order__value, order__status, product__list } = ctx.request.body.data;
        try{            
            //Charge the customer below

            //Create new order
            const order = await strapi.service("api::order.order").create({
                data: {
                    order__id,
                    order__date,
                    order__value,
                    order__status,
                    product__list,
                    user: ctx.state.user.id
                },
            });
            return order;
        } catch(err){
            ctx.response.status = 500;
            return {
                error: {message: "There was a problem creating the order"},
                order__id,
                order__date,
                order__value,
                order__status: 'draft',
                product__list,                
            };
        }        
    },

    async find(ctx){
        await this.validateQuery(ctx);
        const user = ctx.state.user;
        
        
        if(!user){
            return ctx.unauthorized("you are not authorized!");
        }

        const orders = await strapi.entityService.findMany("api::order.order",{
            filters: {
                user: ctx.state.user.id,                    
            }
        }
        );
        const result = {
            username: user.username,
            orders
        }       
        const sanitizedOutput = await this.sanitizeOutput(result,ctx);
        return this.transformResponse(sanitizedOutput);
       
    },

    async findOne(ctx){
        await this.validateQuery(ctx);
        const user = ctx.state.user;
        
        if(!user){
            return ctx.unauthorized("you are not authorized!");
        }
        const order__id = ctx.params.id ? ctx.params.id : undefined;      
        let order = {};
       
        if (order__id) {
            order = await strapi.entityService.findOne(
              "api::order.order",
              order__id,
              {populate: '*'},
            );
            try{
                if(user.id == order.user.id){
                    const sanitizedOutput = await this.sanitizeOutput(order,ctx);
                    return this.transformResponse(sanitizedOutput);
                }
            } catch(e){
                console.log(e);
            }           
        }
        
        return ctx.unauthorized("Either Order ID or Authorization invalid!");;

    },


}));
