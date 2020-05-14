import React, { useState, useEffect } from 'react'
import { Redirect, Link } from 'react-router-dom'
import Header from './Header.js'
import Footer from './Footer.js'
import preLoaderGif from './images/preloader.gif'
import phoneImg from './images/ico_phone.png'
import $ from 'jquery';
import { parser } from './helpers.js'

const Levels = ({ match }) => {
  const [level, setLevel] = useState({})
  const [unitsInLevel, setUnitsInLevel] = useState([])
  const [redirect, setRedirect] = useState(false)
  const [redirectId, setRedirectId] = useState()
  const [investment, setInvestment] = useState({})
  const [buildings, setBuildings] = useState({})
  const [buildingsArray, setBuildingsArray] = useState([])
  const [imaheHeightMobile, setImaheHeightMobile] = useState(0)
  const [selectedBuildingId, setSelectedBuildingId] = useState(0) //initial selected is current building
  const [levelsInBuilding, setLevelsInBuilding] = useState([])
  const [dataInCloud, setDataInCloud] = useState({ count_m: { free: 0 }, count_l: { free: 0 } })
  const [cloudShown, setCloudShown] = useState(false)
  const [loading, setLoading] = useState(true)
  const [levelImgLoading, setLevelImgLoading] = useState(false)
  const [imageHeight, setImageHeight] = useState(0)
  let windowWidth = 0
  let widthofScreen = 0

  useEffect(() => {
    windowWidth = window.innerWidth
    fetchLevel(match.params.levelId)
    fetchUnitsInLevel(match.params.levelId)
    fetchBuildings()

    if (windowWidth > 1300) {
      const interval = setInterval(() => {
        const ih = document.getElementById('coverImg').height
        if (ih) {
          setImageHeight(ih)
          console.log("IH JEST", ih)
          clearInterval(interval)
        }
      }, 10)
    }

    if (windowWidth < 1300) {
      const interval = setInterval(() => {
        const ihmobile = document.getElementById('level-svg-mobile').height
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



  useEffect(() => {
    if (imaheHeightMobile) {
      const svgContainer = document.getElementById('level-svg-mobile')
      const svgCont = document.getElementById('levelSvgImgMobile')
      const svgContainerWidth = Math.round(svgContainer.width)
      const svgContainerHeight = svgContainer.height
      const intervalGElems = setInterval(() => {
        const gElems = svgCont.querySelectorAll('g')
        if (gElems.length > 0) {
          clearInterval(intervalGElems)
          //console.log('gElems SA', gElems)

          gElems.forEach((g, i) => {
            let pathElem = g.querySelector('path')
            //console.log('path przed', pathElem)
            const svgText = pathElem.outerHTML
            //console.log('SVG TEXT', svgText)
            //console.log('data for parse', svgText, svgContainerWidth, svgContainerHeight)
            const newcoords = parser(svgText, [910, 745], [svgContainerWidth, svgContainerHeight])
            pathElem.setAttribute('d', newcoords)
            //console.log('path po', i, pathElem)
            setLoading(false)
          })
        }
      }, 1000)

      $('path').mouseenter(function () {
        $(this).addClass('svgActive')
      })

      $('path').mouseleave(function () {
        $(this).removeClass('svgActive')
      })
    }
  }, [imaheHeightMobile])


  useEffect(() => {
    if (imageHeight) {
      windowWidth = window.innerWidth
      if (windowWidth > 1300) {
        const svgContainer = document.getElementById('levelSvgImg')  //kontener svg
        const svgContainerWidth = Math.round(svgContainer.width.baseVal.value / 0.6)
        const intervalGElems = setInterval(() => {
          const gElems = svgContainer.querySelectorAll('g')
          if (gElems.length > 0) {
            clearInterval(intervalGElems)
            gElems.forEach((g, i) => {
              let pathElem = g.querySelector('path')
              //console.log('path przed', pathElem)
              const svgText = pathElem.outerHTML
              //console.log('SVG TEXT', svgText)
              //console.log('data for parse1111', i, svgText, svgContainerWidth, imageHeight)
              const newcoords = parser(svgText, [910, 745], [svgContainerWidth, imageHeight])
              //console.log('newcoords', i, newcoords)
              //console.log('pathelem przed', i, pathElem) // dlaczego tutaj on ma juz nowe koordynatory
              //console.log("SETTINMG ATTR 1")
              pathElem.setAttribute('d', newcoords)
              //console.log('path po', i, pathElem)
              setLoading(false)
            })
          }
        }, 1000)

        $('path').mouseenter(function () {
          $(this).addClass('svgActive')
        })
        $('path').mouseleave(function () {
          $(this).removeClass('svgActive')
        })
      }
    }
  }, [imageHeight])


  const redirectAfterResize = () => {
    if ($(window).width() == widthofScreen) return;
    window.location.reload();
  }


  useEffect(() => {
    setSelectedBuildingId(level.building_id)
    fetchUnitsInLevel(level.id)
  }, [level])


  useEffect(() => {
    if (selectedBuildingId != 0) {
      fetchLevelsInBuilding()
    }
  }, [selectedBuildingId])


  useEffect(() => {
    let arr = Object.keys(buildings).map((k) => buildings[k])
    setBuildingsArray(arr)
  }, [buildings])


  // fetch LEVEL
  const fetchLevel = (levelId) => {
    const details = {
      'id': levelId
    };
    let formBody = [];
    for (let property in details) {
      let encodedKey = encodeURIComponent(property);
      let encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    //console.log('formBody', formBody)
    fetch('http://kliwo.pl/api/levels-show', {
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
      //console.log('this level', j)
    })
  }


  // fetch ALL UNITS in level
  const fetchUnitsInLevel = levelId => {
    const details = {
      'id': levelId
    };
    let formBody = [];
    for (let property in details) {
      let encodedKey = encodeURIComponent(property);
      let encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    //console.log('formBody', formBody)
    fetch('http://kliwo.pl/api/levels-units-show', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: formBody
    }).then(r => {
      return r.json()
    }).then(j => {
      const arr = Object.values(j.data.units)
      setUnitsInLevel(arr)
      //console.log('all units in this level', j)
    })
  }



  //fetch ALL BUILDINGS
  const fetchBuildings = () => {
    return fetch('http://kliwo.pl/api/buildings')
      .then(response => response.json())
      .then(json => {
        //('All buildings', json.data.buildings)
        setBuildings(json.data.buildings)
      })
  }


  // fetch ALL LEVELS in building
  const fetchLevelsInBuilding = () => {
    const details = {
      'id': selectedBuildingId
    };
    let formBody = [];
    for (let property in details) {
      let encodedKey = encodeURIComponent(property);
      let encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    //console.log('formBody', formBody)
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
      // console.log('all levels in selected building', j)
    })
  }

  const redirectToUnit = (id, status) => {
    if (status == 1) return;
    setRedirectId(id)
    setRedirect(true)
  }


  const selectCurrentBuilding = id => {
    if (id === level.building_id) {
      return true
    } else {
      return false
    }
  }

  const selectCurrentLevel = id => {
    if (id === level.id) {
      return true
    } else {
      return false
    }
  }


  const selectBuildingChange = e => {
    const selectedBuilding = document.getElementById('buildingSelect').value
    const selectedLevel = document.getElementById('levelSelect').value
    console.log('selectedBuilding and lvl', selectedBuilding, selectedLevel)
    setSelectedBuildingId(e.target.value)
  }

  const selectLevelChange = e => {
    setLevelImgLoading(true)
    fetchLevel(e.target.value)
    windowWidth = window.innerWidth
    if (windowWidth > 1300) {
      const svgContainer = document.getElementById('levelSvgImg')  //kontener svg
      const svgContainerWidth = Math.round(svgContainer.width.baseVal.value / 0.6)
      const intervalGElems = setInterval(() => {
        const gElems = svgContainer.querySelectorAll('g')
        if (gElems.length > 0) {
          clearInterval(intervalGElems)
          //console.log('gElems SA', gElems)
          gElems.forEach((g, i) => {
            let pathElem = g.querySelector('path')
            //console.log('path przed', pathElem)
            const svgText = pathElem.outerHTML
            //console.log('data for parse1111', i, svgText, svgContainerWidth, imageHeight)
            const newcoords = parser(svgText, [910, 745], [svgContainerWidth, imageHeight])
            pathElem.setAttribute('d', newcoords)
            //console.log('path po', i, pathElem)
            setLevelImgLoading(false)
          })
        }
      }, 1000)
    } else {
      const svgContainer = document.getElementById('level-svg-mobile')
      const svgCont = document.getElementById('levelSvgImgMobile')
      const svgContainerWidth = Math.round(svgContainer.width)
      const svgContainerHeight = svgContainer.height
      const intervalGElems = setInterval(() => {
        const gElems = svgCont.querySelectorAll('g')
        if (gElems.length > 0) {
          clearInterval(intervalGElems)
          gElems.forEach((g, i) => {
            let pathElem = g.querySelector('path')
            //console.log('path przed', pathElem)
            const svgText = pathElem.outerHTML
            //console.log('SVG TEXT', svgText)
            //console.log('data for parse', svgText, svgContainerWidth, svgContainerHeight)
            const newcoords = parser(svgText, [910, 745], [svgContainerWidth, svgContainerHeight])
            //console.log('newcoords', i, newcoords)
            //console.log('pathelem przed', i, pathElem) // dlaczego tutaj on ma juz nowe koordynatory
            //console.log("SETTINMG ATTR 1")
            pathElem.setAttribute('d', newcoords)
            //console.log('path po', i, pathElem)
            setLevelImgLoading(false)
          })
        }
      }, 1000)
      $('path').mouseenter(function () {
        //jQuery(this).find('path').addClass('svgActive')
        $(this).addClass('svgActive')
        //console.log("PATH JQUERY", this)
      })
      $('path').mouseleave(function () {
        //jQuery(this).find('path').addClass('svgActive')
        $(this).removeClass('svgActive')
      })
    }
  }

  const mouseOver = data => {
    setDataInCloud(data)
    setCloudShown(true)
  }

  const mouseLeave = () => {
    setCloudShown(false)
  }

  const formatBigNumber = x => {
    console.log('X LICZBA', x)
    if (x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
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
      {/* DESKTOP */}
      <div className="svg-container level-svg-desktop" >
        {/* <div style={{display: levelImgLoading ? '' : ''}} className="">
      <img src={preLoaderGif} />
      </div> */}
        <div style={{ position: 'relative' }} className="container">
          <img id="coverImg" style={{ position: 'absolute', width: '60%' }} src={level.img_names} />
          <svg style={{ position: 'absolute' }} id="levelSvgImg" width="60%" height={imageHeight} xmlns="http://www.w3.org/2000/svg">
            {
              unitsInLevel.map((u, i) => {
                let unitClass = ''
                if (u.status == 1) {
                  unitClass = 'unitSold'
                } else if (u.status == 2) {
                  unitClass = 'unitReserved'
                } else if (u.status == 3) {
                  unitClass = 'unitFree'
                }
                //console.log('u', u)
                let svg = u.coords
                //console.log('svg', svg)
                return <g style={{ display: u.published == '1' ? '' : 'none', display: levelImgLoading ? 'none' : '' }} onMouseOver={() => mouseOver(u)} onMouseLeave={() => mouseLeave()} className={unitClass} id={`unitsvg${i + 1}`} onClick={() => { redirectToUnit(u.id, u.status) }} dangerouslySetInnerHTML={{ __html: svg }}>

                </g>
              })
            }
          </svg>
        </div>
        <div style={{ display: cloudShown ? '' : 'none' }} className="svg-cloud svg-cloud-level">
          <p className="svg-cloud-title">Mieszkanie {dataInCloud.name}</p>
          <div className="svg-cloud-table">
            <div className="svg-cloud-table-row flex">
              <div className="svg-cloud-table-cell w-50">
                <span className="bold">Powierzchnia</span>
                <span>{dataInCloud.space} m<sup>2</sup></span>
              </div>
              <div className="svg-cloud-table-cell w-50">
                <span className="bold">liczba pokoi</span>
                <span>{dataInCloud.rooms}</span>
              </div>
            </div>
            <div className="svg-cloud-table-row flex">
              <div className="svg-cloud-table-cell w-33">
                <span className="bold">Cena</span>
                {dataInCloud.logic_price == 0 && (
                  <span>{formatBigNumber(dataInCloud.price)} zł</span>
                )}
                {dataInCloud.logic_price != 0 && (
                  <span>Dane niedostępne</span>
                )}
              </div>
              <div className="svg-cloud-table-cell w-33">
                <span className="bold">CENA ZA m²</span>
                {dataInCloud.logic_priceperm2 == 0 && (
                  <span>{formatBigNumber(dataInCloud.priceperm2)} zł</span>
                )}
                {dataInCloud.logic_priceperm2 != 0 && (
                  <span>Dane niedostępne</span>
                )}
              </div>
              <div className="svg-cloud-table-cell w-33">
                <span className="bold">Piętro</span>
                <span>{dataInCloud.level_number}</span>
              </div>
            </div>
          </div>
          <div className="svg-cloud-level-status flex jc-c">
            {printStatus(dataInCloud)}
          </div>
        </div>
        <div className="container">
          <div className="level-details">
            <img src={investment.logo} alt={investment.name} />
            <h4 className="level-details-name">{investment.name}</h4>
            <h5 className="level-details-address">{investment.address}</h5>
            <div className="level-search">
              <div className="level-search-input">
                <select id="buildingSelect" onChange={selectBuildingChange}>
                  {
                    buildingsArray.map((b) => {
                      let printSelect = selectCurrentBuilding(b.id)
                      //console.log('prineSelect', printSelect)
                      return <option selected={printSelect} value={b.id}>{b.name}</option>
                    })
                  }
                </select>
              </div>
              <div className="level-search-input">
                <select id="levelSelect" onChange={selectLevelChange}>
                  {
                    levelsInBuilding.map((l) => {
                      let printSelectLevel = selectCurrentLevel(l.id)
                      //console.log('prineSelect', printSelectLevel)
                      return <option selected={printSelectLevel} value={l.id}>{l.number} Piętro (Dostępnych lokali {l.count_m.free})</option>
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
            <Link to={`/budynek/${level.building_id}`} className="btn back-to-building-btn">Wróć do widoku budynku</Link>
          </div>
        </div>
      </div>
      {/* MOBILE */}
      <div className="svg-container level-svg-mobile" style={{ height: imaheHeightMobile }}>
        {/* <div style={{display: levelImgLoading ? '' : ''}} className="">
      <img src={preLoaderGif} />
      </div> */}
        <img id="level-svg-mobile" style={{ position: 'absolute', width: '100%' }} src={level.img_names} />
        <svg style={{ position: 'absolute' }} id="levelSvgImgMobile" width="100%" height={imaheHeightMobile} xmlns="http://www.w3.org/2000/svg">
          {
            unitsInLevel.map((u, i) => {
              let unitClass = ''
              if (u.status == 1) {
                unitClass = 'unitSold'
              } else if (u.status == 2) {
                unitClass = 'unitReserved'
              } else if (u.status == 3) {
                unitClass = 'unitFree'
              }
              //console.log('u', u)
              let svg = u.coords
              //console.log('svg', svg)
              return <g style={{ display: u.published == '1' ? '' : 'none', display: levelImgLoading ? 'none' : '' }} onMouseOver={() => mouseOver(u)} onMouseLeave={() => mouseLeave()} className={unitClass} id={`unitsvg${i + 1}`} onClick={() => { redirectToUnit(u.id, u.status) }} dangerouslySetInnerHTML={{ __html: svg }}>

              </g>
            })
          }
        </svg>
        <div style={{ display: cloudShown ? '' : 'none' }} className="svg-cloud svg-cloud-level">
          <p className="svg-cloud-title">Mieszkanie {dataInCloud.name}</p>
          <div className="svg-cloud-table">
            <div className="svg-cloud-table-row flex">
              <div className="svg-cloud-table-cell w-50">
                <span className="bold">Powierzchnia</span>
                <span>{dataInCloud.space} m<sup>2</sup></span>
              </div>
              <div className="svg-cloud-table-cell w-50">
                <span className="bold">liczba pokoi</span>
                <span>{dataInCloud.rooms}</span>
              </div>
            </div>
            <div className="svg-cloud-table-row flex">
              <div className="svg-cloud-table-cell w-33">
                <span className="bold">Cena</span>
                {dataInCloud.logic_price == 0 && (
                  <span>{formatBigNumber(dataInCloud.price)} zł</span>
                )}
                {dataInCloud.logic_price != 0 && (
                  <span>Dane niedostępne</span>
                )}
              </div>
              <div className="svg-cloud-table-cell w-33">
                <span className="bold">CENA ZA m²</span>
                {dataInCloud.logic_priceperm2 == 0 && (
                  <span>{formatBigNumber(dataInCloud.priceperm2)} zł</span>
                )}
                {dataInCloud.logic_priceperm2 != 0 && (
                  <span>Dane niedostępne</span>
                )}
              </div>
              <div className="svg-cloud-table-cell w-33">
                <span className="bold">Piętro</span>
                <span>{dataInCloud.level_number}</span>
              </div>
            </div>
          </div>
          <div className="svg-cloud-level-status flex jc-c">
            {printStatus(dataInCloud)}
          </div>
        </div>
        <div className="container">
          <div className="level-details">
            <img src={investment.logo} alt={investment.name} />
            <h4 className="level-details-name">{investment.name}</h4>
            <h5 className="level-details-address">{investment.address}</h5>
            <div className="level-search">
              <div className="level-search-input">
                <select onChange={selectBuildingChange}>
                  {
                    buildingsArray.map((b) => {
                      let printSelect = selectCurrentBuilding(b.id)
                      //console.log('prineSelect', printSelect)
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
                      //console.log('prineSelect', printSelectLevel)
                      return <option selected={printSelectLevel} value={l.id}>{l.number} Piętro (Dostępnych lokali {l.count_m.free})</option>
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
            <Link to={`/budynek/${level.building_id}`} className="btn back-to-building-btn">Wróć do widoku budynku</Link>
          </div>
        </div>
      </div>

      {redirect ? <Redirect push to={`/mieszkanie/${redirectId}`} /> : null}

      <div className="container">
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
                    //console.log('prineSelect', printSelect)
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
          <Link to={`/budynek/${level.building_id}`} className="btn back-to-building-btn">Wróć do widoku budynku</Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Levels