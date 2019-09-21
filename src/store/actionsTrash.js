import axios from 'axios';
import store from './store';
import { swalError, swalSuccess } from './Swal';

const actionsTrash = (store) => ({

  // function to post the trash
  async doAddTrash(state, data) {
    const regexName = /^[^\s]+(\s+[^\s]+)*$/;
    const regexNumber = /^\d+$/;
    const regexImage = /([/|.|\w|\s|-])*\.(?:jpg|jpeg|gif|png)/;
    // check the name validation
    if (!regexName.test(data.trash_name) | data.trash_name === '') {
      swalError('Nama tidak boleh spasi/kosong!!');
      return false;
    } if (!regexNumber.test(data.point)) {
      swalError('Gunakan Angka Untuk Poin!');
      return;
    } if (!regexNumber.test(data.price)) {
      swalError('Gunakan Angka Untuk Harga!');
      return;
    } if (!regexNumber.test(data.trash_category_id)) {
      swalError('Gunakan Angka Untuk Kategori!');
      return;
    } if (!regexImage.test(data.photo)) {
      swalError('Pilih Image terlebih dahulu');
      return;
    }
    const self = this;
    await axios
      .post(`${store.getState().url}/v1/trash`,
        data,
        {
          headers: {
            Authorization: `Bearer ${String(localStorage.getItem('admin_token'))}`,
          },
        })
      .then(async (response) => {
        await swalSuccess('Berhasil Menambahkan Jenis Sampah!');
        window.location.reload();
      })
      .catch((error) => {
      });
  },


});

export default actionsTrash;
