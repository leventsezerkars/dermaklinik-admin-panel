import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import store from "@/store";
import { Mutations, Actions } from "@/store/enums/StoreEnums";
import JwtService from "@/core/services/JwtService";
import { UserPermissionDefinitions } from "@/core/models/UserPermissionsModel";
//import { PermissionService } from "@/services";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/dashboard",
    component: () => import("@/layout/Layout.vue"),
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("@/views/Dashboard.vue"),
      },
      {
        path: "/restricted",
        name: "restricted",
        component: () => import("@/views/RestrictedPage.vue"),
      },
      {
        path: "/company",
        name: "company-list",
        component: () => import("@/views/pages/CompanyList.vue"),
      },
      {
        path: "/database",
        name: "database-list",
        component: () => import("@/views/pages/DatabaseList.vue"),
      },
      {
        path: "/restourant",
        name: "restourant-list",
        component: () => import("@/views/pages/RestourantList.vue"),
      },
      {
        path: "/order/:id",
        name: "order-list",
        component: () => import("@/views/pages/OrderList.vue"),
      },
      {
        path: "/income",
        name: "income-list",
        component: () => import("@/views/pages/IncomeList.vue"),
        props: { companyId: null, allDatas: true },
      },
      {
        path: "/invoice/:id",
        name: "invoice-create",
        component: () => import("@/views/pages/CreateInvoice.vue"),
      },
      {
        path: "/istatistik",
        name: "restourant-istatistik",
        component: () => import("@/views/pages/RestourantIstatistik.vue"),
      },
      {
        path: "/istatistik_company",
        name: "company-istatistik",
        component: () => import("@/views/pages/CompanyIstatistik.vue"),
      },
      {
        path: "/settings",
        name: "admin-setting",
        component: () => import("@/views/pages/SettingsPage.vue"),
      },
      {
        path: "/menu",
        name: "menu-list",
        component: () => import("@/views/pages/MenuList.vue"),
      },
      {
        path: "/company-info",
        name: "company-info",
        component: () => import("@/views/pages/CompanyInfo.vue"),
      },
    ],
  },
  {
    path: "/",
    component: () => import("@/components/page-layouts/Auth.vue"),
    children: [
      {
        path: "/sign-in",
        name: "sign-in",
        component: () => import("@/views/authentication/SignInTest.vue"),
      },
      {
        path: "/sign-up",
        name: "sign-up",
        component: () => import("@/views/authentication/SignUp.vue"),
      },
    ],
  },
  {
    // the 404 route, when none of the above matches
    path: "/404",
    name: "404",
    component: () => import("@/views/authentication/Error404.vue"),
  },
  {
    path: "/500",
    name: "500",
    component: () => import("@/views/authentication/Error500.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async (to, from) => {
  // reset config to initial state
  store.commit(Mutations.RESET_LAYOUT_CONFIG);

  // Authentication kontrolü
  const token = JwtService.getToken();
  const isAuthenticated = store.getters.isUserAuthenticated;

  // Eğer token varsa ama store'da authentication yoksa, verify et
  if (token && !isAuthenticated) {
    await store.dispatch(Actions.VERIFY_AUTH, { api_token: token });
  }

  // Public routes (giriş yapmadan erişilebilir)
  const publicRoutes = ["sign-in", "sign-up", "404", "500"];

  // Eğer public route değilse ve authentication yoksa, giriş sayfasına yönlendir
  if (!publicRoutes.includes(to.name as string) && !isAuthenticated) {
    return { name: "sign-in" };
  }

  // Eğer giriş yapmış kullanıcı sign-in sayfasına gitmeye çalışıyorsa, dashboard'a yönlendir
  if (to.name === "sign-in" && isAuthenticated) {
    return { name: "dashboard" };
  }

  // Scroll page to top on every route change
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 100);
});

export default router;
