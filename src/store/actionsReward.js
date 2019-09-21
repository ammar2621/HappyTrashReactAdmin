import Swal from 'sweetalert2';
import axios from 'axios';
import store from './store';
import { swalWithBootstrapButtons, swalError, swalSuccess } from './Swal';

const actionsReward = (store) => ({
  // add the reward (post to API)
  async doAddReward(state, data) {
    const regexName = /^[^\s]+(\s+[^\s]+)*$/;
    const regexNumber = /^\d+$/;
    const regexImage = /([/|.|\w|\s|-])*\.(?:jpg|jpeg|gif|png)/;
    // check the form validation
    if (!regexName.test(data['name']) | data['name'] === "") {
      Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: 'Nama tidak boleh spasi/kosong!!'
      })
      return false;
    } if (!regexNumber.test(data['point_to_claim'])) {
      Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: 'Gunakan Angka Untuk Poin!'
      })
      return;
    } if (!regexNumber.test(data['stock'])) {
      Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: 'Gunakan Angka untuk Stok!'
      })
      return;
    } if (!regexImage.test(data['photo'])) {
      Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: 'Pilih file image terlebih dahulu!'
      })
      return;
    }
    const self = this;
    await axios
      .post(this.props.url + `/v1/rewards`,
        data,
        {
          headers: {
            Authorization: "Bearer " + String(localStorage.getItem('admin_token'))
          }
        })
      .then(async response => {
        Swal.fire({
          type: 'success',
          title: 'Success',
          text: 'Berhasil Menambahkan Hadiah!'
        })
        window.location.reload();
      })
      .catch(error => {
      });
  },
});

export default actionsReward;
