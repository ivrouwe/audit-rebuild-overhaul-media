(function () {
	var majorNavigation = document.querySelector('nav.major-navigation'),
		majorNavigationList = majorNavigation.querySelector('ul'),
		majorNavigationSubMenus = majorNavigationList.querySelectorAll('li > a + ul'),
		svgValidSpriteDefs = document.querySelector('body > svg[xmlns="http://www.w3.org/2000/svg"][xmlns\\:xlink="http://www.w3.org/1999/xlink"][style^="display: none"]:first-child > defs'),
		svgInvalidSpriteDefsChildren = document.querySelectorAll('body > svg:not([xmlns="http://www.w3.org/2000/svg"]) > defs > *, body > svg:not([xmlns\\:xlink="http://www.w3.org/1999/xlink"]) > defs > *, body > svg:not([style^="display: none"]) > defs > *, body > svg:not(:first-child) > defs > *'),
		emptySVGs = document.querySelectorAll('body > svg:empty'),
		svgSymbols,
		index;

		// Define constructors
		function MajorNavigationToggleButton(name, targetElementLabel, targetElementScope) {
			this.name = name || 'Major Navigation';
			this.targetElementLabel = targetElementLabel || 'Menu';
			this.targetElementScope = targetElementScope || 'allSiblings';
			this.create = function() {
				var button = document.createElement('button'),
					svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
					svgChildElements = [
						new SVGPath(
							'M0 0h26v6H0z',
							'-webkit-transform-origin: 100% 50% 0; -ms-transform-origin: 100% 50% 0; transform-origin: 100% 50% 0; -webkit-transition: -webkit-transform 0.2s ease-in-out; transition: -webkit-transform 0.2s ease-in-out; -o-transition: transform 0.2s ease-in-out; transition: transform 0.2s ease-in-out; transition: transform 0.2s ease-in-out, -webkit-transform 0.2s ease-in-out;'
						).create(),
						new SVGPath(
							'M0 10h23v6H0z',
							'opacity: 1; -webkit-transition: opacity 0.2s ease-in-out; -o-transition: opacity 0.2s ease-in-out; transition: opacity 0.2s ease-in-out;'
						).create(),
						new SVGPath(
							'M0 20h20v6H0z',
							'-webkit-transform-origin: 100% 50% 0; -ms-transform-origin: 100% 50% 0; transform-origin: 100% 50% 0; -webkit-transition: -webkit-transform 0.2s ease-in-out; transition: -webkit-transform 0.2s ease-in-out; -o-transition: transform 0.2s ease-in-out; transition: transform 0.2s ease-in-out; transition: transform 0.2s ease-in-out, -webkit-transform 0.2s ease-in-out;'
						).create()
					],
					span = document.createElement('span'),
					index;

				// Add attributes to the <button>
				button.setAttribute('type', 'button');
				button.setAttribute('aria-expanded', 'false');
				button.setAttribute('aria-label', this.name + ', ' + this.targetElementLabel + ' button, collapsed');
				button.dataset.targetElementLabel = this.targetElementLabel;

				// Add attributes to the <svg>
				svg.id = "icon-major-navigation";
				svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
				svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
				svg.setAttribute('viewBox', '0 0 26 26');
				svg.setAttribute('width', '16');
				svg.setAttribute('height', '16');
				svg.setAttribute('aria-hidden', 'true');

				for(index = 0; index < svgChildElements.length; index++) {
					// Add attributes to the <path> elements
					svgChildElements[index].dataset.initialStyle = svgChildElements[index].getAttribute('style');
					svg.appendChild(svgChildElements[index]);
				}

				span.appendChild(document.createTextNode(' ' + this.targetElementLabel));

				button.appendChild(svg);
				button.appendChild(span); 

				button.addEventListener('click', function(evt) {
					toggleMajorNavigation(evt, this.targetElementScope);
				});
	 
				return button;
			};
		}

		function SVGPath(d, style) {
			this.d = d;
			this.style = style || undefined;
			this.create = function () {
				var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

				path.setAttribute('d', this.d);

				if (this.style) {
					path.setAttribute('style', this.style);
				}

				return path;
			};
		}

		function SVGSprite() {
			this.create = function() {
				var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
					defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

				svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
				svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
				svg.style.display = 'none';
				svg.appendChild(defs);

				return svg;
			};
		}

		function SVGSymbol(id, viewBox, childElements) {
			this.id = id;
			this.viewBox = viewBox;
			this.childElements = childElements;
			this.create = function () {
				var symbol = document.createElementNS('http://www.w3.org/2000/svg', 'symbol'),
					index;

				symbol.id = this.id;
				symbol.setAttribute('viewBox', this.viewBox);

				for(index = 0; index < this.childElements.length; index++) {
					symbol.appendChild(this.childElements[index]);					
				}

				return symbol;
			};
		}

		function SVGWithUse(id, altStateId, width, height, altStateWidth, altStateHeight) {
			this.id = id;
			this.altStateId = altStateId;
			this.width = width;
			this.height = height;
			this.altStateWidth = altStateWidth;
			this.altStateHeight = altStateHeight;
			this.create = function () {
				var initialSymbol = document.querySelector('body > svg > defs > symbol' + '#' + this.id),
					initialViewBox = initialSymbol.getAttribute('viewBox'),
					altSymbol = document.querySelector('body > svg > defs > symbol' + '#' + this.altStateId),
					altViewBox = altSymbol.getAttribute('viewBox'),
					altHref = '#' + altSymbol.id,
					svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
					use = document.createElementNS('http://www.w3.org/2000/svg', 'use'),
					initialHref = '#' + initialSymbol.id;

				if (!this.width) {
					this.width = initialViewBox.split(' ')[2];
				}

				if (!this.height) {
					this.height = initialViewBox.split(' ')[3];
				}

				if (!this.altStateWidth) {
					this.altStateWidth = altViewBox.split(' ')[2];
				}

				if (!this.altStateHeight) {
					this.altStateHeight = altViewBox.split(' ')[3];
				}

				use.setAttribute('href', initialHref);
				use.setAttribute('xlink:href', initialHref);

				svg.setAttribute('viewBox', initialViewBox);
				svg.setAttribute('width', this.width);
				svg.setAttribute('height', this.height);
				svg.setAttribute('aria-hidden', 'true');
				svg.dataset.initialViewBox = initialViewBox;
				svg.dataset.initialWidth = this.width;
				svg.dataset.initialHeight = this.height;
				svg.dataset.altViewBox = altViewBox;
				svg.dataset.altWidth = this.altStateWidth;
				svg.dataset.altHeight = this.altStateHeight;
				svg.dataset.initialHref = initialHref;
				svg.dataset.altHref = altHref;
				svg.appendChild(use);

				return svg;
			};
		}

		function ToggleButton(name, targetElementLabel, targetElementScope, collapsedIcon, expandedIcon, collapsedIconWidth, collapsedIconHeight) {
			this.collapsedIcon = collapsedIcon;
			this.expandedIcon = expandedIcon;
			this.name = name;
			this.targetElementLabel = targetElementLabel;
			this.targetElementScope = targetElementScope;
			this.create = function() {
				var button = document.createElement('button');

				button.appendChild(new SVGWithUse(this.collapsedIcon, this.expandedIcon).create());
				button.setAttribute('aria-expanded', 'false');
				button.setAttribute('aria-label', this.name + ', ' + this.targetElementLabel + ' button, collapsed');
				button.addEventListener('click', function(evt) {
					toggleAdjacentContent(evt, this.targetElementScope);
				});
				return button;
			};
		}

		// Define functions
		function adjustForViewport() {
			var majorNavigationToggleButton = document.querySelector('nav.major-navigation > button[type="button"][aria-expanded][aria-label]');

			// If the user has a small viewport, modify the Major Navigation
			if (window.innerWidth <= 992) {
				if (!majorNavigationToggleButton) {
					// Append the <button> to the Major Navigation
					majorNavigationList.insertAdjacentElement('beforebegin', new MajorNavigationToggleButton(majorNavigationList.previousElementSibling.textContent, 'Menu', 'allSiblings').create());
				}

				// Hide the adjacent content
				majorNavigationList.hidden = true;			
			} else if (window.innerWidth > 992) {
				if (majorNavigationToggleButton) {
					majorNavigationToggleButton.remove();
				}

				majorNavigationList.hidden = false;
			}
		}

		function toggleAdjacentContent(evt, scope, forceState) {
			var button = evt.currentTarget,
				ariaLabel = button.getAttribute('aria-label').split(','),
				svg = button.querySelector('svg'),
				use = svg.querySelector('use'),
				toggledContent,
				next,
				index;

			if (scope === 'nextSibling') {
				toggledContent = button.nextElementSibling;
			} else if (scope === 'allSiblings' || scope === undefined) {
				toggledContent = [];
				next = button.nextElementSibling;

				while(next !== null) {
					toggledContent.push(next);
					next = next.nextElementSibling;
				}
			} else {
				return;
			}

			if (button.getAttribute('aria-expanded') === 'false' || forceState === 'expand') {
				if (scope === 'nextSibling') {
					toggledContent.hidden = false;
				} else {
					for(index = 0; index < toggledContent.length; index++) {
						toggledContent[index].hidden = false;
					}
				}

				ariaLabel[2] = ' expanded';
				ariaLabel = ariaLabel.concat();
				button.setAttribute('aria-expanded', 'true');
				button.setAttribute('aria-label', ariaLabel);
				svg.setAttribute('viewBox', svg.dataset.altViewBox);
				svg.setAttribute('width', svg.dataset.altWidth);
				svg.setAttribute('height', svg.dataset.altHeight);
				use.setAttribute('href', svg.dataset.altHref);
				use.setAttribute('xlink:href', svg.dataset.altHref);
			} else if (button.getAttribute('aria-expanded') === 'true' || forceState === 'collapse') {
				if (scope === 'nextSibling') {
					toggledContent.hidden = true;
				} else {
					for(index = 0; index < toggledContent.length; index++) {
						toggledContent[index].hidden = true;
					}
				}

				ariaLabel[2] = ' collapsed';
				ariaLabel = ariaLabel.concat();
				button.setAttribute('aria-expanded', 'false');
				button.setAttribute('aria-label', ariaLabel);
				svg.setAttribute('viewBox', svg.dataset.initialViewBox);
				svg.setAttribute('width', svg.dataset.initialWidth);
				svg.setAttribute('height', svg.dataset.initialHeight);
				use.setAttribute('href', svg.dataset.initialHref);
				use.setAttribute('xlink:href', svg.dataset.initialHref);
			}
		}

		function toggleMajorNavigation(evt, scope, forceState) {
			var button = evt.currentTarget,
				svg = button.querySelector('svg'),
				path1 = svg.querySelector('path:first-of-type'),
				path2 = svg.querySelector('path:nth-of-type(2)'),
				path3 = svg.querySelector('path:nth-of-type(3)'),
				path1Style = path1.dataset.initialStyle,
				path2Style = path2.dataset.initialStyle,
				path3Style = path3.dataset.initialStyle,
				span = button.querySelector('span'),
				ariaLabel = button.getAttribute('aria-label').split(','),
				toggledContent,
				anchors,
				next,
				index;

			if (scope === 'nextSibling') {
				toggledContent = button.nextElementSibling;
			} else if (scope === 'allSiblings' || scope === undefined) {
				toggledContent = [];
				next = button.nextElementSibling;

				while(next !== null) {
					toggledContent.push(next);
					next = next.nextElementSibling;
				}
			} else {
				return;
			}


			if (button.getAttribute('aria-expanded') === 'false' || forceState === 'expand') {
				if (scope === 'nextSibling') {
					toggledContent.hidden = false;
					anchors = toggledContent.querySelectorAll('a');

					for(index = 0; index < anchors.length; index++) {
						anchors[index].removeAttribute('aria-hidden');
					}
				} else {
					for(index = 0; index < toggledContent.length; index++) {
						anchors = toggledContent[index].querySelectorAll('a');
						toggledContent[index].hidden = false;

						for(index = 0; index < anchors.length; index++) {
							anchors[index].removeAttribute('aria-hidden');
						}
					}
				}

				// Transform the hamburger icon into an x and change the button's visible text
				path1.setAttribute('style', '-webkit-transform-origin: 100% 50% 0; -ms-transform-origin: 100% 50% 0; transform-origin: 100% 50% 0; -webkit-transition: -webkit-transform 0.2s ease-in-out; transition: -webkit-transform 0.2s ease-in-out; -o-transition: transform 0.2s ease-in-out; transition: transform 0.2s ease-in-out; transition: transform 0.2s ease-in-out, -webkit-transform 0.2s ease-in-out; -webkit-transform: rotate(-45deg) scale(1.154, 1) translate(17%, 3%); -ms-transform: rotate(-45deg) scale(1.154, 1) translate(17%, 3%); transform: rotate(-45deg) scale(1.154, 1) translate(17%, 3%);');
				path2.setAttribute('style', 'opacity: 0; -webkit-transition: opacity 0.2s ease-in-out; -o-transition: opacity 0.2s ease-in-out; transition: opacity 0.2s ease-in-out;');
				path3.setAttribute('style', '-webkit-transform-origin: 100% 50% 0; -ms-transform-origin: 100% 50% 0; transform-origin: 100% 50% 0; -webkit-transform: rotate(45deg) scale(1.5, 1) translateX(38%); -ms-transform: rotate(45deg) scale(1.5, 1) translateX(38%); transform: rotate(45deg) scale(1.5, 1) translateX(38%); -webkit-transition: -webkit-transform 0.2s ease-in-out; transition: -webkit-transform 0.2s ease-in-out; -o-transition: transform 0.2s ease-in-out; transition: transform 0.2s ease-in-out; transition: transform 0.2s ease-in-out, -webkit-transform 0.2s ease-in-out;');
				span.replaceChild(document.createTextNode(' Close'), span.childNodes[0]);

				ariaLabel[2] = ' expanded';
				ariaLabel = ariaLabel.concat();
				button.setAttribute('aria-expanded', 'true');
				button.setAttribute('aria-label', ariaLabel);
			} else if (button.getAttribute('aria-expanded') === 'true' || forceState === 'collapse') {
				if (scope === 'nextSibling') {
					toggledContent.hidden = true;

					anchors = toggledContent.querySelectorAll('a');

					for(index = 0; index < anchors.length; index++) {
						anchors[index].setAttribute('aria-hidden', 'true');
					}
				} else {
					for(index = 0; index < toggledContent.length; index++) {
						anchors = toggledContent[index].querySelectorAll('a');
						toggledContent[index].hidden = true;

						for(index = 0; index < anchors.length; index++) {
							anchors[index].setAttribute('aria-hidden', 'true');
						}
					}
				}

				// Transform the x back into a hamburger icon and change the button's visible text again
				path1.setAttribute('style', path1Style);
				path2.setAttribute('style', path2Style);
				path3.setAttribute('style', path3Style);
				span.replaceChild(document.createTextNode(' ' + button.dataset.targetElementLabel), span.childNodes[0]);

				ariaLabel[2] = ' collapsed';
				ariaLabel = ariaLabel.concat();
				button.setAttribute('aria-expanded', 'false');
				button.setAttribute('aria-label', ariaLabel);
			}
		}
 
		// Check for a valid SVG sprite element
 
		// If there is no SVG sprite element in the body, create one
		if (!svgValidSpriteDefs) {
			document.body.prepend(new SVGSprite().create());
		}

		if (svgInvalidSpriteDefsChildren) {
			for(index = 0; index < svgInvalidSpriteDefsChildren.length; index++) {
				document.querySelector('body > svg');
			}
		}

		if (emptySVGs) {
			for(index = 0; index < document.querySelectorAll('body > svg:empty').length; index++) {
				document.body.removeChild(document.querySelectorAll('body > svg:empty')[index]);
			}
		}

		// Define <symbol>s to add to the SVG sprite
		svgSymbols = [
			new SVGSymbol(
				'icon-collapsed',
				'0 0 16 16',
				[new SVGPath('M9.57 3h.03l.01.01h.01l.01.01h.02v.01h.01v.01h.01l.01.01.01.01v.01h.01v.01l.01.01v.01l.01.01v.03l.01.01V6.5H13.1l.01.01h.01l.01.01h.02v.01h.01v.01h.01l.01.01.01.01v.01h.01v.01l.01.01v.01l.01.01v.03l.01.01V9.35l-.01.01v.03l-.01.01v.01l-.01.01v.01h-.01v.01l-.01.01-.01.01h-.01v.01h-.01v.01h-.02l-.01.01h-.01l-.01.01H9.73V12.85l-.01.01v.03l-.01.01v.01l-.01.01v.01h-.01v.01l-.01.01-.01.01h-.01v.01h-.01v.01h-.02l-.01.01h-.01L9.6 13H6.85v-.01h-.02l-.01-.01h-.01l-.01-.01h-.01v-.01h-.01v-.01h-.01v-.01h-.01v-.01h-.01v-.01l-.01-.01v-.02h-.01V9.5H3.35v-.01h-.02l-.01-.01h-.01l-.01-.01h-.01v-.01h-.01v-.01h-.01v-.01h-.01v-.01h-.01v-.01l-.01-.01v-.02h-.01V6.61h.01v-.02l.01-.01v-.01h.01v-.01h.01v-.01h.01v-.01h.01v-.01h.01l.01-.01h.01l.01-.01h.02V6.5h3.38V3.11h.01v-.02l.01-.01v-.01h.01v-.01h.01v-.01h.01v-.01h.01v-.01h.01l.01-.01h.01l.01-.01h.02V3H9.57z').create()]
			),
			new SVGSymbol(
				'icon-expanded',
				'0 0 14 14',
				[new SVGPath('M8.46.44.17,12.72A1,1,0,0,0,1,14.27H17.56a1,1,0,0,0,.82-1.55L10.1.44A1,1,0,0,0,8.46.44Z').create()]
			)
		];
		
		// Add those symbols to the sprite
		for(index = 0; index < svgSymbols.length; index++) {
			svgValidSpriteDefs = document.querySelector('body > svg[xmlns="http://www.w3.org/2000/svg"][xmlns\\:xlink="http://www.w3.org/1999/xlink"][style^="display: none"]:first-child > defs');

			svgValidSpriteDefs.appendChild(svgSymbols[index].create());
		}

		if (majorNavigationSubMenus) {
			for(index = 0; index < majorNavigationSubMenus.length; index++) {
				// Add a toggle button and hide the sub-menu
				var subMenuName = majorNavigationSubMenus[index].previousElementSibling.textContent;

				majorNavigationSubMenus[index].insertAdjacentElement('beforebegin', new ToggleButton(subMenuName, 'Sub-Menu', 'nextSibling', 'icon-collapsed', 'icon-expanded').create());
				majorNavigationSubMenus[index].hidden = true;
			}
		}

		// If the user has a small viewport, modify the Major Navigation
		if (window.innerWidth <= 992) {
			// Append the <button> to the Major Navigation
			majorNavigationList.insertAdjacentElement('beforebegin', new MajorNavigationToggleButton(majorNavigationList.previousElementSibling.textContent, 'Menu', 'allSiblings').create());

			// Hide the adjacent content
			majorNavigationList.hidden = true;			
		}

		// window.addEventListener('resize', function () {
		// 	window.setTimeout(adjustForViewport, 200);
		// });

		window.addEventListener('resize', function () {
			var timeout;

			if (!timeout) {
				timeout = setTimeout(function() {

					// Reset timeout
					timeout = null;

					// Run our resize function
					adjustForViewport();

				}, 66);
			}
		});

		document.querySelector('html').dataset.js = 'true';
}());