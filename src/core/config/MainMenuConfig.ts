import { UserPermissionDefinitions } from "../models/UserPermissionsModel";

const DocMenuConfig = [
  {
    pages: [
      {
        heading: "Ana Sayfa",
        route: "/dashboard",
        svgIcon: "media/icons/duotune/art/art002.svg",
        fontIcon: "bi-app-indicator",
      },
      {
        heading: "Şirket Bilgileri",
        route: "/company-info",
        svgIcon: "media/icons/duotune/general/gen025.svg",
        fontIcon: "bi-building",
      },
      {
        heading: "Galeri",
        route: "/gallery",
        svgIcon: "media/icons/duotune/files/fil008.svg",
        fontIcon: "bi-images",
      },
    ],
  },
];

export default DocMenuConfig;
