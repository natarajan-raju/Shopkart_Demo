import type { Schema, Attribute } from '@strapi/strapi';

export interface ProductProductInfo extends Schema.Component {
  collectionName: 'components_product_product_infos';
  info: {
    displayName: 'productInfo';
    icon: 'cube';
  };
  attributes: {
    review: Attribute.Text & Attribute.Required;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'product.product-info': ProductProductInfo;
    }
  }
}
