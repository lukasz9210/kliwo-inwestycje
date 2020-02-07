import React, { useState, useEffect } from 'react'
import {Redirect} from 'react-router-dom'

const Buildings = ({match}) => {
    const [building, setBuilding] = useState({})
    const [levelsInBuilding, setLevelsInBuilding] = useState([])
    const [redirect, setRedirect] = useState(false)
    const [redirectId, setRedirectId] = useState()
    const [investmentId, setInvestmentId] = useState(0)
    const [investment, setInvestment] = useState({})

    useEffect(() => {
        fetchBuilding()
        fetchLevelsInBuilding()
    }, [])


    useEffect(() => {
      if(investmentId != 0) {
        fetchInvestment()
      }
    }, [investmentId])


    // fetch BUILDING
    const fetchBuilding = () => {
        let details = {
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
      
          fetch('http://kliwo.realizacje.grupaaf.pl/api/buildings-show', {
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
      let details = {
        'id': building.investment_id
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



    // fetch ALL LEVELS in building
    const fetchLevelsInBuilding = () => {
        let details = {
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
            console.log('all levels in this building', j)
          })
    }


    const redirectToLevel = id => {
        setRedirectId(id)
        setRedirect(true)
    }


    return (
        <div>
            <h1>{building.name}</h1>
            <p className="bold-title">Najedź kursorem na piętro, aby sprawdzić liczbę wolnych lokali.<br />Kliknij, aby zobaczyć rzut pietra.</p>



<svg id="svg1" width="1000" height="621" xmlns="http://www.w3.org/2000/svg" style={{position: 'absolute', background: "url(https://kliwo.pl/images/kliwo/budynki/budynki-trzebnica-cz-b5.jpg)", 'background-size': "cover"}}>
               
               {
                   levelsInBuilding.map((l, i) => {
                       console.log('l', l)
                       let svg = l.coords
                       console.log('svg', svg)
                       return <g id={`levelSVG${i + 1}`} onClick={() => {redirectToLevel(l.id)}} dangerouslySetInnerHTML={{__html: svg}}>
                               
                               </g>
                    


                   })
               }
           </svg>
        {redirect ? <Redirect to={`/pietro/${redirectId}`} /> : null}


        <div className="container" >

        <div className="building-details">
          <img src={investment.logo} alt={investment.name} />
          <h4 className="building-details-name">{investment.name}</h4>
          <h5 className="building-details-address">{investment.address}</h5>
          <h4 className="building-details-building-name">{building.name}</h4>
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


        <div className="building-atricle flex ai-c">
          <div className="building-atricle-text" dangerouslySetInnerHTML={{__html: building.description}}></div>
          <img src={building.desc_img} alt={building.name} />
        </div>


        </div>

        </div>
    )
}

export default Buildings