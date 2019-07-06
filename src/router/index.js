import Vue from "vue";
import Router from "vue-router";
const Header = () => import("../components/Header.vue");
const Footer = () => import("../components/Footer.vue");
const Main = () => import("../components/Main.vue");
const Product = () => import("../components/Product.vue");
const Customer = () => import("../components/Customer.vue");
const Billing = () => import("../components/Billing.vue");
const Shipping = () => import("../components/Shipping.vue");
const ShippingData = () => import("../components/ShippingData.vue");
const Report = () => import("../components/Report.vue");
const TimeShipping = () => import("../components/TimeShipping.vue");
const CustomerID = () => import("../components/CustomerID.vue");
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "Main",
      components: {
        header: Header,
        default: Main,
        footer: Footer
      }
    },
    {
      path: "/Product",
      name: "Product",
      components: {
        header: Header,
        default: Product,
        footer: Footer
      }
    },
    {
      path: "/Customer",
      name: "Customer",
      components: {
        header: Header,
        default: Customer,
        footer: Footer
      }
    },
    {
      path: "/Billing",
      name: "Billing",
      components: {
        header: Header,
        default: Billing,
        footer: Footer
      }
    },
    {
      path: "/Shipping/:id",
      name: "Shipping",
      components: {
        header: Header,
        default: Shipping,
        footer: Footer
      }
    },
    {
      path: "/ShippingData",
      name: "ShippingData",
      components: {
        header: Header,
        default: ShippingData,
        footer: Footer
      }
    },
    {
      path: "/Report",
      name: "Report",
      components: {
        header: Header,
        default: Report,
        footer: Footer
      }
    },
    {
      path: "/TimeShipping/:id",
      name: "TimeShipping",
      components: {
        header: Header,
        default: TimeShipping,
        footer: Footer
      }
    },
    {
      path: "/CustomerID",
      name: "CustomerID",
      components: {
        header: Header,
        default: CustomerID,
        footer: Footer
      }
    }
  ]
});
