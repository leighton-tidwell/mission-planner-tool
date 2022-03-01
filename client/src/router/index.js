import { createWebHashHistory, createRouter } from "vue-router";

const routes = [
  {
    path: "/",
    name: "HomePage",
    component: () => import("../views/HomePage.vue"),
    meta: {
      title: "Home",
    },
  },
  {
    path: "/import/mag-pdf",
    name: "ImportMagPdf",
    component: () => import("../views/MagPDF.vue"),
    meta: {
      title: "MAG PDF",
    },
  },
  {
    path: "/import/single-mission",
    name: "ImportSingleMission",
    component: () => import("../views/SingleMissionPage.vue"),
    meta: {
      title: "Manual Entry",
    },
  },
  {
    path: "/settings",
    name: "Settings",
    component: () => import("../views/SettingsPage.vue"),
    meta: {
      title: "Settings",
    },
  },
  {
    path: "/missions",
    name: "Missions",
    component: () => import("../views/MissionsPage.vue"),
    meta: {
      title: "Missions",
    },
  },
  {
    path: "/mission/:missionId",
    name: "Mission",
    component: () => import("../views/MissionPage.vue"),
    meta: {
      title: "Mission",
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(
    process.env.NODE_ENV === "development" ? "./" : "/mpt"
  ),
  routes,
});

router.afterEach((to) => {
  document.title = `89th CS MPT | ${to.meta.title || ""}`;
});

export default router;