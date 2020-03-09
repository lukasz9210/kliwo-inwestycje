import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import roletyImg from './images/ico_rolety_zewnetrzne.png'
import airConditioningImg from './images/ico_klimatyzacja.png'
import heatingImg from './images/ico_ogrzewanie_podlogowe.png'
import billImg from './images/ico_rachunek_powierniczy.png'
import cleanPolicy from './images/ico_polityka_sprzedazowa.png'
import proEcoImg from './images/ico_proekologia.png'
import colektorsImg from './images/ico_kolektor_sloneczny.png'
import wallsImg from './images/ico_scianki.png'
import electrixImg from './images/ico_instalacja_elektryczna.png'
import hydraulicImg from './images/ico_instalacja_hydrauliczna.png'
import garageImg from './images/ico_garaz_podziemny.png'
import forestImg from './images/ico_las_bukowy.png'
import publicTransportImg from './images/ico_dobra_komunikacja.png'
import infrastructureImg from './images/ico_rekreacja-uslugi.png'
import sportImg from './images/ico_rekreacja-kultura-sport.png'
import shopsImg from './images/ico_biznez-uslugi.png'
import picterousImg from './images/ico_lasy.png'





import Header from './Header.js'
import Footer from './Footer.js'
import $ from 'jquery';
import preLoaderGif from './images/preloader.gif'

const Test = ({ match }) => {
  const [investment, setInvestment] = useState({})
  const [redirect, setRedirect] = useState(false)
  const [buildings, setBuildings] = useState([])
  const [redirectId, setRedirectId] = useState()
  const [imaheHeight, setImaheHeight] = useState(0)
  const [cloudShown, setCloudShown] = useState(false)
  const [dataInCloud, setDataInCloud] = useState({})
  const [loading, setLoading] = useState(true)


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
    fetchInvestment()
    fetchBuildingsInInvestment()
    setTimeout(() => {
      let ih = document.getElementById('coverImg').height
      console.log('ih', ih)
      setImaheHeight(ih)
      setLoading(false)
      console.log('imaheHeight', imaheHeight)
    }, 3000);


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
    }, 3000);
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
      <div style={{ display: loading ? 'flex' : 'none' }} className="preloader flex ai-c jc-c">
        <img src={preLoaderGif} />
      </div>

      <div className="investment">
        <div className="container">
          <p className="bold-title">Kliknij na wybrany budynek, aby poznać szczegóły.</p>
        </div>

        <div className="svg-container" style={{ height: imaheHeight }}>
          <img id="coverImg" style={{ position: 'absolute', width: '60%' }} src={investment.svg} />
          <svg style={{ position: 'absolute' }} id="svg1" width="60%" height={imaheHeight} xmlns="http://www.w3.org/2000/svg">
            {
              buildings.map((b, i) => {
                //console.log('b', b)
                let svg = b.svg
                //console.log('svg', svg)
                return <g onMouseOver={() => mouseOver(b)} onMouseLeave={() => mouseLeave()} id={`buildingsvg${i + 1}`} onClick={() => { redirectToBuilding(b.id) }} dangerouslySetInnerHTML={{ __html: svg }}>

                </g>
              })
            }
          </svg>
          {redirect ? <Redirect push to={`/budynek/${redirectId}`} /> : null}

          <div style={{ display: cloudShown ? 'block' : 'none' }} className="svg-cloud">
            <p>{dataInCloud.name}</p>
          </div>

          <div className="investment-details">
            <img src={investment.logo} alt={investment.name} />
            <h4 className="investment-details-name">{investment.name}</h4>
            <h5 className="investment-details-address">{investment.address}</h5>
            <p className="investment-details-description">{investment.description}</p>
            <a className="btn learn-more-btn" href="#investment-boxes">Dowiedz się więcej</a>
          </div>

        </div>




        <div className="container">

        <div className="investment-details investment-details-mobile">
            <img src={investment.logo} alt={investment.name} />
            <h4 className="investment-details-name">{investment.name}</h4>
            <h5 className="investment-details-address">{investment.address}</h5>
            <p className="investment-details-description">{investment.description}</p>
            <a className="btn learn-more-btn" href="#investment-boxes">Dowiedz się więcej</a>
          </div>



          <div className="investment-benefits">
            <h4 className="bold-title">Dlaczego Osiedle {investment.name}?</h4>
            <div className="investment-benefits-content flex jc-spb">
              <div className="investment-benefits-single flex ai-c">
                <img src={investment.prop_1_icon} alt={investment.prop_1_header} />
                <div className="investment-benefits-single-text">
                  <h6 className="investment-benefits-single-title">{investment.prop_1_header}</h6>
                  <p className="investment-benefits-single-description">{investment.prop_1_description}</p>
                </div>
              </div>
              <div className="investment-benefits-single flex ai-c">
                <img src={investment.prop_2_icon} alt={investment.prop_2_header} />
                <div className="investment-benefits-single-text">
                  <h6 className="investment-benefits-single-title">{investment.prop_2_header}</h6>
                  <p className="investment-benefits-single-description">{investment.prop_2_description}</p>
                </div>
              </div>
              <div className="investment-benefits-single flex ai-c">
                <img src={investment.prop_3_icon} alt={investment.prop_3_header} />
                <div className="investment-benefits-single-text">
                  <h6 className="investment-benefits-single-title">{investment.prop_3_header}</h6>
                  <p className="investment-benefits-single-description">{investment.prop_3_description}</p>
                </div>
              </div>
              <div className="investment-benefits-single flex ai-c">
                <img src={investment.prop_4_icon} alt={investment.prop_4_header} />
                <div className="investment-benefits-single-text">
                  <h6 className="investment-benefits-single-title">{investment.prop_4_header}</h6>
                  <p className="investment-benefits-single-description">{investment.prop_4_description}</p>
                </div>
              </div>
            </div>
          </div>


        </div>



        <div id="investment-boxes" className="investment-boxes" style={{ backgroundImage: 'url(https://kliwo.pl/images/kliwo/budynki/budynki-trzebnica-cz-b5.jpg)' }}>
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
                    <img src={airConditioningImg} alt="" />
                    <div className="investment-box-list-item-text">
                      <p><strong>klimatyzację</strong> – jedna jednostka wewnętrzna i jedna jednostka zewnętrzna przypadająca na każdy lokal</p>
                    </div>
                  </div>
                  <div className="investment-box-list-item flex ai-c">
                    <img src={heatingImg} alt="" />
                    <div className="investment-box-list-item-text">
                      <p><strong>ogrzewanie podłogowe</strong> – standardowo zlokalizowane w korytarzu oraz łazience wraz z doprowadzeniem pod aneks kuchenny</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="investment-box investment-box-right" >
              <div className="investment-box-content">
                <p className="bold-title">Bezpieczeństwo inwestycyjne</p>
                <div className="investment-box-description">
                  <p>Całe przedsięwzięcie deweloperskie jest objęte specjalnym rachunkiem powierniczym, co zapewnia bezpieczeństwo inwestycyjne, szczególnie ważne dla nabywców lokali. Rozwiązanie to zabezpiecza i wprowadza pełną ochronę praw związanych z zakupem nieruchomości. Dodatkowym gwarantem bezpieczeństwa jest jasna i przejrzysta polityka sprzedażowa oraz dobra kondycja finansowa firmy, a także bezpieczne sposoby finansowania inwestycji deweloperskich.</p>
                </div>
                <div className="investment-box-list">
                  <div className="investment-box-list-item flex ai-c">
                    <img src={billImg} alt="" />
                    <div className="investment-box-list-item-text">
                      <p><strong>rachunek powierniczy</strong> – gwarancja bezpiecznego zakupu nieruchomości</p>
                    </div>
                  </div>
                  <div className="investment-box-list-item flex ai-c">
                    <img src={cleanPolicy} alt="" />
                    <div className="investment-box-list-item-text">
                      <p><strong>PRZEJRZYSTA POLITYKA SPRZEDAŻOWA</strong> - gwarancja jasnych warunków sprzedaży nieruchomości</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>


          


            
          </div>
        </div>




        <div className="investment-boxes" style={{ backgroundImage: 'url(https://kliwo.pl/images/kliwo/budynki/budynki-trzebnica-cz-b5.jpg)' }}>
          <div className="container flex">
            

        


            <div className="investment-box investment-box-left" >
              <div className="investment-box-content">
                <p className="bold-title">Ekologiczne rozwiązania</p>
                <div className="investment-box-description">
                  <p>Mając na względzie energooszczędne i proekologiczne rozwiązania, wyposażamy wszystkie budynki wchodzące w skład Osiedla Czereśniowego w system kolektorów słonecznych, które będą wspomagać podgrzewanie wody użytkowej. Korzystając z naszej oferty mieszkaniowej, zyskujesz podwójnie – możesz obniżyć koszty utrzymania mieszkania i żyć w zgodzie z otaczającym nas ekosystemem.</p>
                </div>
                <div className="investment-box-list">
                  <div className="investment-box-list-item flex ai-c">
                    <img src={proEcoImg} alt="" />
                    <div className="investment-box-list-item-text">
                      <p><strong>PROEKOLOGICZNE OSIEDLE</strong> - niższe koszty utrzymania mieszkania</p>
                    </div>
                  </div>
                  <div className="investment-box-list-item flex ai-c">
                    <img src={colektorsImg} alt="" />
                    <div className="investment-box-list-item-text">
                      <p><strong>kolektory słoneczne</strong> – wspomagają podgrzewanie wody użytkowej</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            <div className="investment-box investment-box-right" >
              <div className="investment-box-content">
                <p className="bold-title">Zadecyduj o przestrzeni, w której zamieszkasz!</p>
                <div className="investment-box-description">
                  <p>Rozumiemy, jak ważne jest zagospodarowanie mieszkania do własnych potrzeb, dlatego dajemy Ci możliwość przedstawienia własnych propozycji rozkładu ścianek działowych, zasięgu ogrzewania podłogowego oraz rozmieszczenia instalacji elektrycznej i hydraulicznej. Projekty można przedstawiać do momentu rozpoczęcia prac budowlanych związanych z implementacją danej instalacji lub technologii. Takie rozwiązanie gwarantuje optymalne wykorzystanie powierzchni użytkowej oraz komfort aranżacji. O szczegóły zapytaj naszego konsultanta.</p>
                </div>
                <div className="investment-box-list investment-box-list-cols">
                  <div className="investment-box-list-item w-50 flex ai-c">
                    <img src={wallsImg} alt="" />
                    <div className="investment-box-list-item-text">
                      <p>możliwość wyboru układu ścianek działowych</p>
                    </div>
                  </div>
                  <div className="investment-box-list-item w-50 flex ai-c">
                    <img src={electrixImg} alt="" />
                    <div className="investment-box-list-item-text">
                      <p>możliwość wyboru rozmieszczenia instalacji elektrycznej</p>
                    </div>
                  </div>
                  <div className="investment-box-list-item w-50 flex ai-c">
                    <img src={hydraulicImg} alt="" />
                    <div className="investment-box-list-item-text">
                      <p>możliwość wyboru rozmieszczenia instalacji hydraulicznej</p>
                    </div>
                  </div>
                  <div className="investment-box-list-item w-50 flex ai-c">
                    <img src={heatingImg} alt="" />
                    <div className="investment-box-list-item-text">
                      <p>możliwość rozszerzenia powierzchni instalacji ogrzewania podłogowego</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>





        <div className="investment-boxes" style={{ backgroundImage: 'url(https://kliwo.pl/images/kliwo/budynki/budynki-trzebnica-cz-b5.jpg)' }}>
          <div className="container flex">
            
            <div className="investment-box investment-box-left" >
              <div className="investment-box-content">
                <p className="bold-title">Miejsca postojowe w garażu podziemnym</p>
                <div className="investment-box-description">
                  <p>Każdy z budynków wchodzących w skład Osiedla Czereśniowego będzie posiadać kondygnację podziemną w postaci wielostanowiskowego garażu z miejscami postojowymi. Dla nabywców lokali mieszkalnych oraz lokali usługowych udostępniamy możliwość zakupu miejsca postojowego w garażu podziemnym. Dla wielostanowiskowych garaży podziemnych zostaną wyodrębnione osobne Księgi Wieczyste (inne niż w przypadku lokali mieszkalnych oraz usługowych), co dodatkowo uatrakcyjnia ofertę ich zakupu.</p>
                </div>
                <div className="investment-box-list">
                  <div className="investment-box-list-item flex ai-c">
                    <img src={garageImg} alt="" />
                    <div className="investment-box-list-item-text">
                      <p><strong>garaż podziemny</strong> – własne stanowisko postojowe to brak konieczności szukania wolnego miejsca parkingowego i ochrona przed złymi warunkami atmosferycznymi</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            <div className="investment-box investment-box-right" >
              <div className="investment-box-content">
                <p className="bold-title">Dogodna lokalizacja</p>
                <div className="investment-box-description">
                  <p>Osiedle Czereśniowe to inwestycja realizowana w pobliżu przepięknego Lasu Bukowego. Mieszkańcy będą mogli korzystać z wszelkich wygód życia w mieście, a jednocześnie cieszyć się spokojem i bliskością natury. Wciąż rozwijająca się infrastruktura oraz przemyślana lokalizacja z dostępem do pobliskich punktów usługowych, obiektów sportowych oraz budynków o przeznaczeniu społeczno-kulturalnym, jak również możliwość szybkiego dojazdu do centrum miasta pozwoliły na stworzenie miejsca przyjaznego rodzinom, gwarantującego komfort codziennego życia.</p>
                </div>
                <div className="investment-box-list investment-box-list-cols">
                  <div className="investment-box-list-item w-50 flex ai-c">
                    <img src={forestImg} alt="" />
                    <div className="investment-box-list-item-text">
                      <p>sąsiedztwo Lasu Bukowego</p>
                    </div>
                  </div>
                  <div className="investment-box-list-item w-50 flex ai-c">
                    <img src={publicTransportImg} alt="" />
                    <div className="investment-box-list-item-text">
                      <p>dobra komunikacja z centrum miasta</p>
                    </div>
                  </div>
                  <div className="investment-box-list-item w-50 flex ai-c">
                    <img src={infrastructureImg} alt="" />
                    <div className="investment-box-list-item-text">
                      <p>rozwinięta infrastruktura i baza rekreacyjno-usługowa</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>






        <div className="investment-boxes" style={{ backgroundImage: 'url(https://kliwo.pl/images/kliwo/budynki/budynki-trzebnica-cz-b5.jpg)' }}>
          <div className="container flex">



            <div className="investment-box investment-box-left" >
              <div className="investment-box-content">
                <p className="bold-title">Zamieszkaj w Trzebnicy!</p>
                <div className="investment-box-description">
                  <p>Trzebnica to prężnie rozwijające się miasto, usytuowane we wschodniej części Wzgórz Trzebnickich, oddalone o około 25 km od centrum Wrocławia. Rozwinięta komunikacja autobusowa, droga ekspresowa S5 oraz linia kolejowa łącząca Trzebnicę z Wrocławiem stwarzają możliwości szybkiego i wygodnego przemieszczania się. W mieście znajduje się wiele punktów biznesowo-usługowych, obiektów sportowo-rekreacyjnych oraz społeczno-kulturalnych. Trzebnica jest idealnym wyborem dla osób ceniących aktywny i prozdrowotny tryb życia, a także lubiących spokojny wypoczynek w sąsiedztwie urokliwych lasów i wzgórz.</p>
                </div>
                <div className="investment-box-list investment-box-list-cols">
                  <div className="investment-box-list-item w-50 flex ai-c">
                    <img src={publicTransportImg} alt="" />
                    <div className="investment-box-list-item-text">
                      <p>dobry dojazd do centrum Wrocławia</p>
                    </div>
                  </div>
                  <div className="investment-box-list-item w-50 flex ai-c">
                    <img src={sportImg} alt="" />
                    <div className="investment-box-list-item-text">
                      <p>bogate zaplecze rekreacyjne oraz społeczno-kulturalne</p>
                    </div>
                  </div>
                  <div className="investment-box-list-item w-50 flex ai-c">
                    <img src={shopsImg} alt="" />
                    <div className="investment-box-list-item-text">
                      <p>mnogość punktów biznesowo-usługowych</p>
                    </div>
                  </div>
                  <div className="investment-box-list-item w-50 flex ai-c">
                    <img src={picterousImg} alt="" />
                    <div className="investment-box-list-item-text">
                      <p>malownicze położenie pośród lasów i wzgórz</p>
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





