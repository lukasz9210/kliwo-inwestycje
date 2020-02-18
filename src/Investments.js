import React, {useState, useEffect} from 'react'
import { Link, Redirect } from 'react-router-dom'
import parse from 'html-react-parser'
import roletyImg from './images/ico_rolety_zewnetrzne.png'
import Header from './Header.js'
import Footer from './Footer.js'
import $ from 'jquery';
import preLoaderGif from './images/preloader.gif'

const Test = ({match}) => {
    const [investment, setInvestment] = useState({})
    const [redirect, setRedirect] = useState(false)
    const [buildings, setBuildings] = useState([])
    const [redirectId, setRedirectId] = useState()
    const [imaheHeight, setImaheHeight] = useState(0)
    const [cloudShown, setCloudShown] = useState(false)
    const [dataInCloud, setDataInCloud] = useState({})
    const [loading, setLoading] = useState(true)


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
        fetchInvestment()
        fetchBuildingsInInvestment()
        setTimeout(() => {
          let ih = document.getElementById('coverImg').height
        console.log('ih', ih)
        setImaheHeight(ih)
        setLoading(false)
        console.log('imaheHeight', imaheHeight)
        }, 2000);


            //inwestycja
    //setTimeOut jest dlatego eby zdąył wrzucić dynamiczne elementy koordynatorówdo kontenera svg
 setTimeout(() => {
  //console.log('DONE')
      //svg container/image
let svgContainer = document.getElementById('svg1')  //kontener svg
const coverImg = document.getElementById('coverImg')  // zdjęcie pod svg

//cover img width and height
let coverImgWidth = coverImg.width
let coverImgHeight = coverImg.height

//actual width and height of svg container
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
  //console.log('data for parse', svgText, svgContainerWidth, svgContainerHeight)
  let newcoords = parser(svgText, [1230, 846], [svgContainerWidth, svgContainerHeight])
  //console.log('newcoords', newcoords)
  pathElem.setAttribute('d', newcoords)
  //console.log('path po', pathElem)
})
 }, 2000);
 //koniec inwestycji



    }, [])

    const fetchInvestment = () => {
        let details = {
          'id': match.params.investId
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


    const fetchBuildingsInInvestment = () => {
        let details = {
            'id': match.params.investId
          };
      
          let formBody = [];
          for (let property in details) {
            let encodedKey = encodeURIComponent(property);
            let encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
          }
      
          formBody = formBody.join("&");
          //console.log('formBody', formBody)
      
          fetch('http://kliwo.realizacje.grupaaf.pl/api/investments-show-buildings', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: formBody
          }).then(r => {
            return r.json()
          }).then(j => {
              //setInvestment(j.data.investments)
        
            const arr = Object.values(j.data.buildings)

            setBuildings(arr)
            //console.log('buildings in this investment', j)
            //console.log('buildings', buildings)
          })
    }




    const redirectToBuilding = param => {
        setRedirect(true)
        setRedirectId(param)
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

    return (
      <div>
        <Header />
        <div style={{display: loading ? 'flex' : 'none'}} className="preloader flex ai-c jc-c">
          <img src={preLoaderGif} />
        </div>
      
        <div className="investment">
            <div className="container">
              <p className="bold-title">Kliknij na wybrany budynek, aby poznać szczegóły.</p>
            </div>

            <div className="svg-container" style={{height: imaheHeight}}>
            <img id="coverImg" style={{position: 'absolute', width: '60%'}} src={investment.svg} />
            <svg style={{position: 'absolute'}} id="svg1" width="60%" height={imaheHeight} xmlns="http://www.w3.org/2000/svg">
            {
              buildings.map((b, i) => {
                //console.log('b', b)
                let svg = b.svg
                //console.log('svg', svg)
                return <g onMouseOver={() => mouseOver(b)} onMouseLeave={() => mouseLeave()}  id={`buildingsvg${i + 1}`} onClick={() => {redirectToBuilding(b.id)}} dangerouslySetInnerHTML={{__html: svg}}>
                        
                        </g>
              })
            }
            </svg>
            {redirect ? <Redirect to={`/budynek/${redirectId}`} /> : null}

            <div style={{display: cloudShown ? 'block' : 'none'}} className="svg-cloud">
              <p>{dataInCloud.name}</p>
            </div>

            <div className="investment-details">
          <img src={investment.logo} alt={investment.name} />
          <h4 className="investment-details-name">{investment.name}</h4>
          <h5 className="investment-details-address">{investment.address}</h5>
          <p className="investment-details-description">{investment.description}</p>
        </div>

            </div>

        


        <div className="container">
          <div className="investment-benefits">
              <h4 className="bold-title">Dlaczego Osiedle {investment.name}?</h4>
            <div className="investment-benefits-content flex jc-spb">
              <div className="investment-benefits-single flex">
                <img src={investment.prop_1_icon} alt={investment.prop_1_header} />
                <div className="investment-benefits-single-text">
              <h6 className="investment-benefits-single-title">{investment.prop_1_header}</h6>
              <p className="investment-benefits-single-description">{investment.prop_1_description}</p>
                </div>
              </div>
              <div className="investment-benefits-single flex">
                <img src={investment.prop_2_icon} alt={investment.prop_2_header} />
                <div className="investment-benefits-single-text">
                  <h6 className="investment-benefits-single-title">{investment.prop_2_header}</h6>
                  <p className="investment-benefits-single-description">{investment.prop_2_description}</p>
                </div>
              </div>
              <div className="investment-benefits-single flex">
                <img src={investment.prop_3_icon} alt={investment.prop_3_header} />
                <div className="investment-benefits-single-text">
                  <h6 className="investment-benefits-single-title">{investment.prop_3_header}</h6>
                  <p className="investment-benefits-single-description">{investment.prop_3_description}</p>
                </div>
              </div>
              <div className="investment-benefits-single flex">
                <img src={investment.prop_4_icon} alt={investment.prop_4_header} />
                <div className="investment-benefits-single-text">
                  <h6 className="investment-benefits-single-title">{investment.prop_4_header}</h6>
                  <p className="investment-benefits-single-description">{investment.prop_4_description}</p>
                </div>
              </div>
            </div>
          </div>


        </div>



        <div className="investment-boxes" style={{backgroundImage: 'url(https://kliwo.pl/images/kliwo/budynki/budynki-trzebnica-cz-b5.jpg)'}}>
            <div className="container flex">
              <div className="investment-box investment-box-left" >
                <div className="investment-box-content">
                  <p className="bold-title">Wysoki standard wykończenia</p>
                  <div className="investment-box-description">
                    <p>Do budowy Osiedla Czereśniowego wykorzystano starannie wyselekcjonowane materiały o najwyższej jakości. Standard wykończenia lokali mieszkalnych oraz usługowych obejmuje m.in.:</p>
                  </div>
                  <div className="investment-box-list">
                    <div className="investment-box-list-item flex ai-c">
                      <img src={roletyImg} alt="" />
                      <div className="investment-box-list-item-text">
                        <p><strong>Rolety zewnętrzne</strong> – zainstalowane na wszystkich oknach PCV znajdujących się w lokalach (z wyłączeniem okien dachowych/połaciowych)</p>
                      </div>
                    </div>
                    <div className="investment-box-list-item flex ai-c">
                      <img src={roletyImg} alt="" />
                      <div className="investment-box-list-item-text">
                        <p><strong>Rolety zewnętrzne</strong> – zainstalowane na wszystkich oknach PCV znajdujących się w lokalach (z wyłączeniem okien dachowych/połaciowych)</p>
                      </div>
                    </div>
                    <div className="investment-box-list-item flex ai-c">
                      <img src={roletyImg} alt="" />
                      <div className="investment-box-list-item-text">
                        <p><strong>Rolety zewnętrzne</strong> – zainstalowane na wszystkich oknach PCV znajdujących się w lokalach (z wyłączeniem okien dachowych/połaciowych)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="investment-box investment-box-right" >
                <div className="investment-box-content">
                  <p className="bold-title">Wysoki standard wykończenia</p>
                  <div className="investment-box-description">
                    <p>Do budowy Osiedla Czereśniowego wykorzystano starannie wyselekcjonowane materiały o najwyższej jakości. Standard wykończenia lokali mieszkalnych oraz usługowych obejmuje m.in.:</p>
                  </div>
                  <div className="investment-box-list">
                    <div className="investment-box-list-item flex ai-c">
                      <img src={roletyImg} alt="" />
                      <div className="investment-box-list-item-text">
                        <p><strong>Rolety zewnętrzne</strong> – zainstalowane na wszystkich oknach PCV znajdujących się w lokalach (z wyłączeniem okien dachowych/połaciowych)</p>
                      </div>
                    </div>
                    <div className="investment-box-list-item flex ai-c">
                      <img src={roletyImg} alt="" />
                      <div className="investment-box-list-item-text">
                        <p><strong>Rolety zewnętrzne</strong> – zainstalowane na wszystkich oknach PCV znajdujących się w lokalach (z wyłączeniem okien dachowych/połaciowych)</p>
                      </div>
                    </div>
                    <div className="investment-box-list-item flex ai-c">
                      <img src={roletyImg} alt="" />
                      <div className="investment-box-list-item-text">
                        <p><strong>Rolety zewnętrzne</strong> – zainstalowane na wszystkich oknach PCV znajdujących się w lokalach (z wyłączeniem okien dachowych/połaciowych)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>



        </div>
        <Footer />
        </div>
    )
}

export default Test





