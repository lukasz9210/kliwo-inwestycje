import React, {useState, useEffect} from 'react'
import {Redirect} from 'react-router-dom'
import Header from './Header.js'
import Footer from './Footer.js'
import $ from 'jquery';


const Levels = ({match}) => {
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


    const coord = function(xy, orig_size, chngd_size) {
      const x_scale = chngd_size[0] / orig_size[0];
      const y_scale = chngd_size[1] / orig_size[1];
      let coo = [];
      for (let i = 0; i < xy.length; i += 2) {
        coo.push(xy[i] * x_scale);
        coo.push(xy[i+1] * y_scale);
      }
      // console.log('coo', coo)
      return coo;
    }
    
    
    const parser = function(text, o, ch) {
      let parser = new DOMParser();
      let xmlDoc = parser.parseFromString(text, "text/xml");
    
      let d = xmlDoc.getElementsByTagName('path')[0].getAttribute('d');
    
      let arr = d.toUpperCase().replace(/,/g, ' ').replace(/-/g, ' -').split(' ');
    
      arr = arr.filter( val => val != '' );
    
      let k = 0;
      while (k < arr.length) {
        if ((arr[k].length > 1) && (arr[k].match(/[A-Z]/i))) {
            let tmp = arr[k];
            arr[k] = arr[k].substr(0, 1);
            arr.splice(k+1, 0, tmp.substr(1, tmp.length));
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
                tmp2 = tmp2.filter( val => !Number.isNaN(val) );
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
        fetchLevel(match.params.levelId)
        fetchUnitsInLevel(match.params.levelId)
        fetchBuildings()

        setTimeout(() => {
          let ih = document.getElementById('coverImg').height
        //console.log('ih', ih)
        setImaheHeight(ih)
        //console.log('imaheHeight', imaheHeight)
        }, 1000);



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
      let newcoords = parser(svgText, [909, 744], [svgContainerWidth, svgContainerHeight])
      //console.log('newcoords', newcoords)
      pathElem.setAttribute('d', newcoords)
      console.log('path po', pathElem)
    })
    
    $('path').mouseenter(function() {
        //jQuery(this).find('path').addClass('svgActive')
        $(this).addClass('svgActive')
        console.log("PATH JQUERY", this)
      })
    
      $('path').mouseleave(function() {
        //jQuery(this).find('path').addClass('svgActive')
        $(this).removeClass('svgActive')
      })
    
     }, 3000);
     //koniec piEtra


    }, [])


    useEffect(() => {
      
        setSelectedBuildingId(level.building_id)
        fetchUnitsInLevel(level.id)
    }, [level])


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
            setInvestment(j.data.investment)
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
          <Header />
            <h1>ID Piętra: {level.id}</h1>
            <h1>Numer piętra: {level.number}</h1>



{/* <svg id="svg1" width="1000" height="621" xmlns="http://www.w3.org/2000/svg" style={{position: 'absolute', background: "url(https://kliwo.pl/images/kliwo/poziomy/b5/2-pietro/2-pietro.jpg)", 'background-size': "cover"}}>
               
               {
                   unitsInLevel.map((u, i) => {
                       //console.log('u', u)
                       let svg = u.coords
                       //console.log('svg', svg)
                       return <g key={i} id={`levelSVG${i + 1}`} onClick={() => {redirectToUnit(u.id)}} dangerouslySetInnerHTML={{__html: svg}}>
                               
                               </g>
                    


                   })
               }
           </svg> */}


<div className="svg-container" style={{height: imaheHeight}}>
            <img id="coverImg" style={{position: 'absolute', width: '60%'}} src="http://kliwo.realizacje.grupaaf.pl/wp-content/uploads/2020/02/CZ-B4-P2.jpg" />
            <svg style={{position: 'absolute'}} id="levelSvgImg" width="60%" height={imaheHeight} xmlns="http://www.w3.org/2000/svg">
            {
              unitsInLevel.map((u, i) => {
                //console.log('u', u)
                let svg = u.coords
                //console.log('svg', svg)
                return <g id={`unitsvg${i + 1}`} onClick={() => {redirectToUnit(u.id)}} dangerouslySetInnerHTML={{__html: svg}}>
                        
                        </g>
              })
            }
            </svg>
         

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
                      return <option value={l.id}>{l.number} Piętro (DostęĻnych lokali {l.count_m.free})</option>
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




        {redirect ? <Redirect to={`/mieszkanie/${redirectId}`} /> : null}


       



      


                  {/* <Footer /> */}
        </div>
    )
}

export default Levels