"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 09/05/2022 at 10:57
 * File app/Common/model
 */

import Activity        from "QRCP/Sphere/Activity/Activity";
import Member          from "QRCP/Sphere/Member/Member";
import User            from "QRCP/Sphere/User/User";
import ApiToken        from "QRCP/Sphere/Authentication/ApiToken/ApiToken";
import Partner         from "QRCP/Sphere/Partner/Partner";
import Conversation    from "QRCP/Sphere/_Chat/Conversation/Conversation";
import Message         from "QRCP/Sphere/_Chat/Message/Message";
import Quote           from "QRCP/Sphere/Quote/Quote";
import Tender          from "QRCP/Sphere/Tender/Tender";
import ProductCategory from "QRCP/Sphere/ProductCategory/ProductCategory";
import Product         from "QRCP/Sphere/Product/Product";
import PartnerService  from "QRCP/Sphere/PartnerService/PartnerService";


//// General
export const activityModel = (): Activity => new Activity()
export const memberModel = (): Member => new Member()
export const partnerModel = (): Partner => new Partner()
export const userModel = (): User => new User()
export const apiTokenModel = (): ApiToken => new ApiToken()

//// Chat
export const conversationModel = (): Conversation => new Conversation()
export const messageModel = (): Message => new Message()
export const quoteModel = (): Quote => new Quote()

//// Bourse aux affaires
export const tenderModel = (): Tender => new Tender()

//// Produits
export const productCategoryModel = (): ProductCategory => new ProductCategory()
export const productModel = (): Product => new Product()

//// Services
export const partnerServiceModel = (): PartnerService => new PartnerService()
