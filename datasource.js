const URL='https://media-quangpv.duckdns.org/playlist'

export const datasource = {
	fetchList(){
		return fetch(URL).then(it => {
			return it.json()
		})
	}
}