import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import wallsImg from './images/ico_scianki.png'
import electricImg from './images/ico_instalacja.png'
import hydraulicImg from './images/ico_hydraulika.png'
import heatingImg from './images/ico_ogrzewanie.png'
import unitImg from './images/ico_komorkalokatorska.png'
import GarageImg from './images/ico_zakupgarazu.png'
import plusImg from './images/ico_plus.png'
import downloadImg from './images/ico_download.png'
import Header from './Header.js'
import Footer from './Footer.js'
import $ from 'jquery';


const Units = ({ match }) => {
  const [unit, setUnit] = useState({})
  const [roomsArray, setRoomsArray] = useState([])
  const [clauseId, setClauseId] = useState(0)
  const [clause, setClause] = useState({})
  const [mainImgUrl, setMainImgUrl] = useState('')
  const [investmentId, setInvestmentId] = useState(0)
  const [investment, setInvestment] = useState({})
  const [level, setLevel] = useState({})



  useEffect(() => {
    fetchUnit()

    //add event listeners
    $(document).ready(function () {
      $('.options-box-header').click(function () {
        $(this).next().slideToggle()
      })

      $('.adjust-box-header').click(function () {
        $(this).next().slideToggle()
      })
    })


  }, [])

  useEffect(() => {
    if (clauseId != 0) {
      fetchClause()
    }
  }, [clauseId])

  useEffect(() => {
    if (investmentId != 0) {
      fetchInvestment()
    }
  }, [investmentId])

  useEffect(() => {
    findBalcony()
    findBalcony1()
    findBalcony2()
    findTerrace()
    //console.log('findBalcony', findBalcony())
    setMainImgUrl(unit.img)
  }, [unit])



  // useEffect(() => {
  //   setTimeout(() => {
  //     if(unit.room1.room_type !== 'undefined') {
  //       setRoomsArray([unit.room1, unit.room2, unit.room3, unit.room4, unit.room5, unit.room6, unit.room7, unit.room8, unit.room9, unit.room10])
  //     }
  //   }, 4000);

  //   }, [unit])

  //   useEffect(() => {
  //     if(roomsArray[1].room_type !== 'undefined') {
  //       console.log('tutaj', roomsArray)
  //       let arr = roomsArray.map((r,i) => {
  //         if(r.room_type === '0') roomsArray.splice(i, 1)
  //       })
  //       console.log('arr', arr)
  //     }
  //    }, [roomsArray])



  const logState = () => {
    console.log('clause ud', unit.clause_id)
  }


  // fetch UNIT
  const fetchUnit = () => {
    let details = {
      'id': match.params.unitId
    };

    let formBody = [];
    for (let property in details) {
      let encodedKey = encodeURIComponent(property);
      let encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }

    formBody = formBody.join("&");
    console.log('formBody', formBody)

    fetch('http://kliwo.realizacje.grupaaf.pl/api/units-show', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: formBody
    }).then(r => {
      return r.json()
    }).then(j => {
      setUnit(j.data.unit)
      setClauseId(j.data.unit.clause_id)
      setInvestmentId(j.data.unit.investment_id)
      setLevel(j.data.level)
      console.log('this unit', j)


    })
  }



  // fetch INVESTMENT
  const fetchInvestment = () => {
    let details = {
      'id': investmentId
    };

    let formBody = [];
    for (let property in details) {
      let encodedKey = encodeURIComponent(property);
      let encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }

    formBody = formBody.join("&");
    console.log('formBody', formBody)

    fetch('http://kliwo.realizacje.grupaaf.pl/api/investments-show', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: formBody
    }).then(r => {
      return r.json()
    }).then(j => {
      setInvestment(j.data.investments)
      console.log('investment', j)


    })
  }

  const formatBigNumber = x => {
    console.log('X LICZBA', x)
    if (x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
    
}



  // fetch CLAUSE
  const fetchClause = () => {
    let details = {
      'id': clauseId
    };

    let formBody = [];
    for (let property in details) {
      let encodedKey = encodeURIComponent(property);
      let encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }

    formBody = formBody.join("&");
    console.log('formBody', formBody)

    fetch('http://kliwo.realizacje.grupaaf.pl/api/clause', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: formBody
    }).then(r => {
      return r.json()
    }).then(j => {
      //setUnit(j.data.unit)
      console.log('klauzula', j)
      setClause(j.data.clause)
    })
  }


  const showRoomName = id => {
    switch (id) {
      case "0": return 'Brak'
        break;
      case '1': return 'Korytarz'
        break;
      case '2': return 'Pokój'
        break;
      case '3': return 'Pokój + aneks kuchenny'
        break;
      case '4': return 'Łazienka'
        break;
      case '5': return 'WC'
        break;
      case '6': return 'Kuchnia'
        break;
      case '7': return 'Garderoba'
        break;
      case '8': return 'Ścianki działowe*'
        break;
      case '9': return 'Balkon'
        break;
      case '10': return 'Taras'
        break;
      case '11': return 'Wiatrołap'
        break;
      case '12': return 'Zaplecze'
        break;
      case '13': return 'Pomieszczenie socjalne'
        break;
      case '14': return 'Sala sprzedaży'
        break;
      case '15': return 'Przedsionek'
        break;
      case '16': return 'Biuro'
        break;
      case '17': return 'Sala zabaw'
        break;
      case '18': return 'Pomieszczenie'
        break;
      case '19': return 'Pomieszczenie I'
        break;
      case '20': return 'Pomieszczenie II'
        break;
      case '21': return 'Pomieszczenie III'
        break;
      case '22': return 'Pomieszczenie IV'
        break;
      case '23': return 'Pom. gospodarcze'
        break;
      case '24': return 'Pom. gospodarcze 1'
        break;
      case '25': return 'Pom. gospodarcze 2'
        break;
      case '26': return 'Pom. gospodarcze'
        break;
      case '27': return 'Pom. porządkowe'
        break;
      case '28': return 'Komórka lokatorska'
        break;
    }
  }

  const findBalcony = () => {
    for (let i = 1; i <= 12; i++) {
      let propName = `room_type${i}`
      if (unit[propName] === '9') return i
    }
    return false
  }

  const findBalcony1 = () => {
    for (let i = 1; i <= 12; i++) {
      let propName = `room_type${i}`
      if (unit[propName] === '29') return i
    }
    return false
  }

  const findBalcony2 = () => {
    for (let i = 1; i <= 12; i++) {
      let propName = `room_type${i}`
      if (unit[propName] === '30') return i
    }
    return false
  }

  const findTerrace = () => {
    for (let i = 1; i <= 12; i++) {
      let propName = `room_type${i}`
      if (unit[propName] === '10') return i
    }
    return false
  }

  const showLevelName = number => {
    if(number == 0) {
      return 'Parter'
    } else {
      return number
    }
  }

  const roomsSpaceAmount = () => {
    let balconyNumber = findBalcony()
    let balconyNumber1 = findBalcony1()
    let balconyNumber2 = findBalcony2()
    let terraceNumber = findTerrace()
    let balconySpace = 0
    let balconySpace1 = 0
    let balconySpace2 = 0
    let terraceSpace = 0
    if (balconyNumber) {
      balconySpace = unit[`room${balconyNumber}_m2`]
      console.log('Balcony space', balconySpace)
    }
    if (balconyNumber1) {
      balconySpace1 = unit[`room${balconyNumber1}_m2`]
      console.log('Balcony space', balconySpace1)
    }
    if (balconyNumber2) {
      balconySpace2 = unit[`room${balconyNumber2}_m2`]
      console.log('Balcony space', balconySpace2)
    }
    if (terraceNumber) {
      terraceSpace = unit[`room${terraceNumber}_m2`]
     
    }
    let amount = Number(unit.room1_m2) + Number(unit.room2_m2) + Number(unit.room3_m2) + Number(unit.room4_m2) + Number(unit.room5_m2) + Number(unit.room6_m2) + Number(unit.room7_m2) + Number(unit.room8_m2) + Number(unit.room9_m2) + Number(unit.room10_m2) - Number(balconySpace) - Number(balconySpace1) - Number(balconySpace2) - Number(terraceSpace)
    return Math.round((amount + Number.EPSILON) * 100) / 100
  }

  const roomsFloorSpaceSummery = () => {
    let amount = Number(unit.room1_floor) + Number(unit.room2_floor) + Number(unit.room3_floor) + Number(unit.room4_floor) + Number(unit.room5_floor) + Number(unit.room6_floor) + Number(unit.room7_floor) + Number(unit.room8_floor) + Number(unit.room9_floor) + Number(unit.room10_floor)
    return Math.round((amount + Number.EPSILON) * 100) / 100
  }

  const handleMainImgUrl = url => {
    setMainImgUrl(url)
  }


  const addToComparison = () => {
    let comparedUnits = []
    if(typeof window !== 'undefined') {
        if(localStorage.getItem('kliwoUnits')) {
            comparedUnits = JSON.parse(localStorage.getItem('kliwoUnits'))
        }
        if(comparedUnits.length >= 4) {
          alert("Nie mona porównać więcej niz 4 mieszkania!")
          return
        }

        let unitDoubled
        if(comparedUnits.length > 0) {
          unitDoubled = comparedUnits.find(el => {
            return unit.id === el.id
          })
        }
        if(unitDoubled) {
          alert("To mieszkanie jest ju dodane do porównywarki!")
          return
        }

        console.log('unit1', unit)
        comparedUnits.push({
            ...unit,
            level: level.number
        })
        comparedUnits = Array.from(new Set(comparedUnits.map(u => u.id))).map(id => {
            return comparedUnits.find(u => u.id === id)
        })
        localStorage.setItem('kliwoUnits', JSON.stringify(comparedUnits))
        alert(`Dodałeś mieszkanie ${unit.name} do porównywarki`)
        // next()
    }
}


  return (
    <div className="unitView">
      <Header />
      <div style={{display: unit.status == "1" ? '' : 'none'}} className="container">
      <p className="unit-access-denied-title" >Nie masz dostępu do tego podglądu tego mieszkania.</p>
      </div>
      <div style={{display: unit.status == "1" ? 'none' : ''}} className="container">
        <div className="unitView-content flex">
          <div className="unitView-left w-50">
            <div className="unitView-images flex jc-c">
              <div className="unitView-images-container flex">
                {/* <div style={{ display: unit.available_wall == "1" ? '' : 'none' }} className="unitView-images-concepts">
                  <p className="unitView-images-concepts-title">Wybierz układ ścianek działowych</p>
                  <div className="concepts-signle" onClick={() => handleMainImgUrl(unit.concept1)}>
                    <img src={unit.concept1} alt="" />
                  </div>
                  <div className="concepts-signle" onClick={() => handleMainImgUrl(unit.concept2)}>
                    <img src={unit.concept2} alt="" />
                  </div>
                  <div className="concepts-signle" onClick={() => handleMainImgUrl(unit.concept3)}>
                    <img src={unit.concept3} alt="" />
                  </div>
                  <div className="concepts-signle" onClick={() => handleMainImgUrl(unit.concept4)}>
                    <img src={unit.concept3} alt="" />
                  </div>
                </div> */}
                <div className="unitView-main-img">
                  <img src={mainImgUrl} alt="" />
                </div>
              </div>
            </div>

            <div className="unitView-clause">
              <h3 className="bold-title">Dodatkowe informacje</h3>
              <div dangerouslySetInnerHTML={{ __html: clause.description }}></div>
            </div>

          </div>



          <div className="unitView-right w-50">
            <div className="flex jc-spb ai-fs">
              <div className="unitView-investment-data flex ai-c">
                <img src={investment.logo} alt={investment.name} />
                <div className="unitView-investment-details">
                  <h6 className="unitView-investment-details-name">{investment.name}</h6>
                  <p className="unitView-investment-details-address">{investment.address}</p>
                </div>
              </div>
              <button onClick={addToComparison} className="unitView-add-to-comparison-btn"><img src={plusImg} alt="Dodaj do porównania" />Dodaj do porównania</button>
            </div>

            <h4 className="unitView-unit-name">
              Mieszkanie <span>{unit.name}</span>
            </h4>
            <div className="unitView-main-info">
              <div className="info-row flex">
                <div className="info-cell w-50">
                  <span className="info-cell-title">Powierzchnia</span>
                  <span className="info-cell-data">{unit.space} m<sup>2</sup></span>
                </div>
                <div className="info-cell w-50">
                  <span className="info-cell-title">Liczba pokoi</span>
                  <span className="info-cell-data">{unit.rooms}</span>
                </div>
              </div>
              <div className="info-row flex">
                <div className="info-cell w-33">
                  <span className="info-cell-title">Cena łączna</span>
                  <span className="info-cell-data">{formatBigNumber(unit.price)}</span>
                </div>
                <div className="info-cell w-33">
                  <span className="info-cell-title">Cena za m<sup>2</sup></span>
                  <span className="info-cell-data">{formatBigNumber(unit.priceperm2)}</span>
                </div>
                <div className="info-cell w-33">
                  <span className="info-cell-title">Piętro</span>
                  <span className="info-cell-data">{showLevelName(level.number)}</span>
                </div>
              </div>
            </div>

            <div style={{display: unit.room1_floor == 0 ? 'none' : ''}} className="unitView-rooms">
              <h4 className="bold-title">Zestawienie pomieszczeń lokalu</h4>
              <table className="rooms-table">
                <thead>
                  <tr>
                    <th>Nr</th>
                    <th>Pomieszczenie</th>
                    <th>Pow. użytkowa<sup>**</sup></th>
                    <th>Pow. podłogi<sup>***</sup></th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ display: unit.room_type1 === '0' || unit.room_type1 === '9' || unit.room_type1 === '10' || unit.room_type1 === '29' || unit.room_type1 === '30' ? 'none' : '' }}>
                    <td>1</td>
                    <td>{showRoomName(unit.room_type1)}</td>
                    <td>{unit.room1_m2} m<sup>2</sup></td>
                    <td>{unit.room1_floor} m<sup>2</sup></td>
                  </tr>
                  <tr style={{ display: unit.room_type2 === '0' || unit.room_type2 === '9' || unit.room_type2 === '10' || unit.room_type2 === '29' || unit.room_type2 === '30' ? 'none' : '' }}>
                    <td>2</td>
                    <td>{showRoomName(unit.room_type2)}</td>
                    <td>{unit.room2_m2} m<sup>2</sup></td>
                    <td>{unit.room2_floor} m<sup>2</sup></td>
                  </tr>
                  <tr style={{ display: unit.room_type3 === '0' || unit.room_type3 === '9' || unit.room_type3 === '10' || unit.room_type3 === '29' || unit.room_type3 === '30' ? 'none' : '' }}>
                    <td>3</td>
                    <td>{showRoomName(unit.room_type3)}</td>
                    <td>{unit.room3_m2} m<sup>2</sup></td>
                    <td>{unit.room3_floor} m<sup>2</sup></td>
                  </tr>
                  <tr style={{ display: unit.room_type4 === '0' || unit.room_type4 === '9' || unit.room_type4 === '10' || unit.room_type4 === '29' || unit.room_type4 === '30' ? 'none' : '' }}>
                    <td>4</td>
                    <td>{showRoomName(unit.room_type4)}</td>
                    <td>{unit.room4_m2} m<sup>2</sup></td>
                    <td>{unit.room4_floor} m<sup>2</sup></td>
                  </tr>
                  <tr style={{ display: unit.room_type5 === '0' || unit.room_type5 === '9' || unit.room_type5 === '10' || unit.room_type5 === '29' || unit.room_type5 === '30' ? 'none' : '' }}>
                    <td>5</td>
                    <td>{showRoomName(unit.room_type5)}</td>
                    <td>{unit.room5_m2} m<sup>2</sup></td>
                    <td>{unit.room5_floor} m<sup>2</sup></td>
                  </tr>
                  <tr style={{ display: unit.room_type6 === '0' || unit.room_type6 === '9' || unit.room_type6 === '10' || unit.room_type6 === '29' || unit.room_type6 === '30' ? 'none' : '' }}>
                    <td>6</td>
                    <td>{showRoomName(unit.room_type6)}</td>
                    <td>{unit.room6_m2} m<sup>2</sup></td>
                    <td>{unit.room6_floor} m<sup>2</sup></td>
                  </tr>
                  <tr style={{ display: unit.room_type7 === '0' || unit.room_type7 === '9' || unit.room_type7 === '10' || unit.room_type7 === '29' || unit.room_type7 === '30' ? 'none' : '' }}>
                    <td>7</td>
                    <td>{showRoomName(unit.room_type7)}</td>
                    <td>{unit.room7_m2} m<sup>2</sup></td>
                    <td>{unit.room7_floor} m<sup>2</sup></td>
                  </tr>
                  <tr style={{ display: unit.room_type8 === '0' || unit.room_type8 === '9' || unit.room_type8 === '10' || unit.room_type8 === '29' || unit.room_type8 === '30' ? 'none' : '' }}>
                    <td>8</td>
                    <td>{showRoomName(unit.room_type8)}</td>
                    <td>{unit.room8_m2} m<sup>2</sup></td>
                    <td>{unit.room8_floor} m<sup>2</sup></td>
                  </tr>
                  <tr style={{ display: unit.room_type9 === '0' || unit.room_type9 === '9' || unit.room_type9 === '10' || unit.room_type9 === '29' || unit.room_type9 === '30' ? 'none' : '' }}>
                    <td>9</td>
                    <td>{showRoomName(unit.room_type9)}</td>
                    <td>{unit.room9_m2} m<sup>2</sup></td>
                    <td>{unit.room9_floor} m<sup>2</sup></td>
                  </tr>
                  <tr style={{ display: unit.room_type10 === '0' || unit.room_type10 === '9' || unit.room_type10 === '10' || unit.room_type10 === '29' || unit.room_type10 === '30' ? 'none' : '' }}>
                    <td>10</td>
                    <td>{showRoomName(unit.room_type10)}</td>
                    <td>{unit.room10_m2} m<sup>2</sup></td>
                    <td>{unit.room10_floor} m<sup>2</sup></td>
                  </tr>
                  <tr className="rooms-table-summary">
                    <td></td>
                    <td>Powierzchnia (łącznie)</td>
                    <td>{roomsSpaceAmount()} m<sup>2</sup></td>
                    <td>{roomsFloorSpaceSummery()} m<sup>2</sup></td>
                  </tr>
                  <tr style={{ display: findBalcony() ? '' : 'none' }}>
                    <td></td>
                    <td>Balkon</td>
                    <td >{unit[`room${findBalcony()}_m2`]} m<sup>2</sup></td>
                    <td></td>
                  </tr>
                  <tr style={{ display: findBalcony1() ? '' : 'none' }}>
                    <td></td>
                    <td>Balkon 1</td>
                    <td >{unit[`room${findBalcony1()}_m2`]} m<sup>2</sup></td>
                    <td></td>
                  </tr>
                  <tr style={{ display: findBalcony2() ? '' : 'none' }}>
                    <td></td>
                    <td>Balkon 2</td>
                    <td >{unit[`room${findBalcony2()}_m2`]} m<sup>2</sup></td>
                    <td></td>
                  </tr>
                  <tr style={{ display: findTerrace() ? '' : 'none' }}>
                    <td></td>
                    <td>Tarsa</td>
                    <td >{unit[`room${findTerrace()}_m2`]} m<sup>2</sup></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>


            <div style={{display: unit.room1_floor != 0 ? 'none' : ''}} className="unitView-rooms unitView-rooms-one-column">
              <h4 className="bold-title">Zestawienie pomieszczeń lokalu</h4>
              <table className="rooms-table">
                <thead>
                  <tr>
                    <th>Nr</th>
                    <th>Pomieszczenie</th>
                    <th>Powierzchnia</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ display: unit.room_type1 === '0' || unit.room_type1 === '9' || unit.room_type1 === '10' || unit.room_type1 === '29' || unit.room_type1 === '30' ? 'none' : '' }}>
                    <td>1</td>
                    <td>{showRoomName(unit.room_type1)}</td>
                    <td>{unit.room1_m2} m<sup>2</sup></td>
                  </tr>
                  <tr style={{ display: unit.room_type2 === '0' || unit.room_type2 === '9' || unit.room_type2 === '10' || unit.room_type2 === '29' || unit.room_type2 === '30' ? 'none' : '' }}>
                    <td>2</td>
                    <td>{showRoomName(unit.room_type2)}</td>
                    <td>{unit.room2_m2} m<sup>2</sup></td>
                  </tr>
                  <tr style={{ display: unit.room_type3 === '0' || unit.room_type3 === '9' || unit.room_type3 === '10' || unit.room_type3 === '29' || unit.room_type3 === '30' ? 'none' : '' }}>
                    <td>3</td>
                    <td>{showRoomName(unit.room_type3)}</td>
                    <td>{unit.room3_m2} m<sup>2</sup></td>
                  </tr>
                  <tr style={{ display: unit.room_type4 === '0' || unit.room_type4 === '9' || unit.room_type4 === '10' || unit.room_type4 === '29' || unit.room_type4 === '30' ? 'none' : '' }}>
                    <td>4</td>
                    <td>{showRoomName(unit.room_type4)}</td>
                    <td>{unit.room4_m2} m<sup>2</sup></td>
                  </tr>
                  <tr style={{ display: unit.room_type5 === '0' || unit.room_type5 === '9' || unit.room_type5 === '10' || unit.room_type5 === '29' || unit.room_type5 === '30' ? 'none' : '' }}>
                    <td>5</td>
                    <td>{showRoomName(unit.room_type5)}</td>
                    <td>{unit.room5_m2} m<sup>2</sup></td>
                  </tr>
                  <tr style={{ display: unit.room_type6 === '0' || unit.room_type6 === '9' || unit.room_type6 === '10' || unit.room_type6 === '29' || unit.room_type6 === '30' ? 'none' : '' }}>
                    <td>6</td>
                    <td>{showRoomName(unit.room_type6)}</td>
                    <td>{unit.room6_m2} m<sup>2</sup></td>
                  </tr>
                  <tr style={{ display: unit.room_type7 === '0' || unit.room_type7 === '9' || unit.room_type7 === '10' || unit.room_type7 === '29' || unit.room_type7 === '30' ? 'none' : '' }}>
                    <td>7</td>
                    <td>{showRoomName(unit.room_type7)}</td>
                    <td>{unit.room7_m2} m<sup>2</sup></td>
                  </tr>
                  <tr style={{ display: unit.room_type8 === '0' || unit.room_type8 === '9' || unit.room_type8 === '10' || unit.room_type8 === '29' || unit.room_type8 === '30' ? 'none' : '' }}>
                    <td>8</td>
                    <td>{showRoomName(unit.room_type8)}</td>
                    <td>{unit.room8_m2} m<sup>2</sup></td>
                  </tr>
                  <tr style={{ display: unit.room_type9 === '0' || unit.room_type9 === '9' || unit.room_type9 === '10' || unit.room_type9 === '29' || unit.room_type9 === '30' ? 'none' : '' }}>
                    <td>9</td>
                    <td>{showRoomName(unit.room_type9)}</td>
                    <td>{unit.room9_m2} m<sup>2</sup></td>
                  </tr>
                  <tr style={{ display: unit.room_type10 === '0' || unit.room_type10 === '9' || unit.room_type10 === '10' || unit.room_type10 === '29' || unit.room_type10 === '30' ? 'none' : '' }}>
                    <td>10</td>
                    <td>{showRoomName(unit.room_type10)}</td>
                    <td>{unit.room10_m2} m<sup>2</sup></td>
                  </tr>
                  <tr className="rooms-table-summary">
                    <td></td>
                    <td>Powierzchnia (łącznie)</td>
                    <td>{roomsSpaceAmount()} m<sup>2</sup></td>
                  </tr>
                  <tr style={{ display: findBalcony() ? '' : 'none' }}>
                    <td></td>
                    <td>Balkon</td>
                    <td >{unit[`room${findBalcony()}_m2`]} m<sup>2</sup></td>
                  </tr>
                  <tr style={{ display: findBalcony1() ? '' : 'none' }}>
                    <td></td>
                    <td>Balkon 1</td>
                    <td >{unit[`room${findBalcony1()}_m2`]} m<sup>2</sup></td>
                  </tr>
                  <tr style={{ display: findBalcony2() ? '' : 'none' }}>
                    <td></td>
                    <td>Balkon 2</td>
                    <td >{unit[`room${findBalcony2()}_m2`]} m<sup>2</sup></td>
                  </tr>
                  <tr style={{ display: findTerrace() ? '' : 'none' }}>
                    <td></td>
                    <td>Taras</td>
                    <td >{unit[`room${findTerrace()}_m2`]} m<sup>2</sup></td>
                  </tr>
                </tbody>
              </table>
            </div>


            <h4 className="bold-title">Pobierz katalog z opisem lokalu</h4>
            <a target="blank" href={unit.pdf} className="download-pdf"><img src={downloadImg} alt="Pobierz pdf" />POBIERZ PDF</a>

            <div className="adjust">
              <h4 className="bold-title">Dostosuj lokal do swoich potrzeb</h4>
              <div className="adjust-boxes">

                <div style={{ display: unit.available_wall === '0' ? 'none' : '' }} className="adjust-box">
                  <div className="adjust-box-header flex ai-c">
                    <img src={wallsImg} alt="Układ ścianek działowych" />
                    {unit.available_wall == '1' && (
                      <h6 className="adjust-box-title arrow-after">Wybierz układ ścianek działowych</h6>
                    )}
                    {unit.available_wall == '2' && (
                      <h6 className="adjust-box-title arrow-after">Ścianki działowe wybudowane</h6>
                    )}
                    
                  </div>
                  <div className="adjust-box-body">
                  {unit.available_wall == '1' && (
                      <p>Możesz przedstawić własny projekt wykonania ścianek działowych. O szczegóły zapytaj naszego konsultanta.</p>
                    )}
                    {unit.available_wall == '2' && (
                      <p>Opcja wybudowania ścianek działowych według Twojego projektu nie jest już dostępna</p>
                    )}
                    
                  </div>
                </div>

                <div style={{ display: unit.available_electric === '0' ? 'none' : '' }} className="adjust-box">
                  <div className="adjust-box-header flex ai-c">
                    <img src={electricImg} alt="Układ ścianek działowych" />
                    {unit.available_electric == '1' && (
                      <h6 className="adjust-box-title arrow-after">Ustal rozkład instalacji elektrycznej</h6>
                    )}
                    {unit.available_electric == '2' && (
                      <h6 className="adjust-box-title arrow-after">Instalacja elektryczna wykonana</h6>
                    )}
                    
                  </div>
                  <div className="adjust-box-body">
                  {unit.available_electric == '1' && (
                      <p>Możesz przedstawić własny projekt wykonania instalacji elektrycznej. O szczegóły zapytaj naszego konsultanta.</p>
                    )}
                    {unit.available_electric == '2' && (
                      <p>Opcja wykonania instalacji elektrycznej według Twojego projektu nie jest już dostępna</p>
                    )}
                    
                  </div>
                </div>

                <div style={{ display: unit.available_hydraulic === '0' ? 'none' : '' }} className="adjust-box">
                  <div className="adjust-box-header flex ai-c">
                    <img src={hydraulicImg} alt="Układ ścianek działowych" />
                    {unit.available_hydraulic == '1' && (
                      <h6 className="adjust-box-title arrow-after">Ustal rozkład instalacji hydraulicznej</h6>
                    )}
                    {unit.available_hydraulic == '2' && (
                      <h6 className="adjust-box-title arrow-after">Instalacja hydrauliczna ukończona</h6>
                    )}
                    
                  </div>
                  <div className="adjust-box-body">
                  {unit.available_hydraulic == '1' && (
                      <p>Możesz przedstawić własny projekt wykonania instalacjihydraulicznej. O szczegóły zapytaj naszego konsultanta.</p>
                    )}
                    {unit.available_hydraulic == '2' && (
                      <p>Opcja wykonania instalacji hydraulicznej według Twojego projektu nie jest już dostępna</p>
                    )}
                    
                  </div>
                </div>

                <div style={{ display: unit.available_heating === '0' ? 'none' : '' }} className="adjust-box">
                  <div className="adjust-box-header flex ai-c">
                    <img src={heatingImg} alt="Układ ścianek działowych" />
                    {unit.available_heating == '1' && (
                      <h6 className="adjust-box-title arrow-after">Dostosuj zasięg ogrzewania podłogowego</h6>
                    )}
                    {unit.available_heating == '2' && (
                      <h6 className="adjust-box-title arrow-after">Instalacja ogrzewania podłogowego wykonana</h6>
                    )}
                    
                  </div>
                  <div className="adjust-box-body">
                  {unit.available_heating == '1' && (
                      <p>Możesz zrezygnować z grzejników w pokojach i bezpłatnie rozszerzyć zasięg ogrzewania podłogowego na całą powierzchnię lokalu bądź pozostawić grzejniki i powiększyć rozmiar instalacji za dodatkową opłatą. O szczegóły zapytaj naszego konsultanta.</p>
                    )}
                    {unit.available_heating == '2' && (
                      <p>Opcja wykonania instalacji ogrzewania podłogowego według Twojego projektu nie jest już dostępna</p>
                    )}
                    
                  </div>
                </div>


              </div>
            </div>


            <div className="unitView-options">
              <h4 className="bold-title">Skorzystaj z dodatkowych opcji</h4>
              <div className="options-boxes">
                <div className="options-box">
                  <div className="options-box-header flex ai-c">
                    <img src={unitImg} alt="ZAkup komórkę lokatorską" />
                    <h6 className="options-box-title arrow-after">Zakup komórkę lokatorską</h6>
                  </div>
                  <div className="options-box-body">
                    <p>Aby dowiedzieć się więcej o komórkach lokatorskich, prosimy o kontakt z naszym konsultantem.</p>
                    <a className="bold phone-before" href="tel:+48690911799">+48 690 911 799</a>
                  </div>
                </div>
                <div className="options-box">
                  <div className="options-box-header options-box-header-white flex ai-c">
                    <img src={GarageImg} alt="Miejsce postojowe" />
                    <h6 className="options-box-title">Zakup miejsce postojowe<br />w garażu podziemnym</h6>
                  </div>
                </div>

              </div>
            </div>


          </div>
          {/* end of right */}

          <div className="unitView-clause-mobile">
              <h3 className="bold-title">Dodatkowe informacje</h3>
              <div dangerouslySetInnerHTML={{ __html: clause.description }}></div>
            </div>

        </div>



      </div>
      <Footer />
    </div>
  )
}

export default Units