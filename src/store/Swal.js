import Swal from 'sweetalert2';

export const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger',
  },
  buttonsStyling: false,
});


export const swalStore = (string) => ({
  swalSuccess(string) {
    Swal.fire({
      type: 'success',
      title: 'Success',
      text: `${string}`,
    });
  },
  swalError(string) {
    Swal.fire({
      type: 'error',
      title: 'Oops...',
      text: `${string}`,
    });
  },
});
