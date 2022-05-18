import {defineTag,BaseHTMLElement} from  "./core.js"

defineTag('list-channel',class extends BaseHTMLElement {

	onItemClick(e){
		let index=e.currentTarget.getAttribute('index')
		let item=this.items[index]
		this.findCallback('item-click')?.(item.url)
	}
	submit(items){
		this.items = items
		this.render()
	}

	build(){
		this.items = this.findAttrValue("items") || []
		const style=`
		<style>
		.container{
			display :flex;
			flex-direction:column;
			gap:20px;
			padding:10px 0px;
		}
		
		h1{
			font-size: 16px;
			font-weight: normal;
		}
		div[index] {
			cursor:pointer;
			display:"flex";
			gap:10px;
			padding:0px 10px;
		}

		div[index]:hover{
			background:whitesmoke;
		}
		</style>
		`
		return `
		${style}
		<div class='container'>
		${this.items.map((it,index)=> `
			<div index='${index}'">
			<h1>${it.title}</h1>
			</div>`)
		.join("")}
		</div>
		`
	}

	onRendered(){
		for (let item of this.$$('div[index]')){
			item.onclick = this.onItemClick.bind(this)
		}
	}

})