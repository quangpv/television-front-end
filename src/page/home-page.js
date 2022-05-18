import {datasource} from "../datasource.js"
import {BaseHTMLElement} from  "../core.js"

import "../widget/top-bar.js"
import "../widget/channel-list.js"

customElements.define('home-page',class extends BaseHTMLElement {
	constructor(){
		super(false)
		this.loading = false
		this.originalItems=[]
		this.items = []
		this.onRefreshClick()
	}

	onItemClick(url){
		window.location.href=url
	}

	onSearch(text){
		if(text.length == 0){
			this.items = this.originalItems;
			return
		}
		text = text.toLowerCase()
		this.items = this.originalItems.filter(it=>it.title.toLowerCase().includes(text) || it.id.includes(text))
		this.$('list-channel').submit(this.items)
	}

	onRefreshClick(){
		this.error=null;
		this.loading=true;
		this.render()

		datasource.fetchList()
		.then(it=>{
			this.originalItems=it;
			this.onSearch('')
		})
		.catch(e=>{this.error=e})
		.finally(()=>{
			this.loading=false;
			this.render();
		})
	}

	onTitleClick(){
		alert("Television")
	}

	onLogoutClick(){
		localStorage.removeItem('token')
		window.location='#/login'
	}

	build(){
		const style=`
		<style>
		.container{
			display:flex; 
			flex-direction:column;
			height:100%;
			gap:10px;
		}
		.list-container {
			display:flex;
			flex:1;
			overflow:auto;
			border-radius:5px; 
			border: 1px solid #DDD;
			align-items:start;
			justify-content:center;

		}
		.list-container > p {
			align-self: center;
		}
		list-channel {
			width:100%;
		}
		.error{
			color:red;
			font-weight:bold;
		}

		</style>`

		const loadingSection =  `<p>...Loading</p>` 
		const errorSection = `<p class='error'>${this.error}</p>`
		const listSection = `<list-channel items="$items" item-click=${this.onItemClick.name}></list-channel>`
		return `
		${style}
		<div class='container'>
		<top-bar 
		logout-click='${this.onLogoutClick.name}'
		refresh-click='${this.onRefreshClick.name}' 
		search='${this.onSearch.name}' 
		title-click='${this.onTitleClick.name}'>
		</top-bar>
		<div class='list-container'>
		${this.loading ? loadingSection : this.error? errorSection :listSection}
		</div>
		</div>
		`
	}
})