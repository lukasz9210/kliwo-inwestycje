import React, { useState, useEffect } from 'react'
import {Redirect} from 'react-router-dom'
import Header from './Header.js'
import Footer from './Footer.js'
import $ from 'jquery';

const Buildings = ({match}) => {
    const [building, setBuilding] = useState({})
    const [levelsInBuilding, setLevelsInBuilding] = useState([])
    const [redirect, setRedirect] = useState(false)
    const [redirectId, setRedirectId] = useState()
    const [investmentId, setInvestmentId] = useState(0)
    const [investment, setInvestment] = useState({})
    const [imaheHeight, setImaheHeight] = useState(0)
    const [dataInCloud, setDataInCloud] = useState({count_m: {free: 0}, count_l: {free: 0}})
    const [cloudShown, setCloudShown] = useState(false)


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
        fetchBuilding()
        fetchLevelsInBuilding()

        setTimeout(() => {
          let ih = document.getElementById('coverImg').height
        //console.log('ih', ih)
        setImaheHeight(ih)
        //console.log('imaheHeight', imaheHeight)
        }, 1000);


            //budynek
    //setTimeOut jest dlatego eby zdąył wrzucić dynamiczne elementy koordynatorówdo kontenera svg
    setTimeout(() => {
      //console.log('DONE')
          //svg container/image
    let svgContainer = document.getElementById('buildingSvgImg')  //kontener svg
    const coverImg = document.getElementById('coverImg')  // zdjęcie pod svg
    
    //cover img width and height
    
    
    //actual width and height of svg container
    //console.log('WIDTH SVGCONT', svgContainer)
    let svgContainerWidth = Math.round(svgContainer.width.baseVal.value / 0.6)
    let svgContainerHeight = svgContainer.height.baseVal.value
    //console.log('svgContainerWidth', svgContainerWidth)
    //console.log('svgContainerHeight', svgContainerHeight)
    
    let gElems = svgContainer.querySelectorAll('g')
    //console.log('gElems', gElems)
    
    gElems.forEach((g, i) => {
      let pathElem = g.querySelector('path')
      //console.log('path przed', pathElem)
      let svgText = pathElem.outerHTML
      //console.log('SVG TEXT', svgText)
      ///console.log('data for parse', svgText, svgContainerWidth, svgContainerHeight)
      let newcoords = parser(svgText, [1405, 967], [svgContainerWidth, svgContainerHeight])
      //console.log('newcoords', newcoords)
      pathElem.setAttribute('d', newcoords)
      //console.log('path po', pathElem)
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
    
     }, 2000);
     //koniec budynku


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


    const mouseOver = data => {
      console.log('cloud SHOWN', data.count_m.sold)
      setDataInCloud(data)
      setCloudShown(true)
    }

    const mouseLeave = data => {
      console.log('cloud NOT SHOWN')
      setCloudShown(false)
    }


    return (
        <div className="building">
            <Header />
            <p className="bold-title">Najedź kursorem na piętro, aby sprawdzić liczbę wolnych lokali.<br />Kliknij, aby zobaczyć rzut pietra.</p>



{/* <svg id="svg1" width="1000" height="621" xmlns="http://www.w3.org/2000/svg" style={{position: 'absolute', background: "url(https://kliwo.pl/images/kliwo/budynki/budynki-trzebnica-cz-b5.jpg)", 'background-size': "cover"}}>
               
               {
                   levelsInBuilding.map((l, i) => {
                       console.log('l', l)
                       let svg = l.coords
                       console.log('svg', svg)
                       return <g id={`levelSVG${i + 1}`} onClick={() => {redirectToLevel(l.id)}} dangerouslySetInnerHTML={{__html: svg}}>
                               
                               </g>
                    


                   })
               }
           </svg> */}


<div className="svg-container" style={{height: imaheHeight}}>
            <img id="coverImg" style={{position: 'absolute', width: '60%'}} src="http://kliwo.realizacje.grupaaf.pl/wp-content/themes/kliwo/images/photos/B4.jpg" />
            <svg style={{position: 'absolute'}} id="buildingSvgImg" width="60%" height={imaheHeight} xmlns="http://www.w3.org/2000/svg">
            {
              levelsInBuilding.map((l, i) => {
                //console.log('l', l)
                let svg = l.coords
                //console.log('svg', svg)
                return <g onMouseOver={() => mouseOver(l)} onMouseLeave={() => mouseLeave()} id={`levelsvg${i + 1}`} onClick={() => {redirectToLevel(l.id)}} dangerouslySetInnerHTML={{__html: svg}}>
                        
                        </g>
              })
            }
            </svg>
            {redirect ? <Redirect to={`/budynek/${redirectId}`} /> : null}

            <div style={{display: cloudShown ? 'block' : 'none'}} className="svg-cloud">
              <p className="svg-cloud-title">Piętro: {dataInCloud.number}</p>
              <div className="svg-cloud-boxes flex">
                <div className="svg-cloud-box w-50">
                  <span>Dostępne mieszkania</span>
                  <span>{dataInCloud.count_m.free}</span>
                </div>
                <div className="svg-cloud-box w-50">
                  <span>Dostępne lokale uytkowe</span>
                  <span>{dataInCloud.count_l.free}</span>
                </div>
              </div>
            </div>

            <div className="container">
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
            </div>



            </div>




        {redirect ? <Redirect to={`/pietro/${redirectId}`} /> : null}


        <div className="container" >

       


        <div className="building-atricle flex ai-c">
          <div className="building-atricle-text" dangerouslySetInnerHTML={{__html: building.description}}></div>
          <img src={building.desc_img} alt={building.name} />
        </div>


        </div>
               <Footer />
        </div>
    )
}

export default Buildings