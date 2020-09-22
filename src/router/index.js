import Vue from "vue";
import VueRouter from "vue-router";
// import Home from '../views/Home.vue';
import Table from "../views/Table.vue";
// import TableResult from "@/components/table/TableResult.vue";
import Plot from "../views/Plot.vue";
// import Login from "@/components/Login.vue";

Vue.use(VueRouter);

const routes = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import("../views/About.vue")
  },
  {
    path: "/table",
    name: "Table",
    component: Table,
    children: [
      // {
      //   path: "TableResult",
      //   name: "TableResult",
      //   component: TableResult
      // }
    ]
  },
  {
    path: "/plot",
    name: "Plot",
    component: Plot
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/Login.vue")
  }
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes
});

export default router;
