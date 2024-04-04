class DartboardComponent extends HTMLElement {
	constructor() {
		super();
		this._shadowRoot = this.attachShadow({ mode: 'open' });
		this._shadowRoot.innerHTML = `${this._boardHtml()} ${this._boardCss()}`;
	}

	_boardHtml() {
		return `
			<img src="dartboard.svg">
			<div class="dartboard miss">
				<div class="scores">
				    ${[20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5].map(a => `
					<div data-score="${a}" class="section section-${a}">
					    <div class="double"></div>
					    <div class="triple"></div>
					</div>`).join('')}
					<div data-score="25" class="section-bull">
					    <div class="double"></div>
					</div>
				</div>
			</div>
	    `;
	}

	_boardCss() {
		return `
			<style>
			  :host {
			    --size: 600px;
			    position: relative;
			    display: block;
			    width: var(--size);
			    aspect-ratio: 1 / 1;
			  }
			  
			  img {
				  width: 100%;
				  height: 100%;
				  position: absolute;
			  }
			
		      .dartboard {
			      --section-height: calc(var(--size) / 10 * 3.8);
			      --section-width: calc(var(--section-height) * pi / 10);
			      border-radius: 50%;
			      background-color: transparent;
				  width: 100%;
				  height: 100%;
		      }
		      
		      .scores {
		        background-color: transparent;
		        width: calc(var(--section-height) * 2);
		        aspect-ratio: 1 / 1;
		        position: absolute;
	            left: 50%;
	            top: 50%;
	            transform: translateX(-50%) translateY(-50%);
	            border-radius: 50%;
	            overflow: hidden;
		      }
		      
		      .section {
		        position: absolute;
		        left: 50%;
		        top: 50%;
		        transform: translateX(-50%) translateY(-100%);
		        background-color: transparent;
		        height: var(--section-height);
		        width: var(--section-width);
		        clip-path: polygon(0 0, 100% 0, 100% 0, 50% 100%, 0 0);
		      
			      .double, .triple {
			        position: absolute;
			        top: 0;
			        height: calc(var(--section-height) / 14);
		            width: 100%;
			        background-color: transparent;
			      }
			      
			      .triple {
			        top: 37.5%;
			        height: calc(var(--section-height) / 18);
			      }
		      }
		      
		      .section-bull {
		        transform-origin: center center;
		        position: absolute;
		        top: 50%;
		        left: 50%;
		        transform: translateX(-50%) translateY(-50%);
		        height: calc(var(--size) / 14);
		        aspect-ratio: 1 / 1;
	            border-radius: 50%;
		        
		        .double {
		            width: 40%;
		            height: 40%;
		            left: 50%;
		            top: 50%;
		            transform: translateX(-50%) translateY(-50%);
		            border-radius: 50%;
		            position: absolute;
		        }
		      }
		      
		      .section:hover:not(:has(.double:hover)):not(:has(.triple:hover)), .section-bull:hover:not(:has(.double:hover)) {
		          background-color: orange !important;
		          opacity: 0.3;
		      }
		      
		      .double:hover, .triple:hover {
                  background-color: orange !important;
		          opacity: 0.6;
		      }
		      
                ${[20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5].map((a, i) => `
			      .section-${a} {
			        transform-origin: bottom center;
			        transform: translateX(-50%) translateY(-100%) rotate(${i * 18}deg);
			      }`).join('')}
	        </style>
	    `;
	}

	connectedCallback() {
		this._shadowRoot.querySelectorAll('.dartboard').forEach(section => {
			section.addEventListener('click', (event) => {
				if (event.target.classList.contains('miss')) {
					this.dispatchEvent(new CustomEvent('section-hit', {
						detail: {
							sectionNumber: 0,
							double: false,
							triple: false
						}
					}));
				} else {
					const target = 'data-score' in event.target.attributes ? event.target : event.target.parentNode;
					const sectionNumber = parseInt(target.attributes['data-score']?.value);

					const double = event.target.classList?.contains('double');
					const triple = event.target.classList?.contains('triple');

					this.dispatchEvent(new CustomEvent('section-hit', {
						detail: {
							sectionNumber,
							double,
							triple
						}
					}));
				}
			});
		});
	}
}

customElements.define('dart-board', DartboardComponent);
