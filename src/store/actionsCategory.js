import Swal from 'sweetalert2';
import axios from "axios"
import store from "./store"
import { swalWithBootstrapButtons } from "./Swal"

const actionsCategory = (store) => ({
  deleteCategory(state, id) {
    const self = this;
    swalWithBootstrapButtons.fire({
      title: 'Apakah anda yakin?',
      text: 'Anda tidak bisa mengembalikan ketika sudah dihapus',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus saja!!',
      cancelButtonText: 'Tidak!',
      reverseButtons: true,
    }).then((result) => {
      if (result.value) {
        const config = {
          method: 'DELETE',
          url: `${store.getState().url}/v1/trash_category/${id}`,
          headers: {
            Authorization: `Bearer ${  localStorage.getItem('admin_token')}`,
          },
        };
        axios(config)
          .then((response) => {
            swalWithBootstrapButtons.fire(
              'Terhapus',
              'Berhasil dihapus',
              'success',
            );
          })
          .catch((error) => {
          });
      } else if (
      /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Tidak Jadi',
          'Tetap aman :)',
          'error',
        );
      }
    });
  },
});
// function to delete category from database

export default actionsCategory;
