/* eslint-disable react-refresh/only-export-components */

// Sweet Alert 2 Package
import MySwal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

// Components
import { Spinner } from "../components/LoaderComponent";

export const Swal = withReactContent(MySwal);

export function closeModal() {
  Swal.close();
}

export function modalLoading(title: string) {
  Swal.fire({
    html: <Spinner title={title} />,

    showConfirmButton: false,
    showCancelButton: false,
    showCloseButton: false,
    allowOutsideClick: false,
  });
}

export const createSuccess = (
  title: string,
  message: string,
  timer = 3000,
  ifClose: () => void = () => {}
) => {
  Swal.fire({
    title: <p>{title}</p>,
    icon: "success",
    text: message,
    showConfirmButton: false,
    showCancelButton: false,
    showCloseButton: true,

    willClose: () => {
      if (ifClose) {
        ifClose();
      }
    },

    timer,
  });
};
export const createError = (title: string, message: string) => {
  Swal.fire({
    title: <p>{title}</p>,
    icon: "error",
    text: message,
    showConfirmButton: false,
    showCancelButton: false,
    showCloseButton: true,
  });
};
export const createWarning = (title: string, message: string) => {
  Swal.fire({
    title: <p>{title}</p>,
    icon: "warning",
    text: message,
    showConfirmButton: false,
    showCancelButton: false,
    showCloseButton: true,
  });
};
export const createInfo = (title: string, message: string) => {
  Swal.fire({
    title: <p>{title}</p>,
    icon: "info",
    text: message,
    showConfirmButton: false,
    showCancelButton: false,
    showCloseButton: true,
  });
};

export const createDelete = (onConfirm: () => void, message: string) => {
  Swal.fire({
    html: message,

    showConfirmButton: true,
    confirmButtonText: <span>Yes</span>,
    confirmButtonColor: "#dc3545",

    showCancelButton: true,
    cancelButtonText: <span>Cancel</span>,
    cancelButtonColor: "#6c757d",

    reverseButtons: false,
    showCloseButton: true,
    allowOutsideClick: false,
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      onConfirm();
    } else if (result.isDenied) {
      Swal.close();
    }
  });
};

interface IModal {
  title?: string;
  html: React.ReactElement;
  width: number;
  message?: string;
  onOpen?: () => void;
  onClose?: () => void;
}
export const createModal = (option: IModal) => {
  if (!option?.html) {
    throw new Error("please use html!");
  }
  if (!option?.width) {
    option.width = 600;
  }

  Swal.fire({
    title: option.title ? <p>{option.title}</p> : undefined,
    html: option.html,
    width: option.width,
    text: option.message,
    showConfirmButton: false,
    showCancelButton: false,
    showCloseButton: true,
    allowOutsideClick: false,

    didOpen: () => {
      if (option?.onOpen) {
        option.onOpen();
      }
    },
    didClose: () => {
      if (option?.onClose) {
        option.onClose();
      }
    },
  });
};

const SweetAlert2 = {
  createDelete,
  createError,
  createInfo,
  createModal,
  createSuccess,
  createWarning,
};

export default SweetAlert2;
