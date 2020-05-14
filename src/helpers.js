export const coord = function (xy, orig_size, chngd_size) {
    const x_scale = chngd_size[0] / orig_size[0];
    const y_scale = chngd_size[1] / orig_size[1];
    let coo = [];
    for (let i = 0; i < xy.length; i += 2) {
      coo.push(xy[i] * x_scale);
      coo.push(xy[i + 1] * y_scale);
    }
    // console.log('coo', coo)
    return coo;
  }


  export const parser = function (text, o, ch) {
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(text, "text/xml");
    let d = xmlDoc.getElementsByTagName('path')[0].getAttribute('d');
    let arr = d.toUpperCase().replace(/,/g, ' ').replace(/-/g, ' -').split(' ');
    arr = arr.filter(val => val != '');

    let k = 0;
    while (k < arr.length) {
      if ((arr[k].length > 1) && (arr[k].match(/[A-Z]/i))) {
        let tmp = arr[k];
        arr[k] = arr[k].substr(0, 1);
        arr.splice(k + 1, 0, tmp.substr(1, tmp.length));
      }
      k += 1;
    }

    let tmp_arr = [];
    let i = 0;
    while (i < arr.length) {
      let tmp = [];
      if (arr[i].match(/[A-Z]/i)) {
        let j = i;
        while (j < arr.length - 1) {
          tmp.push(arr[j]);
          //console.log('tmp', tmp)
          if (arr[j + 1].match(/[A-Z]/i)) {
            let tmp2 = coord(tmp, o, ch);
            tmp2 = tmp2.filter(val => !Number.isNaN(val));
            tmp_arr.push(arr[i] + tmp2.join(' '));
            i = j;
            break;
          }
          j += 1
        }
      }
      i += 1;
    }
    //console.log('tmp_arr', tmp_arr) 
    return tmp_arr.join(' ') + ' Z';
  }