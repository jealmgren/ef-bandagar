Vue.component('route-trackinfo', {
	data() {
		return {
      circuits: [],
      labels: []
		}
	},
	methods: {
	},
	created() {
		fetch('/api/getCircuits')
		.then(res => res.json())
		.then(data => {
      this.circuits = data.circuits;
      this.labels = data.columns;
		})
	},
  template: `
<div class="container">
    <div class="bd-example">
        <div id="carouselExampleCaptions" class="carousel slide" data-ride="carousel">
            <div class="carousel-inner">
                <div class="carousel-item active" v-for="circuit in circuits">
                    <img src="https://www5.idrottonline.se/globalassets/falkenbergs-mk---bilsport2/bilder/loggor-kartor-m.m/falkenbergs-motorbana-vy.jpg" class="d-block w-100" alt="...">
                    <div class="carousel-caption d-none d-md-block">
                        <h5>{{ circuit.name }}</h5>
                        <p>{{ circuit.info }}</p>
                    </div>
                </div>
            </div>
            <a class="carousel-control-prev" href="#carouselExampleCaptions" role="button" data-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="sr-only">Previous</span>
            </a>
            <a class="carousel-control-next" href="#carouselExampleCaptions" role="button" data-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="sr-only">Next</span>
            </a>
        </div>
    </div>
</div>
	`
});
