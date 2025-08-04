import Swal from "sweetalert2/dist/sweetalert2.js";
import {
  SweetAlertOptions,
  SweetAlertResult,
  SweetAlertIcon,
} from "sweetalert2";

export default class SwalAlert {
  private static options: SweetAlertOptions = {
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    confirmButtonText: "Tamam",
    buttonsStyling: false,
  };

  private static toastoptions: SweetAlertOptions = {
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  };

  private static confirmOptions: SweetAlertOptions = {
    toast: false,
    showConfirmButton: true,
  };

  static alert = (
    msg: string,
    type: SweetAlertIcon = "success"
  ): Promise<SweetAlertResult<Awaited<unknown>>> => {
    return Swal.mixin(this.options).fire({
      icon: type,
      title: msg,
    });
  };

  static toast = (
    msg: string,
    type: SweetAlertIcon = "success",
    manuelOptions: SweetAlertOptions = {}
  ): Promise<SweetAlertResult<Awaited<unknown>>> => {
    return Swal.mixin(this.toastoptions).fire({
      icon: type,
      title: msg,
      ...manuelOptions,
    });
  };

  static confirm = (
    props: SwalConfirmBoxProps
  ): Promise<SweetAlertResult<Awaited<unknown>>> => {
    const confirmOptions = {
      ...this.confirmOptions,
      ...{
        customClass: {
          cancelButton: "btn btn-danger",
          confirmButton: "btn btn-success",
        },
      },
    };

    return Swal.mixin(confirmOptions).fire({
      icon: props.type,
      title: props.title,
      text: props.text,
      showCancelButton: true,
      confirmButtonText: props.confirmButtonText
        ? props.confirmButtonText
        : "Tamam",
      cancelButtonText: props.cancelButtonText
        ? props.cancelButtonText
        : "İptal",
    });
  };
}

export type SwalConfirmBoxProps = {
  title: string;
  text?: string;
  confirmButtonText?: string;
  cancelButtonText?: string | null;
  type?: SweetAlertIcon;
  cancelButtonType?: "error" | "success";
};
