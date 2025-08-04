import { setLocale } from "yup";

setLocale({
  mixed: {
    default: "Tip Hatası",
    required: "Bu alan zorunludur",
  },
  number: {
    min: "${min} den küçük olmamalı",
  },
});
