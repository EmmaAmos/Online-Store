const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'e6b1393046msh5d1f82d89be5041p122128jsn3344cbaec0aa',
		'X-RapidAPI-Host': 'google-search72.p.rapidapi.com'
	}
};

fetch('https://google-search72.p.rapidapi.com/search?query=word%20cup&gl=us&lr=en&num=10&start=0&sort=relevance', options)
	.then(response => response.json())
	.then(response => console.log(response))
	.catch(err => console.error(err));