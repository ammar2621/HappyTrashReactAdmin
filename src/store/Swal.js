import Swal from 'sweetalert2';

export const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger',
  },
  buttonsStyling: false,
});


export function swalSuccess(string) {
  Swal.fire({
    type: 'success',
    title: 'Success',
    text: `${string}`,
  });
}
export function swalError(string) {
  Swal.fire({
    type: 'error',
    title: 'Oops...',
    text: `${string}`,
  });
}
