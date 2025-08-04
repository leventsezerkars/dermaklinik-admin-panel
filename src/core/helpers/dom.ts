import { Modal } from "bootstrap";
import Url from "domurl";

const hideModal = (modalEl: HTMLElement | null): void => {
  if (!modalEl) {
    return;
  }

  const myModal = Modal.getInstance(modalEl);
  if (myModal) {
    myModal.hide();
  }
};

const removeModalBackdrop = (): void => {
  if (document.querySelectorAll(".modal-backdrop.fade.show").length) {
    document.querySelectorAll(".modal-backdrop.fade.show").forEach((item) => {
      item.remove();
    });
  }
};

const replaceUrl = (_url): void => {
  const url = "/#" + _url;
  const domurl = new Url(url);
  const title = document.title;
  if (
    typeof history !== "undefined" &&
    typeof history.replaceState !== "undefined"
  ) {
    try {
      history.replaceState({}, title, decodeURIComponent(domurl.toString()));
    } catch (e) {
      console.error(e);
    }
  }
};
const toQueryString = (filters): string => {
  const domurl = new Url(location.href);
  if (filters == undefined || filters == null) {
    return "";
  }
  const keys = Object.keys(filters);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = filters[key];
    if (value === undefined || value === null) {
      continue;
    }
    (domurl.query as any)[key] = value;
  }
  if (!isEmptyObject(domurl.query as any)) {
    return domurl.decode(domurl.encode(domurl.query as any));
  }
  return "";
};
const isObjectEqual = (obj1: any, obj2: any): boolean => {
  return JSON.stringify(obj1) != JSON.stringify(obj2);
};
function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}

async function fileToBlob(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const blob = new Blob([new Uint8Array(arrayBuffer)], { type: file.type });
  return blob;
}

export {
  removeModalBackdrop,
  hideModal,
  replaceUrl,
  toQueryString,
  isObjectEqual,
  isEmptyObject,
  fileToBlob,
};
