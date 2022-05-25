'use strict';

/**
 * glavnaya service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::glavnaya.glavnaya');
