import React, {useState, useEffect} from 'react'
import {Redirect} from 'react-router-dom'


const Levels = ({match}) => {
    const [level, setLevel] = useState({})
    const [unitsInLevel, setUnitsInLevel] = useState([])
    const [redirect, setRedirect] = useState(false)
    const [redirectId, setRedirectId] = useState()
    const [investmentId, setInvestmentId] = useState(0)
    const [investment, setInvestment] = useState({})
    const [buildings, setBuildings] = useState({})
    const [buildingsArray, setBuildingsArray] = useState([])

    const [selectedBuildingId, setSelectedBuildingId] = useState(0) //initial selected is current building
    const [levelsInBuilding, setLevelsInBuilding] = useState([])
    const [selectedLevelId, setSelectedLevelId] = useState(0)

    const [redirectToLevelId, setRedirectToLevelId]= useState()
    const [redirectToLevelS, setRedirectToLevelS] = useState(false)

    useEffect(() => {
        fetchLevel(match.params.levelId)
        fetchUnitsInLevel(match.params.levelId)
        fetchBuildings()
    }, [])


    useEffect(() => {
      
        setSelectedBuildingId(level.building_id)
        fetchUnitsInLevel(level.id)
    }, [level])


    useEffect(() => {
      if(investmentId != 0) {
        fetchInvestment()
      }
    }, [investmentId])


    useEffect(() => {
      if(selectedBuildingId != 0) {
        fetchLevelsInBuilding()
      }
    }, [selectedBuildingId])


    useEffect(() => {
      let arr = Object.keys(buildings).map((k) => buildings[k])
      setBuildingsArray(arr)
    }, [buildings])


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
            console.log('this level', j)
          })
    }


    // fetch ALL UNITS in level
    const fetchUnitsInLevel = levelId => {
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
      
          fetch('http://kliwo.realizacje.grupaaf.pl/api/levels-units-show', {
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
            console.log('all units in this level', j)
          })
    }


    //fetch INVESTMENT
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
        //console.log('this investment', j.data.investments)
      })
  }

  //fetch ALL BUILDINGS
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

  

    const selectBuildingChange = e => {
      setSelectedBuildingId(e.target.value)
      
    }

    const selectLevelChange = e => {
      setSelectedLevelId(e.target.value)
      //fetch level with id e.target.value
      fetchLevel(e.target.value)
    }

    


    return (
        <div className="level">
            <h1>ID Piętra: {level.id}</h1>
            <h1>Numer piętra: {level.number}</h1>



<svg id="svg1" width="1000" height="621" xmlns="http://www.w3.org/2000/svg" style={{position: 'absolute', background: "url(https://kliwo.pl/images/kliwo/poziomy/b5/2-pietro/2-pietro.jpg)", 'background-size': "cover"}}>
               
               {
                   unitsInLevel.map((u, i) => {
                       //console.log('u', u)
                       let svg = u.coords
                       //console.log('svg', svg)
                       return <g key={i} id={`levelSVG${i + 1}`} onClick={() => {redirectToUnit(u.id)}} dangerouslySetInnerHTML={{__html: svg}}>
                               
                               </g>
                    


                   })
               }
           </svg>

        {redirect ? <Redirect to={`/mieszkanie/${redirectId}`} /> : null}


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
                      return <option value={b.id}>{b.name}</option>
                    })
                  }
                </select>
              </div>
              <div className="level-search-input">
                <select onChange={selectLevelChange}>
                  {
                    levelsInBuilding.map((l) => {
                      return <option value={l.id}>Poziom {l.number}</option>
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
                  <p>zarezerwowane</p>
                </li>
                <li className="level-legend-sold flex ai-c">
                  <span></span>
                  <p>sprzedane</p>
                </li>
              </ul>
            </div>
        </div>
        </div>




      



        </div>
    )
}

export default Levels