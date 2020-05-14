import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import Header from './Header.js'
import Footer from './Footer.js'
import preLoaderGif from './images/preloader.gif'
import phoneImg from './images/ico_phone.png'
import disableImg from './images/ico-garaz_wozek.png'
import $ from 'jquery';
import { parser } from './helpers.js'


const Garages = ({ match }) => {
  const [imaheHeight, setImaheHeight] = useState(0)
  const [imageWidth, setImageWidth] = useState(0)
  const [dataInCloud, setDataInCloud] = useState({ count_m: { free: 0 }, count_l: { free: 0 } })
  const [cloudShown, setCloudShown] = useState(false)
  const [loading, setLoading] = useState(true)
  const [garages, setGarages] = useState({})
  const [garageArray, setGarageArray] = useState([])
  const [buildingInGarage, setBuildingInGarage] = useState({}) //aktualny budynek
  const [mobileSvgHeight, setMobileSvgHeight] = useState()
  let windowWidth = 0
  let widthofScreen = 0


  useEffect(() => {
    if (imaheHeight && imageWidth) {
      windowWidth = window.innerWidth
      if (windowWidth > 1300) {
        const svgContainer = document.getElementById('levelSvgImg')  //kontener svg
        const svgContainerWidth = imageWidth
        const svgContainerHeight = imaheHeight
        const gElems = svgContainer.querySelectorAll('g')
        

        const gElemsCheck = setInterval(() => {
          if (gElems.length) {
            console.log("G ELEM ZALADOWANE", gElems)
            clearInterval(gElemsCheck)
            gElems.forEach((g, i) => {
              let pathElem = g.querySelector('path')
              //console.log('path przed D', i, pathElem)
              const svgText = pathElem.outerHTML
              //console.log('SVG TEXT', svgText)
              console.log('data for parse', svgText, svgContainerWidth, svgContainerHeight)
              const newcoords = parser(svgText, [583, 648], [svgContainerWidth, svgContainerHeight])
              //console.log('newcoords', newcoords)
              pathElem.setAttribute('d', newcoords)
              //console.log('path po D', i, pathElem)
            })
          }
        }, 20)
        $('path').mouseenter(function () {
          $(this).addClass('svgActive')
        })
        $('path').mouseleave(function () {
          $(this).removeClass('svgActive')
        })
      } else {
        const svgContainer = document.getElementById('levelSvgImgMobile')  //kontener svg
        const coverImg = document.getElementById('coverImgMobile')  // zdjęcie pod svg
        const svgContainerWidth = Math.round(coverImg.offsetWidth)
        const svgContainerHeight = coverImg.offsetHeight

        setMobileSvgHeight(svgContainerHeight)

        const gElems = svgContainer.querySelectorAll('g')

        gElems.forEach((g, i) => {
          let pathElem = g.querySelector('path')
          //console.log('path przed M', pathElem)
          const svgText = pathElem.outerHTML
          //console.log('SVG TEXT', svgText)
          //console.log('data for parse', svgText, svgContainerWidth, svgContainerHeight)
          const newcoords = parser(svgText, [583, 648], [svgContainerWidth, svgContainerHeight])
          //console.log('newcoords', newcoords)
          pathElem.setAttribute('d', newcoords)
          //console.log('path po MM', pathElem)
        })
        $('path').mouseenter(function () {
          $(this).addClass('svgActive')
        })
        $('path').mouseleave(function () {
          $(this).removeClass('svgActive')
        })
      }
    }
  }, [imaheHeight, imageWidth])


  useEffect(() => {
    fetchGarage()
    //fetchBuildings()
    fetchBuilding()
    const interval = setInterval(() => {
      let ih = document.getElementById('coverImg').height
      let iw = document.getElementById('coverImg').width
      if (ih) {
        setImaheHeight(ih)
        setImageWidth(iw)
        console.log("IH JEST", ih)
        setLoading(false)
        clearInterval(interval)
      }
    }, 10)

    $(document).ready(function () {
      widthofScreen = $(window).width();
      window.addEventListener('resize', redirectAfterResize);
    })
  }, [])

  const redirectAfterResize = () => {
    if ($(window).width() == widthofScreen) return;
    window.location.reload();
  }

  useEffect(() => {
    let arr = Object.keys(garages).map((k) => garages[k])
    setGarageArray(arr)
  }, [garages])


  //   fetch GARAGE
  const fetchGarage = () => {
    const details = {
      'id': match.params.garageId
    };
    let formBody = [];
    for (let property in details) {
      let encodedKey = encodeURIComponent(property);
      let encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    //console.log('formBody', formBody)
    fetch('http://kliwo.pl/api/building/garages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: formBody
    }).then(r => {
      return r.json()
    }).then(j => {
      setGarages(j.data.garages)
      //console.log('this garage', j)
    })
  }


  // fetch BUILDING
  const fetchBuilding = () => {
    const details = {
      'id': match.params.garageId
    };
    let formBody = [];
    for (let property in details) {
      let encodedKey = encodeURIComponent(property);
      let encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    //console.log('formBody', formBody)
    fetch('http://kliwo.pl/api/buildings-show', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: formBody
    }).then(r => {
      return r.json()
    }).then(j => {
      setBuildingInGarage(j.data.building)
      //console.log('this building in garage', j)
    })
  }


  const mouseOver = data => {
    setDataInCloud(data)
    setCloudShown(true)
  }

  const mouseLeave = data => {
    setCloudShown(false)
  }

  const printGarageStatusClass = data => {
    if (data) {
      if (data.available == 1) {
        return 'garage-legend-avaliable'
      }
      if (data.available == 0) {
        return 'garage-legend-sold'
      }
    }
  }

  const printGarageStatusText = data => {
    if (data) {
      if (data.available == 1) {
        return 'Dostępne'
      }
      if (data.available == 0) {
        return 'Sprzedane'
      }
    }
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
      {/* DESKTOP */}
      <div className="svg-container level-svg-desktop" style={{ height: imaheHeight }}>
        {/* <div style={{display: levelImgLoading ? '' : ''}} className="">
      <img src={preLoaderGif} />
      </div> */}
        <div style={{ position: 'relative' }} className="container">
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
                //console.log('svg', svg)
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

      {/* MOBILE */}
      <div id="level-svg-mobile" className="svg-container level-svg-mobile" style={{ height: mobileSvgHeight }}>
        {/* <div style={{display: levelImgLoading ? '' : ''}} className="">
      <img src={preLoaderGif} />
      </div> */}
        <img id="coverImgMobile" style={{ position: 'absolute', width: '100%' }} src={buildingInGarage.garage_image} />
        <svg style={{ position: 'absolute' }} id="levelSvgImgMobile" width="100%" height={mobileSvgHeight} xmlns="http://www.w3.org/2000/svg">
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
              //console.log('svg', svg)
              return <g onMouseOver={() => mouseOver(g)} onMouseLeave={() => mouseLeave()} id={`unitsvg${i + 1}`} className={garageClass} dangerouslySetInnerHTML={{ __html: svg }}>

              </g>
            })
          }
        </svg>
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
      <Footer />
    </div>
  )
}

export default Garages