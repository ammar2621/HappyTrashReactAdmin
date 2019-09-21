import Swal from 'sweetalert2';
import axios from 'axios';
import store from './store';
import { swalWithBootstrapButtons, swalError, swalSuccess } from './Swal';

const actionsCategory = (store) => ({
  // function to delete category from database
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
            Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
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

  //   to submit / add the category to database
  doSubmit(state, string) {
    const regex = /^[^\s]+(\s+[^\s]+)*$/;
    if (!regex.test(string) | string === '') {
      swalError('Jangan spasi/kosong!!');
      return false;
    }
    const self = this;
    const config = {
      method: 'POST',
      url: `${store.getState().url}/v1/trash_category`,
      data: {
        category_name: string,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
      },
    };
    axios(config).then((response) => {
      swalSuccess('Berhasil Menambahkan Kategori');
    }).catch((error) => {
    });
  },

  // to edit/put the new category name
  editCategory(state, id, name, status) {
    const regex = /^[^\s]+(\s+[^\s]+)*$/;
    if (!regex.test(name) | name === '') {
      Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: 'Jangan spasi/kosong!!',
      });
      return false;
    }
    const self = this;
    const config = {
      method: 'PUT',
      url: `${store.getState().url}/v1/trash_category/${id}`,
      data: {
        category_name: name,
        status,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
      },
    };
    axios(config).then((response) => {
    }).catch((error) => {
    });
  },
});

export default actionsCategory;
