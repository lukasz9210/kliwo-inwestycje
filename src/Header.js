import React, { useState, useEffect } from 'react'
import $ from 'jquery'
require('dotenv').config()
const url = process.env.REACT_APP_BASE_URL

const Header = () => {
	const [investments, setInvestments] = useState({})
	useEffect(() => {
		fetch('http://kliwo.realizacje.grupaaf.pl/api/investments')
			.then(response => response.json())
			.then(res => {
				setInvestments(res.data.investments)

			})
	}, [])

	useEffect(() => {
		appendListItems()
	}, [investments])

	const appendListItems = () => {
		const nodeItem = document.getElementById('menu-item-25')
		let investmentsListItems = '<ul class="sub-menu">'
		for (let investment in investments) {
			let i = investments[investment]
			console.log('i', i)
			investmentsListItems += `<li class="menu-item"><a href="http://inwestycje.kliwo.pl/inwestycja/${i.id}">${i.name}</a></li>`
		}
		investmentsListItems += '</ul>'
		$('#menu-item-25').addClass('menu-item-has-children')

		nodeItem.insertAdjacentHTML('beforeend', investmentsListItems)

		console.log('investmentsListItems', investmentsListItems)
	}

	return (
		<header className="header" id="header">
			<div className="container">
				<div class="header-top flex v-cent jc-spb">
					<div class="header-top-icons flex v-cent">
						<a class="header-logo" href="http://kliwo.realizacje.grupaaf.pl">
							<div class="img-holder">
								<img src={`http://kliwo.realizacje.grupaaf.pl/wp-content/themes/kliwo/images/ikony/logo.png`} alt="Kliwo" />
							</div>
						</a>
						<div class="img-holder h-fb">
							<img src={`http://kliwo.realizacje.grupaaf.pl/wp-content/themes/kliwo/images/ikony/ico_fb.png`} alt="Facebook" />
						</div>
					</div>
					<nav class="main-menu">
						<div class="menu-main-menu-container"><ul id="menu-main-menu" class="menu"><li id="menu-item-24" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-24"><a href="#">Solidny deweloper</a>
							<ul class="sub-menu">
								<li id="menu-item-343" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-343"><a href="http://kliwo.realizacje.grupaaf.pl/?page_id=340">O nas</a></li>
								<li id="menu-item-38" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-38"><a href="http://kliwo.realizacje.grupaaf.pl/?page_id=28">Zrealizowane inwestycje</a></li>
								<li id="menu-item-37" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-37"><a href="http://kliwo.realizacje.grupaaf.pl/?page_id=32">Najczęstsze pytania</a></li>
								<li id="menu-item-36" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-36"><a href="http://kliwo.realizacje.grupaaf.pl/?page_id=34">Aktualoności</a></li>
							</ul>
						</li>
							<li id="menu-item-25" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-25"><a href="#">Inwestycje</a></li>
							<li id="menu-item-44" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-44"><a href="http://kliwo.realizacje.grupaaf.pl/?page_id=42">Finansowanie</a></li>
							<li id="menu-item-45" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-45"><a href="http://kliwo.realizacje.grupaaf.pl/?page_id=40">Kontakt</a></li>
						</ul></div>			</nav>
					<div class="header-top-big-btns">
						<a href="">Wyszukiwarka mieszkań</a>
						<a href="">Porównywarka mieszkań</a>
					</div>



					<a id="hamburger-icon" href="#" title="Menu">
						<span class="line line-1"></span>
						<span class="line line-2"></span>
						<span class="line line-3"></span>
					</a>

				</div>
			</div>
			<nav class="main-menu-mobile">
				<div class="menu-main-menu-mobile-container"><ul id="menu-main-menu-mobile" class="menu"><li id="menu-item-73" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-73"><a href="#">Solidny deweloper</a>
					<ul class="sub-menu">
						<li id="menu-item-79" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-79"><a href="http://kliwo.realizacje.grupaaf.pl/?page_id=26">historia</a></li>
						<li id="menu-item-78" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-78"><a href="http://kliwo.realizacje.grupaaf.pl/?page_id=28">zrealizowane-inwestycje</a></li>
						<li id="menu-item-77" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-77"><a href="http://kliwo.realizacje.grupaaf.pl/?page_id=32">najczestsze-pytania</a></li>
					</ul>
				</li>
					<li id="menu-item-74" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-74"><a href="#">Inwestycje</a></li>
					<li id="menu-item-75" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-75"><a href="http://kliwo.realizacje.grupaaf.pl/?page_id=42">Finansowanie</a></li>
					<li id="menu-item-76" class="border-red menu-item menu-item-type-post_type menu-item-object-page menu-item-76"><a href="http://kliwo.realizacje.grupaaf.pl/?page_id=40">Kontakt</a></li>
					<li id="menu-item-80" class="border-red menu-item menu-item-type-custom menu-item-object-custom menu-item-80"><a href="#">Wyszukiwarka mieszkań</a></li>
					<li id="menu-item-81" class="border-red menu-item menu-item-type-custom menu-item-object-custom menu-item-81"><a href="#">Porównywarka mieszkań</a></li>
				</ul></div>			</nav>

		</header>

	)
}

export default Header