import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import Header from './Header.js'
import Footer from './Footer.js'
import preLoaderGif from './images/preloader.gif'
import phoneImg from './images/ico_phone.png'
import disableImg from './images/ico-garaz_wozek.png'
import $ from 'jquery';


const Garages = ({ match }) => {
  const [level, setLevel] = useState({})
  const [unitsInLevel, setUnitsInLevel] = useState([])
  const [redirect, setRedirect] = useState(false)
  const [redirectId, setRedirectId] = useState()
  const [investment, setInvestment] = useState({})
  const [buildings, setBuildings] = useState({})
  const [buildingsArray, setBuildingsArray] = useState([])
  const [imaheHeight, setImaheHeight] = useState(0)
  const [selectedBuildingId, setSelectedBuildingId] = useState(0) //initial selected is current building
  const [levelsInBuilding, setLevelsInBuilding] = useState([])
  const [selectedLevelId, setSelectedLevelId] = useState(0)
  const [dataInCloud, setDataInCloud] = useState({ count_m: { free: 0 }, count_l: { free: 0 } })
  const [cloudShown, setCloudShown] = useState(false)
  const [loading, setLoading] = useState(true)
  const [levelImgLoading, setLevelImgLoading] = useState(false)

  const [garages, setGarages] = useState({})
  const [garageArray, setGarageArray] = useState([])

  const [buildingInGarage, setBuildingInGarage] = useState({}) //aktualny budynek


  const coord = function (xy, orig_size, chngd_size) {
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


  const parser = function (text, o, ch) {
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




  useEffect(() => {
      fetchGarage()
    // fetchLevel(match.params.levelId)
    // fetchUnitsInLevel(match.params.levelId)
    fetchBuildings()
    fetchBuilding()

    setTimeout(() => {
      let ih = document.getElementById('coverImg').height
      console.log('ih', ih)
      setImaheHeight(ih)

      //console.log('imaheHeight', imaheHeight)
    }, 3500);

    setTimeout(() => {
      setLoading(false)
    }, 3500)



    //piEtro
    //setTimeOut jest dlatego eby zdąył wrzucić dynamiczne elementy koordynatorówdo kontenera svg
    setTimeout(() => {
      console.log('SKALOWANIE')
      //svg container/image
      let svgContainer = document.getElementById('levelSvgImg')  //kontener svg
      const coverImg = document.getElementById('coverImg')  // zdjęcie pod svg
      console.log('svgContainer', svgContainer)

      //cover img width and height


      //actual width and height of svg container
      //console.log('WIDTH SVGCONT', svgContainer)
      let svgContainerWidth = Math.round(svgContainer.width.baseVal.value / 0.6)
      let svgContainerHeight = svgContainer.height.baseVal.value
      //console.log('svgContainerWidth', svgContainerWidth)
      //console.log('svgContainerHeight', svgContainerHeight)

      let gElems = svgContainer.querySelectorAll('g')
      console.log('gElems', gElems)

      gElems.forEach((g, i) => {
        let pathElem = g.querySelector('path')
        console.log('path przed', pathElem)
        let svgText = pathElem.outerHTML
        //console.log('SVG TEXT', svgText)
        ///console.log('data for parse', svgText, svgContainerWidth, svgContainerHeight)
        let newcoords = parser(svgText, [583, 648], [svgContainerWidth, svgContainerHeight])
        //console.log('newcoords', newcoords)
        pathElem.setAttribute('d', newcoords)
        console.log('path po', pathElem)
      })

      $('path').mouseenter(function () {
        //jQuery(this).find('path').addClass('svgActive')
        $(this).addClass('svgActive')
        console.log("PATH JQUERY", this)
      })

      $('path').mouseleave(function () {
        //jQuery(this).find('path').addClass('svgActive')
        $(this).removeClass('svgActive')
      })

    }, 3500);
    //koniec piEtra


  }, [])


//   useEffect(() => {

//     setSelectedBuildingId(level.building_id)
//     fetchUnitsInLevel(level.id)
//   }, [level])


  useEffect(() => {
    if (selectedBuildingId != 0) {
      fetchLevelsInBuilding()
    }
  }, [selectedBuildingId])


  useEffect(() => {
    let arr = Object.keys(buildings).map((k) => buildings[k])
    setBuildingsArray(arr)
  }, [buildings])

  useEffect(() => {
    let arr = Object.keys(garages).map((k) => garages[k])
    setGarageArray(arr)
  }, [garages])

  // fetch LEVEL
  const fetchLevel = (levelId) => {
    let details = {
      'id': levelId
    };

    let formBody = [];
    for (let property in details) {
      let encodedKey = encodeURIComponent(property);
      let encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }

    formBody = formBody.join("&");
    console.log('formBody', formBody)

    fetch('http://kliwo.realizacje.grupaaf.pl/api/levels-show', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: formBody
    }).then(r => {
      return r.json()
    }).then(j => {
      setLevel(j.data.levels)
      setInvestment(j.data.investment)
      console.log('this level', j)
    })
  }


//   fetch GARAGE
  const fetchGarage = () => {
    let details = {
      'id': match.params.garageId
    };

    let formBody = [];
    for (let property in details) {
      let encodedKey = encodeURIComponent(property);
      let encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }

    formBody = formBody.join("&");
    console.log('formBody', formBody)

    fetch('http://kliwo.realizacje.grupaaf.pl/api/building/garages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: formBody
    }).then(r => {
      return r.json()
    }).then(j => {
      setGarages(j.data.garages)
      console.log('this garage', j)
    })
  }


  // fetch ALL UNITS in level
//   const fetchUnitsInLevel = levelId => {
//     let details = {
//       'id': levelId
//     };

//     let formBody = [];
//     for (let property in details) {
//       let encodedKey = encodeURIComponent(property);
//       let encodedValue = encodeURIComponent(details[property]);
//       formBody.push(encodedKey + "=" + encodedValue);
//     }

//     formBody = formBody.join("&");
//     console.log('formBody', formBody)

//     fetch('http://kliwo.realizacje.grupaaf.pl/api/levels-units-show', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
//       },
//       body: formBody
//     }).then(r => {
//       return r.json()
//     }).then(j => {
//       const arr = Object.values(j.data.units)
//       setUnitsInLevel(arr)
//       //console.log('all units in this level', j)
//     })
//   }

  // fetch BUILDING
  const fetchBuilding = () => {
    let details = {
      'id': match.params.garageId
    };

    let formBody = [];
    for (let property in details) {
      let encodedKey = encodeURIComponent(property);
      let encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }

    formBody = formBody.join("&");
    console.log('formBody', formBody)

    fetch('http://kliwo.realizacje.grupaaf.pl/api/buildings-show', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: formBody
    }).then(r => {
      return r.json()
    }).then(j => {

      setBuildingInGarage(j.data.building)
      console.log('this building in garage', j)
    })
  }

  // fetch ALL BUILDINGS
  const fetchBuildings = () => {
    return fetch('http://kliwo.realizacje.grupaaf.pl/api/buildings')
      .then(response => response.json())
      .then(json => {
        console.log('All buildings', json.data.buildings)
        setBuildings(json.data.buildings)
      })
  }


  // fetch ALL LEVELS in building
  const fetchLevelsInBuilding = () => {
    let details = {
      'id': selectedBuildingId
    };

    let formBody = [];
    for (let property in details) {
      let encodedKey = encodeURIComponent(property);
      let encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }

    formBody = formBody.join("&");
    console.log('formBody', formBody)

    fetch('http://kliwo.realizacje.grupaaf.pl/api/buildings-show-levels', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: formBody
    }).then(r => {
      return r.json()
    }).then(j => {
      const arr = Object.values(j.data.levels)
      setLevelsInBuilding(arr)
      console.log('all levels in selected building', j)
    })
  }

  const redirectToUnit = id => {
    setRedirectId(id)
    setRedirect(true)
  }


//   const selectCurrentBuilding = id => {
//     if (id === level.building_id) {
//       //console.log('selected')
//       return true
//     } else {
//       //console.log('not selected')
//       return false
//     }
//   }

//   const selectCurrentLevel = id => {
//     if (id === level.id) {
//       //console.log('selected')
//       return true
//     } else {
//       //console.log('not selected')
//       return false
//     }
//   }


  const selectBuildingChange = e => {
    setSelectedBuildingId(e.target.value)

  }

  const selectLevelChange = e => {
    setLevelImgLoading(true)
    setSelectedLevelId(e.target.value)
    //fetch level with id e.target.value
    fetchLevel(e.target.value)



    setTimeout(() => {
      console.log('SKALOWANIE')
      //svg container/image
      let svgContainer = document.getElementById('levelSvgImg')  //kontener svg
      const coverImg = document.getElementById('coverImg')  // zdjęcie pod svg
      console.log('svgContainer', svgContainer)

      //cover img width and height


      //actual width and height of svg container
      //console.log('WIDTH SVGCONT', svgContainer)
      let svgContainerWidth = Math.round(svgContainer.width.baseVal.value / 0.6)
      let svgContainerHeight = svgContainer.height.baseVal.value
      //console.log('svgContainerWidth', svgContainerWidth)
      //console.log('svgContainerHeight', svgContainerHeight)

      let gElems = svgContainer.querySelectorAll('g')
      console.log('gElems', gElems)

      gElems.forEach((g, i) => {
        let pathElem = g.querySelector('path')
        console.log('path przed', pathElem)
        let svgText = pathElem.outerHTML
        //console.log('SVG TEXT', svgText)
        ///console.log('data for parse', svgText, svgContainerWidth, svgContainerHeight)
        let newcoords = parser(svgText, [910, 745], [svgContainerWidth, svgContainerHeight])
        //console.log('newcoords', newcoords)
        pathElem.setAttribute('d', newcoords)
        console.log('path po', pathElem)
      })

      $('path').mouseenter(function () {
        //jQuery(this).find('path').addClass('svgActive')
        $(this).addClass('svgActive')
        console.log("PATH JQUERY", this)
      })

      $('path').mouseleave(function () {
        //jQuery(this).find('path').addClass('svgActive')
        $(this).removeClass('svgActive')
      })
      setLevelImgLoading(false)
    }, 3500);



  }


  const mouseOver = data => {
    console.log('cloud SHOWN')
    setDataInCloud(data)
    setCloudShown(true)
  }

  const mouseLeave = data => {
    console.log('cloud NOT SHOWN')
    setCloudShown(false)
  }

  const printGarageStatusClass = data => {
    if(data) {
      if(data.available == 1) {
        return 'garage-legend-avaliable'
      } 
      if(data.available == 0) {
        return 'garage-legend-sold'
      }
    }
  }

  const printGarageStatusText = data => {
    if(data) {
      if(data.available == 1) {
        return 'Dostępne'
      }
      if(data.available == 0) {
        return 'Sprzedane'
      }
    }
  }

  const printStatus = data => {
    let statusClass = ''
    let statusName = ''
    switch (data.status) {
      case "1":
        statusName = 'sprzedane'
        statusClass = 'level-legend-sold'
        break;
      case "2": statusName = 'zarezerwowane'
        statusClass = 'level-legend-reserved'
        break;
      case "3": statusName = 'wolne'
        statusClass = 'level-legend-avaliable'
        break;

    }
    return (
      <div className={`${statusClass} flex ai-c`}>
        <span></span>
        <p>{statusName}</p>
      </div>
    )
  }


  return (
    <div className="level">
      <Header />
      <div style={{ display: loading ? 'flex' : 'none' }} className="preloader flex ai-c jc-c">
        <img src={preLoaderGif} />
      </div>

      <div className="container">
        <p className="bold-title">Kliknij na lokal, aby dowiedzieć się więcej.</p>
      </div>

      
      <div className="svg-container" style={{ height: imaheHeight }}>
      {/* <div style={{display: levelImgLoading ? '' : ''}} className="">
      <img src={preLoaderGif} />
      </div> */}
        <div style={{position: 'relative'}} className="container">
        <img id="coverImg" style={{ position: 'absolute', width: '60%' }} src={buildingInGarage.garage_image} />
        <svg style={{ position: 'absolute' }} id="levelSvgImg" width="60%" height={imaheHeight} xmlns="http://www.w3.org/2000/svg">
          {
            garageArray.map((g, i) => {
              let garageClass = ''
              if (g.available == 1) {
                garageClass = 'garageFree'
              } else if (g.available == 0) {
                garageClass = 'garageSold'
              }
              //console.log('u', u)
              let svg = g.svg
              console.log('svg', svg)
              return <g onMouseOver={() => mouseOver(g)} onMouseLeave={() => mouseLeave()} id={`unitsvg${i + 1}`} className={garageClass} dangerouslySetInnerHTML={{ __html: svg }}>

              </g>
            })
          }
        </svg>
        </div>

        <div style={{ display: cloudShown ? '' : 'none' }} className="svg-cloud svg-cloud-garage">
          <p className="svg-cloud-garage-title">Stanowisko postojowe {dataInCloud.number}</p>
          {dataInCloud.status == 0 && (
            <div className="svg-cloud-garage-disabled flex ai-c">
              <img src={disableImg} />
              <p>Miejsce postojowe dla osoby z niepełnosprawnością</p>
            </div>
          )}
          <p className={`${printGarageStatusClass(dataInCloud)} flex jc-c ai-c`}>
            <span></span>
            <p>{printGarageStatusText(dataInCloud)}</p>
          </p>
        </div>


        <div className="container">
          <div className="level-details">
            {/* <img src={investment.logo} alt={investment.name} />
            <h4 className="level-details-name">{investment.name}</h4>
            <h5 className="level-details-address">{investment.address}</h5> */}

            {/* <div className="level-search">
              <div className="level-search-input">
                <select onChange={selectBuildingChange}>
                  {
                    buildingsArray.map((b) => {
                      return <option value={b.id}>{b.name}</option>
                    })
                  }
                </select>
              </div>
              <div className="level-search-input">
                <select onChange={selectLevelChange}>
                  {
                    levelsInBuilding.map((l) => {
                      return <option value={l.id}>{l.number} Piętro (Dostępnych lokali {l.count_m.free})</option>
                    })
                  }
                </select>
              </div>
            </div> */}
            
            <div className="level-legend">
              <p className="level-legend-title">Legenda</p>
              <ul className="level-legend-items">
                <li className="level-legend-avaliable flex ai-c">
                  <span></span>
                  <p>dostępne</p>
                </li>
                <li className="level-legend-reserved flex ai-c">
                  <span></span>
                  <p>zarezerwowane<div className="info-box"><span className>i</span><div className="info-box-data"><p>Intersuje Cię zarezerwowany lokal? Chcesz otrzymać informacje o zmianie jego statusu? Skontaktuj się z naszym konsultantem w celu wpisania na listę oczekujących</p><p>Telefon kontaktowy:<br /><a className="bold" href="tel:+48690911799"><img src={phoneImg} />690 911 799</a></p></div></div></p>
                </li>
                <li className="level-legend-sold flex ai-c">
                  <span></span>
                  <p>sprzedane</p>
                </li>
              </ul>
            </div>
            <a className="btn back-to-building-btn" href="javascript:history.back()">Wróć do widoku budynku</a>

          </div>
        </div>






      </div>






    {/* <div className="container">
    <div className="level-details level-details-mobile">
            <img src={investment.logo} alt={investment.name} />
            <h4 className="level-details-name">{investment.name}</h4>
            <h5 className="level-details-address">{investment.address}</h5>
            <div className="level-search">
              <div className="level-search-input">
                <select onChange={selectBuildingChange}>
                  {
                    buildingsArray.map((b) => {
                      let printSelect = selectCurrentBuilding(b.id)
                      console.log('prineSelect', printSelect)
                      return <option selected={printSelect} value={b.id}>{b.name}</option>
                    })
                  }
                </select>
              </div>
              <div className="level-search-input">
                <select onChange={selectLevelChange}>
                  {
                    levelsInBuilding.map((l) => {
                      let printSelectLevel = selectCurrentLevel(l.id)
                      return <option selected={printSelectLevel} value={l.id}>{l.number} Piętro (DostęĻnych lokali {l.count_m.free})</option>
                    })
                  }
                </select>
              </div>
            </div>
            <div className="level-legend">
              <p className="level-legend-title">Legenda</p>
              <ul className="level-legend-items">
                <li className="level-legend-avaliable flex ai-c">
                  <span></span>
                  <p>dostępne</p>
                </li>
                <li className="level-legend-reserved flex ai-c">
                  <span></span>
                  <p>zarezerwowane<div className="info-box"><span className>i</span><div className="info-box-data"><p>Intersuje Cię zarezerwowany lokal? Chcesz otrzymać informacje o zmianie jego statusu? Skontaktuj się z naszym konsultantem w celu wpisania na listę oczekujących</p><p>Telefon kontaktowy:<br /><a className="bold" href="tel:+48690911799"><img src={phoneImg} />690 911 799</a></p></div></div></p>
                </li>
                <li className="level-legend-sold flex ai-c">
                  <span></span>
                  <p>sprzedane</p>
                </li>
              </ul>
            </div>
          </div>
    </div> */}





      <Footer />
    </div>
  )
}

export default Garages