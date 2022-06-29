const main_div = d3.select('.team-content-wrapper').append('svg'),
		defs = main_div.append('defs'),
		svg_group = main_div.append('g').attr('class','svg-g').attr('transform',"translate(80, 200)");

		if (window.innerWidth > 900){
			d3.select('svg').attr('viewBox','0 0 800 1000');
			var center = 100, width = 500;
		} else {
			d3.select('svg').attr('viewBox','0 0 600 1500');
			var center = 0, width = 1100;
		}

		var simulation = d3.forceSimulation()
			.force('charge', d3.forceManyBody().strength(5))
			.force('x', d3.forceX().x(function(d) {
			return center;
			}))
			.force('collision', d3.forceCollide().radius(function(d) {
			return 85;
			}));

		d3.csv("https://datacult.github.io/website-team-visual/team-viz.csv").then(function(data) {
		var numNodes = data.length;
		var nodes = d3.range(numNodes).map(function(d, i) {
			return {
				id: i,
				role: Math.random()*width
			}
		});

		simulation.nodes(nodes).force('y', d3.forceY().y(function(d) {
		return d.role;
		}))

		var colorScale = ['#2E6DF6','#FBAF84', '#EA3580','#D8C0ED'];
		var colorText = ['#FFFFFF','#000000', '#FFFFFF','#000000'];
		var team = ['Analytics','Strategy','Studio','Leadership']
		var teamScale = d3.scaleOrdinal()
					.domain(team)
					.range(colorScale)
		var textScale = d3.scaleOrdinal()
					.domain(team)
					.range(colorText)

		var indShape = ['M4.44089 9.4H8.55854V5.2H12.6762V1H4.44089V9.4ZM4.44089 9.4H0.323242V13.6H4.44089M4.44089 9.4V13.6M4.44089 13.6H8.55854V17.8H12.6762V22H4.44089V13.6Z',
						'M4.38552 9.4L8.46199 9.4L8.46199 22L12.5385 22L12.5385 9.4L16.6149 9.4M4.38552 9.4L4.38552 5.2L8.46199 5.2L8.46199 1L12.5385 1L12.5385 5.2L16.6149 5.2L16.6149 9.4M4.38552 9.4L4.38552 13.6L0.309053 13.6L0.309052 9.4L4.38552 9.4ZM16.6149 9.4L20.6914 9.4L20.6914 13.6L16.6149 13.6L16.6149 9.4Z',
						'M12.6 0H8.4L8.4 6.16H4.2V1.96H0V6.16H4.2V14.56H0V18.76H4.2V14.56H8.4L8.4 21H12.6L12.6 14.56H16.8V18.76H21V14.56H16.8V6.16H21V1.96H16.8V6.16H12.6L12.6 0Z',
						'M17.8 5.2H22V1H17.8V5.2ZM17.8 5.2V9.4H13.6M17.8 5.2H13.6V9.4M13.6 9.4H9.4V13.6M13.6 9.4L13.6 13.6L9.4 13.6M9.4 13.6H5.2V17.8M9.4 13.6V17.8H5.2M5.2 17.8H1V22H5.2V17.8Z'];
		var industry = ['Engineering','Tech','Arts/Design','People']
		var industryScale = d3.scaleOrdinal()
					.domain(industry)
					.range(indShape)

		var funColorScale = ['#B06BEC','#0044D8','#FF975C','#D72F74'];
		var fun = ['Coffee','Tea','OJ','Custard']
		var funScale = d3.scaleOrdinal()
					.domain(fun)
					.range(funColorScale)

		

		// IMAGE
		var logo_size = 250;

		var scl = 1.4, group_width = 165/scl, group_height = 170/scl;

		var mask =  defs
				.selectAll(".logo-clip")
				.data(nodes)
				.join("clipPath")
				.attr("id", d => "logo-clip-" + d.id)
				.attr('class', 'logo-clip')

			mask
				.append("rect")
				.attr('class','logo-clip-rect')
				.attr('width', group_width)
				.attr('height', group_height)
				.attr('rx', 40/scl);


			var head_group = svg_group
				.selectAll('.headshot')
				.data(nodes)
				.join('g')
				.attr("class","headshot")
				.attr("id",d => "headshot"+d.id)

			head_group
				.selectAll('.name')
				.data(d => [d])
				.join('text')
				.attr('class','name')
				.attr('text-anchor','middle')
				.style('font-family','Inter')
				.style('font-size',12)
				.style('font-weight','bold')
				// .append('textPath')
				// .attr('xlink:href',d=>'#rect'+d.id)
				.text(function(d) {
					return data[d.id].Name;
				}); 

			var head_group_rect = head_group
				.selectAll('.headshot_rect')
				.data(d=>[d])
				.join('g')
				.attr('class','headshot_rect')
				.attr("id",d => "headshot_rect"+d.id)
				.attr("clip-path", d => "url(#logo-clip-" + d.id + ")");

				head_group_rect
					.selectAll('rect')
					.data(d => [d])
					.join('rect')
					.attr('class','background')
					.attr('id',d=>'rect'+d.id)
					.attr('width', group_width)
					.attr('height', group_height)
					.attr('rx', 40/scl)
					.attr('fill', function(d) {
				return teamScale(data[d.id].Team);
				});

				
			
			head_group_rect
				.selectAll('.professional_image')
				.data(d => [d])
				.join('image')
				.attr("class",'professional_image')
					.attr('href', function(d){
						return 'https://datacult.github.io/website-team-visual/headshots/'+data[d.id].Headshot;
					})
				

			head_group_rect
				.selectAll('.title_top')
				.data(d => [d])
				.join('text')
				.attr('class','title_top')
				.attr('text-anchor','middle')
				.style('font-family','Inter')
				.style('font-size',8.5)
				.style('font-weight',300)
				.style('fill', d => textScale(data[d.id].Team))
				.text(function(d) {
				var txt, splt = data[d.id].Title.split(' ');
				splt.length == 4 ? txt = splt[0]+' '+splt[1]: txt=data[d.id].Title;
				return txt
				}); 

			head_group_rect
				.selectAll('.title_bottom')
				.data(d => [d])
				.join('text')
				.attr('class','title_bottom')
				.attr('text-anchor','middle')
				.style('font-family','Inter')
				.style('font-size',8.5)
				.style('font-weight',300)
				.style('fill', d => textScale(data[d.id].Team))
				.text(function(d) {
				var txt, splt = data[d.id].Title.split(' ');
				splt.length == 4 ? txt = splt[2]+' '+splt[3]: txt='';
				return txt
				}); 

			head_group_rect
				.selectAll('.pronouns')
				.data(d => [d])
				.join('text')
				.attr('class','pronouns')
				.attr('text-anchor','middle')
				.style('font-family','Inter')
				.style('font-size',8)
				.style('font-weight',300)
				.style('fill', d => textScale(data[d.id].Team))
				.text(function(d) {
					return data[d.id].Pronouns.split('/')[0] + ' /';
				}); 

			head_group_rect
				.selectAll('.pronouns_bottom')
				.data(d => [d])
				.join('text')
				.attr('class','pronouns_bottom')
				.attr('text-anchor','middle')
				.style('font-family','Inter')
				.style('font-size',8)
				.style('font-weight',300)
				.style('fill', d => textScale(data[d.id].Team))
				.text(function(d) {
					return data[d.id].Pronouns.split('/')[1];
				}); 

			head_group_rect
				.selectAll('.lil_circle')
				.data(d => [d])
				.join('circle')
				.attr('class','lil_circle')
				.attr('r', 10)
				.attr('fill', 'white');

			head_group_rect
				.selectAll('.industry_path')
				.data(d => [d])
				.join('path')
				.attr('class','industry_path')
				.attr('id',d=> 'industry_path'+d.id)
				.attr('d',  function(d) {
				return industryScale(data[d.id].Industry);
				})
				.attr('fill', function(d) {
				return funScale(data[d.id].Morning);
				})

			var time = [0,1,2,3,4,5,6,7,8,9]

			var timeScale = d3.scaleOrdinal()
					.domain(['1','0','-1','-2','-3','-4','-5','-6','-7','-8'])
					.range(time)

			time.forEach( function(i){
			head_group_rect
				.selectAll('#line_tz'+i)
				.data(d => [d])
				.join('line')
				.attr('class','line_tz')
				.attr('id','line_tz'+i)
				.attr('stroke', function(d){
				return timeScale(data[d.id].Timezone)==i?'black':'white'});
				
			})

			head_group_rect
			.selectAll('.personality_pic')
			.data(d => [d])
			.join('image')
			.attr("class",'personality_pic')
			.attr("id",d => "personality_pic"+d.id)
		.attr('href', function(d){
							return 'https://datacult.github.io/website-team-visual/personality/'+data[d.id].Personality;
						})
			.attr('display','none');

			head_group
			.style('pointer-events','all')
			.on("mouseover", function() {
				var id = this.id.split('t')[1], ppic = '#personality_pic'+id

				head_group.select(ppic).attr('display',1);
			})
			.on("mouseout", function() {
				var id = this.id.split('t')[1], ppic = '#personality_pic'+id

				head_group.select(ppic).attr('display','none');
			}); 

			simulation
			.nodes(nodes)
			.on('tick', ticked);

		function ticked() {
		
		

		head_group
				.attr("x", function(d) { return d.x; })
				.attr("y", function(d) { return d.y; })
				.selectAll('.background')
				.attr('x', d => d.x+150)
				.attr('y', d => d.y+5);
		
		mask
				.selectAll('.logo-clip-rect')
				.attr('x', d => d.x+150)
				.attr('y', d => d.y+5);

		head_group
				.selectAll('.professional_image')
				.attr('transform', function(d) {
				var x = d.x+155+5, y = d.y+25+6.5
				return 'translate('+x+','+y+') scale(.19)';
				});

		head_group
				.selectAll('.name')
					.attr('x', d => d.x+150+group_width/2)
				.attr('y', d => d.y)

		head_group
				.selectAll('.title_top')
					.attr('x', d => d.x+150+group_width/2)
				.attr('y', d => data[d.id].Title.split(' ').length == 4 ? d.y+20 :d.y+26)
				
		head_group
				.selectAll('.title_bottom')
					.attr('x', d => d.x+150+group_width/2)
				.attr('y', d => d.y+32)  
				
		head_group
				.selectAll('.pronouns')
					.attr('x', d => d.x+150+group_width/1.2)
				.attr('y', d => d.y+20+group_height/3.5-7)

		head_group
				.selectAll('.pronouns_bottom')
					.attr('x', d => d.x+150+group_width/1.2)
				.attr('y', d => d.y+20+group_height/3.5+3)

		head_group
				.selectAll('.lil_circle')
					.attr('cx', d => d.x+150+group_width/1.2)
				.attr('cy', d => d.y+20+group_height/2.1)

		head_group
				.selectAll('.industry_path')
				.attr('transform', function(d) {
					var path_dim = document.getElementById('industry_path'+d.id).getBBox()
					var x = d.x+150+group_width/1.2-path_dim.width/4
					var y = d.y+20+group_height/2.1-path_dim.height/4
				return 'translate('+x+','+y+') scale(.5)';
				});

			time.forEach( function(i){
			head_group
				.selectAll('#line_tz'+i)
				.attr('x1',d => d.x+162)
				.attr('x2',d => d.x+174)
				.attr('y1',d => d.y+45+5*i)
				.attr('y2',d => d.y+45+5*i) 
			})

		head_group
				.selectAll('.personality_pic')
				.attr('transform', function(d) {
					var x = d.x+150, y = d.y+5
					return 'translate('+x+','+y+') scale(.061)';
				})
		}
		
		});