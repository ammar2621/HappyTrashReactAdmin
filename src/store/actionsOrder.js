import axios from 'axios';
import Swal from 'sweetalert2';
import store from './store';
import { swalWithBootstrapButtons, swalError, swalSuccess } from './Swal';

const actionsOrder = (store) => ({

  // function to make order status become confirmed
  async confirmOrder(state, id) {
    const self = this;
    // making the confirmaton first before it added
    await swalWithBootstrapButtons.fire({
      title: 'Apakah anda yakin?',
      text: '',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, konfirmasi saja!!',
      cancelButtonText: 'Tidak!',
      reverseButtons: true,
    }).then(async (result) => {
      if (result.value) {
        const config = {
          method: 'PUT',
          url: `${store.getState().url}/v1/orders/${id}`,
          data: {
            status: 'confirmed',
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
          },
        };
        await axios(config)
          .then(async (response) => {
            await swalSuccess('Telah mengonfirmasi order');
          })
          .catch((error) => {
          });
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        await swalWithBootstrapButtons.fire(
          'Tidak Jadi',
          'Tetap aman :)',
          'error',
        );
      }
    });
  },

  // function to reject order
  async rejectOrder(state, id) {
    const self = this;
    // making the confirmaton first before it deleted
    await swalWithBootstrapButtons.fire({
      title: 'Apakah anda yakin?',
      text: 'Anda tidak bisa mengembalikan ketika sudah dicancel',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, cancel saja!!',
      cancelButtonText: 'Tidak!',
      reverseButtons: true,
    }).then(async (result) => {
      if (result.value) {
        const config = {
          method: 'PUT',
          url: `${store.getState().url}/v1/orders/${id}`,
          data: {
            status: 'rejected',
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
          },
        };
        await axios(config)
          .then(async (response) => {
            await swalSuccess('Order Berhasil Ditolak');
          })
          .catch((error) => {
          });
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        await swalWithBootstrapButtons.fire(
          'Tidak Jadi',
          'Tetap aman :)',
          'error',
        );
      }
    });
  },


});

export default actionsOrder;
