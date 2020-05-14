import React, { useState, useEffect } from 'react'
import { Redirect, Link } from 'react-router-dom'
import Header from './Header.js'
import Footer from './Footer.js'
import preLoaderGif from './images/preloader.gif'
import showGarages from './images/zobaczGaraze.png'
import $ from 'jquery';
import { parser } from './helpers.js'

const Buildings = ({ match }) => {
  const [building, setBuilding] = useState({})
  const [levelsInBuilding, setLevelsInBuilding] = useState([])
  const [redirect, setRedirect] = useState(false)
  const [redirectId, setRedirectId] = useState()
  const [investmentId, setInvestmentId] = useState(0)
  const [investment, setInvestment] = useState({})
  const [imaheHeight, setImaheHeight] = useState(0)
  const [imaheHeightMobile, setImaheHeightMobile] = useState(0)
  const [dataInCloud, setDataInCloud] = useState({ count_m: { free: 0 }, count_l: { free: 0 } })
  const [cloudShown, setCloudShown] = useState(false)
  const [loading, setLoading] = useState(true)

  let windowWidth = 0
  let widthofScreen = 0


  useEffect(() => {
    if (imaheHeight) {
      const svgContainer = document.getElementById('buildingSvgImg')  //kontener svg
      const svgContainerWidth = Math.round(svgContainer.width.baseVal.value / 0.6)
      const svgContainerHeight = svgContainer.height.baseVal.value

      const intervalGElems = setInterval(() => {
        const gElems = svgContainer.querySelectorAll('g')
        if (gElems.length > 0) {
          clearInterval(intervalGElems)
          //console.log('gElems SA', gElems)

          gElems.forEach((g, i) => {
            let pathElem = g.querySelector('path')
            //console.log('path przed', pathElem)
            const svgText = pathElem.outerHTML
            //console.log('data for parse', svgText, svgContainerWidth, svgContainerHeight)
            const newcoords = parser(svgText, [1920, 1321], [svgContainerWidth, svgContainerHeight])
            //console.log('newcoords', newcoords)
            pathElem.setAttribute('d', newcoords)
            //console.log('path po', pathElem)
            setLoading(false)
            $(document).ready(function () {
              $('path').mouseenter(function () {
                $(this).addClass('svgActive')
              })
              $('path').mouseleave(function () {
                $(this).removeClass('svgActive')
              })
            })
          })
        }
      }, 1000)
    }
  }, [imaheHeight])


  useEffect(() => {
    if (imaheHeightMobile) {
      const svgContainer = document.getElementById('building-svg-mobile')  //kontener svg
      const mobileSvg = document.getElementById('buildingSvgMobile')  // zdjęcie pod svg
      const svgContainerWidth = Math.round(svgContainer.width)
      const svgContainerHeight = svgContainer.height

      const intervalGElems = setInterval(() => {
        const gElems = mobileSvg.querySelectorAll('g')
        if (gElems.length > 0) {
          clearInterval(intervalGElems)

          gElems.forEach((g, i) => {
            let pathElem = g.querySelector('path')
            //console.log('path przed', pathElem)
            const svgText = pathElem.outerHTML
            //console.log('SVG TEXT', svgText)
            console.log('data for parse', svgText, svgContainerWidth, svgContainerHeight)
            const newcoords = parser(svgText, [1920, 1321], [svgContainerWidth, svgContainerHeight])
            //console.log('newcoords', newcoords)
            pathElem.setAttribute('d', newcoords)
            //console.log('path po', pathElem)
            setLoading(false)
            $(document).ready(function () {
              $('path').mouseenter(function () {
                $(this).addClass('svgActive')
              })

              $('path').mouseleave(function () {
                $(this).removeClass('svgActive')
              })
            })
          })
        }
      }, 1000)
    }
  }, [imaheHeightMobile])


  useEffect(() => {
    windowWidth = window.innerWidth
    fetchBuilding()
    fetchLevelsInBuilding()
    if (windowWidth > 1300) {
      const interval = setInterval(() => {
        const ih = document.getElementById('coverImg').height
        if (ih) {
          setImaheHeight(ih)
          clearInterval(interval)
        }
      }, 10)
    }
    if (windowWidth < 1300) {
      const interval = setInterval(() => {
        const ihmobile = document.getElementById('building-svg-mobile').height
        if (ihmobile) {
          setImaheHeightMobile(ihmobile)
          clearInterval(interval)
        }
      }, 10)
    }
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
    if (investmentId != 0) {
      fetchInvestment()
    }
  }, [investmentId])


  // fetch BUILDING
  const fetchBuilding = () => {
    const details = {
      'id': match.params.buildingId
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
      setBuilding(j.data.building)
      setInvestmentId(j.data.building.investment_id)
      console.log('this building', j)
    })
  }


  //fetch INVESTMENT
  const fetchInvestment = () => {
    const details = {
      'id': building.investment_id
    };
    let formBody = [];
    for (let property in details) {
      let encodedKey = encodeURIComponent(property);
      let encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    //console.log('formBody', formBody)
    fetch('http://kliwo.pl/api/investments-show', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: formBody
    }).then(r => {
      return r.json()
    }).then(j => {
      setInvestment(j.data.investments)
      //console.log('this investment', j.data.investments)
    })
  }


  // fetch ALL LEVELS in building
  const fetchLevelsInBuilding = () => {
    const details = {
      'id': match.params.buildingId
    };
    let formBody = [];
    for (let property in details) {
      let encodedKey = encodeURIComponent(property);
      let encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    console.log('formBody', formBody)
    fetch('http://kliwo.pl/api/buildings-show-levels', {
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
      console.log('all levels in this building', j)
    })
  }


  const redirectToLevel = (id, avaliableFlats) => {
    if (avaliableFlats == 0) {
      return;
    }
    setRedirectId(id)
    setRedirect(true)
  }


  const mouseOver = data => {
    //console.log('cloud SHOWN', data.count_m.sold)
    setDataInCloud(data)
    setCloudShown(true)
  }

  const mouseLeave = data => {
    setCloudShown(false)
  }

  const showAvaliableUnitsAmount = amount => {
    return amount == 0 ? 'Sprzedane' : amount
  }


  return (
    <div className="building">
      <Header />
      <div style={{ display: loading ? 'flex' : 'none' }} className="preloader flex ai-c jc-c">
        <img src={preLoaderGif} />
      </div>
      <div className="container">
        <p className="bold-title">Najedź kursorem na piętro, aby sprawdzić liczbę wolnych lokali.<br />Kliknij, aby zobaczyć rzut pietra.</p>
      </div>
      {/* DESKTOP */}
      <div className="svg-container building-svg-desktop" style={{ height: imaheHeight }}>
        {
          building.garage_number > 0 && (
            <Link to={`/garaz/${match.params.buildingId}`}>
              <img className="show-garage-img" src={showGarages} />
            </Link>
          )
        }
        <img id="coverImg" style={{ position: 'absolute', width: '60%' }} src={building.main_img} />
        <svg style={{ position: 'absolute' }} id="buildingSvgImg" width="60%" height={imaheHeight} xmlns="http://www.w3.org/2000/svg">
          {
            levelsInBuilding.map((l, i) => {
              //console.log('lvl', l)
              let svg = l.coords
              let lvlClass = l.count_m.free == '0' ? 'levelDisabled' : ''
              //console.log('svg', svg)
              return <g className={lvlClass} onMouseOver={() => mouseOver(l)} onMouseLeave={() => mouseLeave()} id={`levelsvg${i + 1}`} onClick={() => { redirectToLevel(l.id, l.count_m.free) }} dangerouslySetInnerHTML={{ __html: svg }}>

              </g>
            })
          }
        </svg>

        {/* {redirect ? <Redirect push to={`/budynek/${redirectId}`} /> : null} */}

        <div style={{ display: cloudShown ? 'block' : 'none' }} className="svg-cloud">
          {dataInCloud.number == 0 && (
            <p className="svg-cloud-title">Parter</p>
          )}
          {dataInCloud.number != 0 && (
            <p className="svg-cloud-title">Piętro: {dataInCloud.number}</p>
          )}
          <div style={{ display: dataInCloud.count_m.free && dataInCloud.count_m.free ? '' : 'none' }} className="svg-cloud-boxes flex">
            <div className="svg-cloud-box">
              <span>Liczba dostępnych mieszkań</span>
              <span>{showAvaliableUnitsAmount(dataInCloud.count_m.free)}</span>
            </div>
            {dataInCloud.number == 0 && (
              <div className="svg-cloud-box">
                <span>Liczba dostępnych lokali użytkowych</span>
                <span>{showAvaliableUnitsAmount(dataInCloud.count_l.free)}</span>
              </div>
            )}
          </div>
          <div style={{ display: dataInCloud.count_m.free && dataInCloud.count_m.free ? 'none' : '' }} className="svg-cloud-boxes flex">
            <div className="svg-cloud-box svg-cloud-box-all-sold">
              <span>Wszystkie lokalne zostały sprzedane</span>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="building-details">
            <img src={investment.logo} alt={investment.name} />
            <h4 className="building-details-name">{investment.name}</h4>
            <h5 className="building-details-address">{investment.address}</h5>
            <h4 className="building-details-building-name">{building.name}</h4>
            <p className="building-details-stage">{building.stage_description}</p>
            <div className="building-details-list">
              <ul>
                <li className="flex ai-c">
                  <img src={building.prop_1_icon} alt={building.prop_1_description} />
                  <p>{building.prop_1_description}</p>
                </li>
                <li className="flex ai-c">
                  <img src={building.prop_2_icon} alt={building.prop_2_description} />
                  <p>{building.prop_2_description}</p>
                </li>
                <li className="flex ai-c">
                  <img src={building.prop_3_icon} alt={building.prop_3_description} />
                  <p>{building.prop_3_description}</p>
                </li>
                <li className="flex ai-c">
                  <img src={building.prop_4_icon} alt={building.prop_4_description} />
                  <p>{building.prop_4_description}</p>
                </li>
                <li className="flex ai-c">
                  <img src={building.prop_5_icon} alt={building.prop_5_description} />
                  <p>{building.prop_5_description}</p>
                </li>
                <li className="flex ai-c">
                  <img src={building.prop_6_icon} alt={building.prop_6_description} />
                  <p>{building.prop_6_description}</p>
                </li>
                <li className="flex ai-c">
                  <img src={building.prop_7_icon} alt={building.prop_7_description} />
                  <p>{building.prop_7_description}</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* MOBILE */}
      <div className="svg-container building-svg-mobile" style={{ height: imaheHeightMobile }}>
        {
          building.garage_number > 0 && (
            <Link to={`/garaz/${match.params.buildingId}`}>
              <img className="show-garage-img" src={showGarages} />
            </Link>
          )
        }
        <img id="building-svg-mobile" style={{ position: 'absolute', width: '100%' }} src={building.main_img} />
        <svg style={{ position: 'absolute' }} id="buildingSvgMobile" width="100%" height={imaheHeightMobile} xmlns="http://www.w3.org/2000/svg">
          {
            levelsInBuilding.map((l, i) => {
              //console.log('lvl', l)
              let svg = l.coords
              let lvlClass = l.count_m.free == '0' ? 'levelDisabled' : ''
              //console.log('svg', svg)
              return <g className={lvlClass} onMouseOver={() => mouseOver(l)} onMouseLeave={() => mouseLeave()} id={`levelsvg${i + 1}`} onClick={() => { redirectToLevel(l.id, l.count_m.free) }} dangerouslySetInnerHTML={{ __html: svg }}>

              </g>
            })
          }
        </svg>
        {/* {redirect ? <Redirect push to={`/budynek/${redirectId}`} /> : null} */}

        <div style={{ display: cloudShown ? 'block' : 'none' }} className="svg-cloud">
          {dataInCloud.number == 0 && (
            <p className="svg-cloud-title">Parter</p>
          )}
          {dataInCloud.number != 0 && (
            <p className="svg-cloud-title">Piętro: {dataInCloud.number}</p>
          )}
          <div style={{ display: dataInCloud.count_m.free && dataInCloud.count_m.free ? '' : 'none' }} className="svg-cloud-boxes flex">
            <div className="svg-cloud-box">
              <span>Liczba dostępnych mieszkań</span>
              <span>{showAvaliableUnitsAmount(dataInCloud.count_m.free)}</span>
            </div>
            {dataInCloud.number == 0 && (
              <div className="svg-cloud-box">
                <span>Liczba dostępnych lokali użytkowych</span>
                <span>{showAvaliableUnitsAmount(dataInCloud.count_l.free)}</span>
              </div>
            )}
          </div>
          <div style={{ display: dataInCloud.count_m.free && dataInCloud.count_m.free ? 'none' : '' }} className="svg-cloud-boxes flex">
            <div className="svg-cloud-box svg-cloud-box-all-sold">
              <span>Wszystkie lokalne zostały sprzedane</span>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="building-details">
            <img src={investment.logo} alt={investment.name} />
            <h4 className="building-details-name">{investment.name}</h4>
            <h5 className="building-details-address">{investment.address}</h5>
            <h4 className="building-details-building-name">{building.name}</h4>
            <p className="building-details-stage">{building.stage_description}</p>
            <div className="building-details-list">
              <ul>
                <li className="flex ai-c">
                  <img src={building.prop_1_icon} alt={building.prop_1_description} />
                  <p>{building.prop_1_description}</p>
                </li>
                <li className="flex ai-c">
                  <img src={building.prop_2_icon} alt={building.prop_2_description} />
                  <p>{building.prop_2_description}</p>
                </li>
                <li className="flex ai-c">
                  <img src={building.prop_3_icon} alt={building.prop_3_description} />
                  <p>{building.prop_3_description}</p>
                </li>
                <li className="flex ai-c">
                  <img src={building.prop_4_icon} alt={building.prop_4_description} />
                  <p>{building.prop_4_description}</p>
                </li>
                <li className="flex ai-c">
                  <img src={building.prop_5_icon} alt={building.prop_5_description} />
                  <p>{building.prop_5_description}</p>
                </li>
                <li className="flex ai-c">
                  <img src={building.prop_6_icon} alt={building.prop_6_description} />
                  <p>{building.prop_6_description}</p>
                </li>
                <li className="flex ai-c">
                  <img src={building.prop_7_icon} alt={building.prop_7_description} />
                  <p>{building.prop_7_description}</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {redirect ? <Redirect push to={`/pietro/${redirectId}`} /> : null}
      <div className="container" >
        <div className="building-details building-details-mobile">
          <img src={investment.logo} alt={investment.name} />
          <h4 className="building-details-name">{investment.name}</h4>
          <h5 className="building-details-address">{investment.address}</h5>
          <h4 className="building-details-building-name">{building.name}</h4>
          <p className="building-details-stage">{building.stage_description}</p>
          <div className="building-details-list">
            <ul>
              <li className="flex ai-c">
                <img src={building.prop_1_icon} alt={building.prop_1_description} />
                <p>{building.prop_1_description}</p>
              </li>
              <li className="flex ai-c">
                <img src={building.prop_2_icon} alt={building.prop_2_description} />
                <p>{building.prop_2_description}</p>
              </li>
              <li className="flex ai-c">
                <img src={building.prop_3_icon} alt={building.prop_3_description} />
                <p>{building.prop_3_description}</p>
              </li>
              <li className="flex ai-c">
                <img src={building.prop_4_icon} alt={building.prop_4_description} />
                <p>{building.prop_4_description}</p>
              </li>
              <li className="flex ai-c">
                <img src={building.prop_5_icon} alt={building.prop_5_description} />
                <p>{building.prop_5_description}</p>
              </li>
              <li className="flex ai-c">
                <img src={building.prop_6_icon} alt={building.prop_6_description} />
                <p>{building.prop_6_description}</p>
              </li>
              <li className="flex ai-c">
                <img src={building.prop_7_icon} alt={building.prop_7_description} />
                <p>{building.prop_7_description}</p>
              </li>
            </ul>
          </div>
        </div>
        <div className="building-atricle flex jc-spb ai-c">
          <div className="building-atricle-text" dangerouslySetInnerHTML={{ __html: building.description }}></div>
          <img src={building.desc_img} alt={building.name} />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Buildings